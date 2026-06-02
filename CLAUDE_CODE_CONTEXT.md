# RED Activa 2.0 — Contexto para Claude Code

## Proyecto
App de escritorio **Electron 28 + HTML5 vanilla** para auditorías BPL (Best Practices Logistics) de distribuidores de Arcor en Chile.
Desarrollada bajo **BAP Partners** (Pablo, consultoría FP&A + AI).

**Estructura del proyecto:**
```
RedActiva-Desktop/
├── main.js          ← proceso principal Electron
├── preload.js       ← expone electronAPI al renderer
├── src/
│   ├── index.html   ← TODA la app (UI + lógica JS, ~6400 líneas)
│   └── pptxgen.bundle.js  ← PptxGenJS inlinado
├── package.json
└── dist/            ← output de electron-builder
```

**Compilar:** `npm run build-win`  
**Dev:** `npm start`

---

## Arquitectura del index.html

Todo en un solo archivo HTML. Variables globales clave:

```js
let Q = [...]          // Array de preguntas (comp_num, sheet, bpl_num, bpl_name, subattr, question, critico, weight_attr)
let saved = [...]      // Array de auditorías guardadas [{distribuidor, edicion, answers:{}, scores:{}, frozen:bool}]
let CRIT_LIST = [...]  // Array de BPL críticos [{tag, qs:[comp_nums], sheet}]
let AC = {}            // Area colors  {IFT:'#1565c0', PLG:'#6a1b9a', ...}
let AN = {}            // Area names   {IFT:'Infraestructura', ...}
let AW = {}            // Area weights {IFT:0.25, PLG:0.25, ...}
let cfg = {}           // Config persistida en localStorage
let MATRIX_CFG = {}    // Configuración de la matriz de categorías
```

**Persistencia (Electron):** `localStorage` con partición `persist:redactiva`
- `bpl_ra2_v6` → `saved[]`
- `bpl_q_custom_v1` → `Q` personalizado
- `bpl_cfg_v5` → `cfg` (pesos, umbrales)
- `bpl_areas_cfg_v1` → `AC`, `AN`
- `bpl_matrix_cfg_v1` → `MATRIX_CFG`

**Snapshots:** HTML autocontenido generado por `exportSnapshot()`. Embebe todos los datos en `<div id="__snap_embed__">JSON...</div>`. Los snapshots se comparten para consulta en Chrome (solo lectura).

---

## IPC Electron (main.js ↔ preload.js ↔ renderer)

```js
// Expuesto via preload.js:
electronAPI.onOpenSnapshot(cb)     // Ctrl+O → abrir snapshot
electronAPI.onMergeSnapshot(cb)    // Ctrl+M → fusionar snapshot
electronAPI.onTriggerSnapshot(cb)  // Ctrl+S → guardar snapshot
electronAPI.onTriggerExcel(cb)     // Ctrl+E → exportar Excel
electronAPI.readFile(path)         // leer archivo del disco
electronAPI.saveSnapshot({html, filename})
electronAPI.saveExcel({buffer, filename})
electronAPI.savePptx({buffer, filename})
```

---

## Estado actual — Bugs activos

### Bug 1: No se pueden crear nuevas áreas/atributos/BPLs en secuencia

**Síntoma:** El usuario crea un Área nueva en Config → crea un Atributo → intenta crear un BPL o Pregunta y falla con "Seleccioná un área/atributo primero" o simplemente no hace nada.

**Causa diagnosticada:**
- `loadCfg()` hace `AW = {...cfg.aw}` (replace total) borrando áreas nuevas creadas en memoria pero no persistidas en `cfg.aw`
- `edDeleteArea()` no sincroniza `cfg.aw` → el área borrada reaparece en el próximo `loadCfg()`
- El editor (`ED.area`, `ED.bplnum`) se desincroniza del DOM cuando `rebuildAll()` o `flushFormIfDirty()` reconstruyen el formulario

**Fixes intentados (parcialmente aplicados):**
- `loadCfg()` debería hacer `Object.assign(AW, cfg.aw)` (merge, no replace)
- `edAddArea()` debería sincronizar `cfg.aw = {...AW}` y persistir a localStorage inmediatamente
- `edDeleteArea()` ídem
- `edAddBplName()` debería generar subattr único basado en bpl_num (no siempre 'NUEVO BPL')

### Bug 2: Cargar snapshots falla silenciosamente después de ciertas operaciones

**Síntoma:** Después de borrar un área o hacer ciertas operaciones en Config, Archivo → Abrir Snapshot no hace nada o muestra error.

**Causa diagnosticada:**
- `onOpenSnapshot` tiene un `try-catch` que rodea todo, incluyendo `rebuildAll()`
- `rebuildAll()` llamaba `edInitAreas()` internamente — si este fallaba, el catch silenciaba el error y el snapshot no cargaba
- **Fix aplicado:** `edInitAreas()` removida de `rebuildAll()` y `flushFormIfDirty()`. El editor se sincroniza solo al entrar a la pestaña Config via `goTab('config')`.

**Estado actual:** El snapshot de Chile 2026 ya carga (Guardadas: 29 ✅). Pero después de borrar un área creada, los snapshots dejan de cargar nuevamente. Probablemente un error en `edDeleteArea()` que no limpia correctamente el estado.

