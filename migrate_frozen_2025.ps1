##############################################################################
# migrate_frozen_2025.ps1
# Migra los snapshots congelados de UY 2025 y CH 2025 a Supabase.
#
# ANTES DE CORRER ESTE SCRIPT:
#   1. En el SQL Editor de Supabase, ejecutar:
#      ALTER TABLE audits ADD COLUMN IF NOT EXISTS frozen boolean DEFAULT false;
#
#   2. Tener los archivos de snapshot en:
#      C:\Users\Lenovo\Desktop\RedActiva-Desktop\Varios\
#      - RedActiva_URUGUAY_2025_FROZEN.html
#      - RedActiva_CHILE_2025_FROZEN.html
##############################################################################

$SBURL = 'https://fkyifkbfgdxgmwbgnhud.supabase.co'
$SBKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZreWlma2JmZ2R4Z213YmduaHVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4OTkxMDYsImV4cCI6MjA5NTQ3NTEwNn0.lHuJ3onWCd0v2LWp5Sftzc_kdWR59ar_7oRqsgwYA8M'

$headers = @{
    'apikey'        = $SBKEY
    'Authorization' = "Bearer $SBKEY"
    'Content-Type'  = 'application/json'
    'Prefer'        = 'resolution=merge-duplicates,return=minimal'
}

function Extract-SnapData($htmlPath) {
    $content = Get-Content $htmlPath -Raw -Encoding UTF8
    $idx = $content.IndexOf('id="__snap_embed__"')
    if ($idx -lt 0) { throw "No se encontro __snap_embed__ en $htmlPath" }
    $start = $content.IndexOf('>', $idx) + 1
    $end   = $content.IndexOf('</div>', $start)
    return $content.Substring($start, $end - $start).Trim()
}

function Build-Row($audit, $pais) {
    return @{
        id          = [string]$audit.id
        distribuidor = $audit.distribuidor
        edicion     = $audit.edicion
        pais        = $pais
        fecha       = if ($audit.fecha) { $audit.fecha } else { '' }
        auditor     = if ($audit.auditor) { $audit.auditor } else { '' }
        answers     = $audit.answers
        comments    = if ($audit.comments) { $audit.comments } else { [pscustomobject]@{} }
        scores      = $audit.scores
        weights     = if ($audit.weights) { $audit.weights } else { [pscustomobject]@{} }
        frozen      = $true
        updated_at  = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
    }
}

Write-Host "`n=== MIGRACION FROZEN 2025 ===" -ForegroundColor Cyan

# ── PASO 1: Leer snapshots ────────────────────────────────────────────────────
$variosPath = "C:\Users\Lenovo\Desktop\RedActiva-Desktop\Varios"
$uyHtml = Join-Path $variosPath "RedActiva_URUGUAY_2025_FROZEN.html"
$chHtml = Join-Path $variosPath "RedActiva_CHILE_2025_FROZEN.html"

Write-Host "Leyendo UY snapshot..." -ForegroundColor Yellow
$uyJson = Extract-SnapData $uyHtml
$uyData = $uyJson | ConvertFrom-Json

Write-Host "Leyendo CH snapshot..." -ForegroundColor Yellow
$chJson = Extract-SnapData $chHtml
$chData = $chJson | ConvertFrom-Json

Write-Host "UY: $($uyData.saved.Count) auditorias" -ForegroundColor Green
Write-Host "CH: $($chData.saved.Count) auditorias" -ForegroundColor Green

# ── PASO 2: Construir filas ───────────────────────────────────────────────────
$rows = @()
foreach ($a in $uyData.saved) { $rows += Build-Row $a 'URUGUAY' }
foreach ($a in $chData.saved) { $rows += Build-Row $a 'CHILE' }
Write-Host "Total filas a upsert: $($rows.Count)" -ForegroundColor Cyan

# ── PASO 3: Borrar registros 2025 existentes de UY y CH ──────────────────────
Write-Host "`nBorrando registros 2025 existentes de UY y CH..." -ForegroundColor Yellow

$uyDists = ($uyData.saved | ForEach-Object { [uri]::EscapeDataString($_.distribuidor) }) -join ','
$chDists = ($chData.saved | ForEach-Object { [uri]::EscapeDataString($_.distribuidor) }) -join ','

# Supabase REST DELETE con filtro in()
# Borramos todos los registros edicion=2025 para los distribuidores de cada pais
try {
    # UY
    $uyDistList = ($uyData.saved | ForEach-Object { '"' + $_.distribuidor.Replace('"','\"') + '"' }) -join ','
    $delUyUri = "$SBURL/rest/v1/audits?edicion=eq.2025&distribuidor=in.($uyDistList)"
    $r = Invoke-RestMethod -Uri $delUyUri -Method DELETE -Headers $headers
    Write-Host "  Borrados UY 2025: OK" -ForegroundColor Green
} catch {
    Write-Host "  Aviso al borrar UY: $($_.Exception.Message)" -ForegroundColor DarkYellow
}

try {
    # CH
    $chDistList = ($chData.saved | ForEach-Object { '"' + $_.distribuidor.Replace('"','\"') + '"' }) -join ','
    $delChUri = "$SBURL/rest/v1/audits?edicion=eq.2025&distribuidor=in.($chDistList)"
    $r = Invoke-RestMethod -Uri $delChUri -Method DELETE -Headers $headers
    Write-Host "  Borrados CH 2025: OK" -ForegroundColor Green
} catch {
    Write-Host "  Aviso al borrar CH: $($_.Exception.Message)" -ForegroundColor DarkYellow
}

# ── PASO 4: Upsert en lotes de 20 ────────────────────────────────────────────
Write-Host "`nInsertando datos congelados en Supabase..." -ForegroundColor Yellow
$batchSize = 20
$ok = 0
$errors = 0

for ($i = 0; $i -lt $rows.Count; $i += $batchSize) {
    $batch = $rows[$i .. [Math]::Min($i + $batchSize - 1, $rows.Count - 1)]
    $body = $batch | ConvertTo-Json -Depth 20 -Compress
    try {
        Invoke-RestMethod -Uri "$SBURL/rest/v1/audits?on_conflict=id" `
            -Method POST -Headers $headers -Body $body | Out-Null
        $ok += $batch.Count
        Write-Host "  Lote $([Math]::Ceiling(($i+1)/$batchSize)): $($batch.Count) registros OK" -ForegroundColor Green
    } catch {
        $errors += $batch.Count
        Write-Host "  ERROR lote $([Math]::Ceiling(($i+1)/$batchSize)): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== RESULTADO ===" -ForegroundColor Cyan
Write-Host "Insertados OK: $ok" -ForegroundColor Green
if ($errors -gt 0) { Write-Host "Con errores:  $errors" -ForegroundColor Red }
Write-Host "`nListo! Abrí Netlify y recargá la pagina para ver los datos actualizados." -ForegroundColor Cyan
