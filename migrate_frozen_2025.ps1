##############################################################################
# migrate_frozen_2025.ps1
# Migra los snapshots congelados de UY 2025 y CH 2025 a Supabase.
#
# IMPORTANTE: Ya corrido el 2026-05-27. Datos OK en Supabase.
#
# Para completar la configuración de frozen, ejecutar en Supabase SQL Editor:
#
#   -- 1. Agregar columna frozen
#   ALTER TABLE audits ADD COLUMN IF NOT EXISTS frozen boolean DEFAULT false;
#
#   -- 2. Marcar UY y CH 2025 como congelados
#   UPDATE audits SET frozen = true WHERE edicion = '2025' AND pais IN ('URUGUAY', 'CHILE');
#
# Este script (si se necesita volver a correr) re-inserta los datos desde
# los snapshots HTML en Varios/.
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

Write-Host "`n=== MIGRACION FROZEN 2025 ===" -ForegroundColor Cyan

$variosPath = "C:\Users\Lenovo\Desktop\RedActiva-Desktop\Varios"
$uyJson = Extract-SnapData (Join-Path $variosPath "RedActiva_URUGUAY_2025_FROZEN.html")
$uyData = $uyJson | ConvertFrom-Json
$chJson = Extract-SnapData (Join-Path $variosPath "RedActiva_CHILE_2025_FROZEN.html")
$chData = $chJson | ConvertFrom-Json

Write-Host "UY: $($uyData.saved.Count) | CH: $($chData.saved.Count)" -ForegroundColor Green

# ── Construir filas ───────────────────────────────────────────────────────────
$rows = @()
$uyData.saved | ForEach-Object {
    $a = $_
    $row = @{
        id           = [string]$a.id
        distribuidor = $a.distribuidor
        edicion      = $a.edicion
        pais         = 'URUGUAY'
        fecha        = if ($a.fecha) { $a.fecha } else { '' }
        auditor      = if ($a.auditor) { $a.auditor } else { '' }
        answers      = $a.answers
        comments     = if ($a.comments) { $a.comments } else { [pscustomobject]@{} }
        scores       = $a.scores
        weights      = if ($a.weights) { $a.weights } else { [pscustomobject]@{} }
        updated_at   = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
    }
    # Add frozen if column exists
    try {
        $testResult = Invoke-RestMethod -Uri "$SBURL/rest/v1/audits?select=frozen&limit=1" `
            -Method GET -Headers $headers -ErrorAction Stop
        $row['frozen'] = $true
    } catch {}
    $rows += $row
}

$chData.saved | ForEach-Object {
    $a = $_
    $row = @{
        id           = [string]$a.id
        distribuidor = $a.distribuidor
        edicion      = $a.edicion
        pais         = 'CHILE'
        fecha        = if ($a.fecha) { $a.fecha } else { '' }
        auditor      = if ($a.auditor) { $a.auditor } else { '' }
        answers      = $a.answers
        comments     = if ($a.comments) { $a.comments } else { [pscustomobject]@{} }
        scores       = $a.scores
        weights      = if ($a.weights) { $a.weights } else { [pscustomobject]@{} }
        updated_at   = (Get-Date).ToUniversalTime().ToString('yyyy-MM-ddTHH:mm:ssZ')
    }
    $rows += $row
}

# ── Borrar 2025 existentes ────────────────────────────────────────────────────
$uyDistFilter = ($uyData.saved | ForEach-Object { '"' + $_.distribuidor.Replace('"','\"') + '"' }) -join ','
$chDistFilter = ($chData.saved | ForEach-Object { '"' + $_.distribuidor.Replace('"','\"') + '"' }) -join ','

try {
    Invoke-RestMethod -Uri "$SBURL/rest/v1/audits?edicion=eq.2025&distribuidor=in.($uyDistFilter)" `
        -Method DELETE -Headers $headers | Out-Null
    Write-Host "UY 2025 borrados OK" -ForegroundColor Green
} catch { Write-Host "Aviso UY delete: $($_.ErrorDetails.Message)" -ForegroundColor DarkYellow }

try {
    Invoke-RestMethod -Uri "$SBURL/rest/v1/audits?edicion=eq.2025&distribuidor=in.($chDistFilter)" `
        -Method DELETE -Headers $headers | Out-Null
    Write-Host "CH 2025 borrados OK" -ForegroundColor Green
} catch { Write-Host "Aviso CH delete: $($_.ErrorDetails.Message)" -ForegroundColor DarkYellow }

# ── Insertar en lotes ─────────────────────────────────────────────────────────
$batchSize = 20; $ok = 0; $errors = 0
for ($i = 0; $i -lt $rows.Count; $i += $batchSize) {
    $batch = $rows[$i .. [Math]::Min($i + $batchSize - 1, $rows.Count - 1)]
    $body = $batch | ConvertTo-Json -Depth 20 -Compress
    try {
        Invoke-RestMethod -Uri "$SBURL/rest/v1/audits?on_conflict=id" `
            -Method POST -Headers $headers -Body $body | Out-Null
        $ok += $batch.Count; Write-Host "  Lote OK: $($batch.Count)" -ForegroundColor Green
    } catch {
        $errors += $batch.Count; Write-Host "  ERROR: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host "`nInsertados: $ok | Errores: $errors" -ForegroundColor Cyan
Write-Host "`nPRÓXIMO PASO: Ejecutar en Supabase SQL Editor:" -ForegroundColor Yellow
Write-Host "  ALTER TABLE audits ADD COLUMN IF NOT EXISTS frozen boolean DEFAULT false;" -ForegroundColor White
Write-Host "  UPDATE audits SET frozen = true WHERE edicion = '2025' AND pais IN ('URUGUAY', 'CHILE');" -ForegroundColor White