### Bug 3: Snapshots vistos en Chrome muestran resultados incorrectos

**Síntoma:** Al abrir un snapshot `.html` en Chrome, los scores de área aparecen como "—", los críticos muestran ⭕ (pendiente) en vez de ✅/❌, y los contadores de "cumplidos" son incorrectos.

**Causa diagnosticada:**
1. `CRIT_LIST` se construye desde `Q_BASE` al iniciar, pero el snapshot puede tener un `Q` custom (via `qCustom`) con estructura de críticos diferente. El IIFE restaura `Q` desde `qCustom` pero no reconstruye `CRIT_LIST`.
2. `displayFrozenScores()` filtraba `critStatus` con `v === 'met'` pero los valores son objetos `{st:'met', pct:0.5}`.
3. `localStorage` en Chrome no tiene datos → `loadCfg()` pisa los valores del snapshot.

**Fixes aplicados:**
- `__IS_SNAPSHOT_BROWSER` detecta snapshot en Chrome y parchea localStorage como no-op
- `cfg` no lee localStorage en snapshot browser
- `persist()` es no-op en snapshot browser
- IIFE reconstruye `CRIT_LIST` desde `qCustom`
- `displayFrozenScores()` itera sobre `Object.entries(critStatus)` en vez de `CRIT_LIST`
- `exportSnapshot()` serializa `Q` (memoria) en vez de `localStorage.getItem('bpl_q_custom_v1')` que puede estar vacío

---

## Funciones clave a revisar

```js
// PERSISTENCIA
function persist()          // saved[] → localStorage
function saveQCustom()      // Q → localStorage  
function loadQCustom()      // localStorage → Q
function saveAreasCfg()     // AC, AN → localStorage
function loadAreasCfg()     // localStorage → AC, AN
function loadCfg()          // localStorage cfg → AW, THR, etc.
function saveMatrixCfg()    // MATRIX_CFG → localStorage

// REBUILD
function rebuildAll()       // reconstruye form + CRIT_LIST + grid
function flushFormIfDirty() // rebuild lazy cuando cambia Q
function rebuildDynamicUI() // reconstruye sidebar, weights, etc.
function edInitAreas()      // sincroniza el editor de estructura con Q/AC

// SNAPSHOTS
function exportSnapshot()         // genera HTML autocontenido
function onOpenSnapshot(filePath) // carga snapshot en la app (Electron)
function mergeSnapshotFromFile()  // fusiona snapshot sin borrar existentes

// SCORES
function computeScores(audit)     // calcula scores desde answers
function displayFrozenScores(a)   // muestra scores guardados (frozen audits)
function recalc()                 // recalcula y actualiza toda la UI de resultados

// EDITOR DE ESTRUCTURA
const ED = { area:'', bplnum:0, subattr:'' }  // estado interno del editor
async function edAddArea()        // crea nueva área
async function edAddBplName()     // crea nuevo atributo (bpl_name)
async function edAddSubattr()     // crea nuevo BPL (subattr)
function edAddQuestion()          // agrega pregunta al subattr actual
function edDeleteArea()           // borra área y todas sus preguntas
```

---

## Historial de cambios recientes (sesión actual)

Todos los cambios están aplicados en `src/index.html`. Commits pendientes.

1. **Rediseño PPTX slides 2, 3, 4** — fondo blanco, legible en proyección
2. **Fix radar center** — `svgRadar()` ahora usa `sc.total` ponderado en vez de promedio simple de áreas
3. **Fix frozen audits** — `recalc()` siempre se llama desde `loadAudit()`, `displayFrozenScores` usa `Object.entries(critStatus)` 
4. **Snapshot browser** — `__IS_SNAPSHOT_BROWSER`, localStorage parcheado, CRIT_LIST reconstruido desde qCustom
5. **exportSnapshot** — serializa `Q` desde memoria no desde localStorage
6. **Editor de estructura** — `loadCfg()` merge en vez de replace, `edAddArea()` persiste cfg.aw, subattr único
7. **`saved[]`** — restaurado para cargar desde localStorage al iniciar (se había roto en paso 4)
8. **`rebuildAll()`** — removida `edInitAreas()` que causaba silenciamiento de errores en onOpenSnapshot

---

## Lo que necesitás resolver

**Prioridad 1:** `edDeleteArea()` rompe la carga de snapshots — investigar por qué y arreglar limpieza de estado después de borrar área.

**Prioridad 2:** Flujo completo de creación de estructura (Área → Atributo → BPL → Pregunta) debe funcionar de forma encadenada sin errores.

**Prioridad 3:** Verificar que el ciclo completo funciona: crear estructura → auditar → guardar snapshot → abrir snapshot en Chrome → resultados correctos.

---

## Notas importantes

- La app **nunca usa React, Vue, ni bundler** — todo vanilla JS en un solo HTML
- Los snapshots son **de solo lectura** — nunca se edita en ellos
- La estructura de preguntas se crea **solo en la app Electron**, nunca en snapshots
- `Q_BASE` es el array hardcodeado en el HTML con las 187 preguntas originales de Chile
- Las personalizaciones van en `qCustom` (localStorage) y se embeben en snapshots
