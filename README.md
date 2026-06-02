# RED Activa 2.0 · Desktop App
### Desarrollado por BAP Partners

---

## 🚀 Instalación y Uso

### Requisitos
- [Node.js](https://nodejs.org) versión 18 o superior
- npm (viene incluido con Node.js)

---

### Paso 1 — Instalar dependencias
Abrí una terminal en esta carpeta y ejecutá:
```bash
npm install
```

### Paso 2 — Ejecutar en modo desarrollo
```bash
npm start
```
Esto abre la app directamente sin compilar.

---

## 📦 Compilar el instalador

### Windows (.exe instalador)
```bash
npm run build-win
```
El instalador queda en `dist/RED Activa 2.0 Setup 1.0.0.exe`

### macOS (.dmg)
```bash
npm run build-mac
```

### Linux (.AppImage)
```bash
npm run build-linux
```

---

## 🔄 Actualizar la aplicación

Cuando recibas un `index.html` actualizado de BAP Partners:

1. Reemplazá el archivo `src/index.html` con el nuevo
2. Si la app está corriendo, cerrala y volvé a ejecutar `npm start`
3. Para regenerar el instalador, volvé a ejecutar `npm run build-win`

**No necesitás tocar ningún otro archivo** — toda la lógica vive en `src/index.html`.

---

## 📁 Estructura del proyecto

```
RedActiva-Desktop/
├── main.js          ← Proceso principal de Electron (ventana, menús, diálogos)
├── preload.js       ← Puente seguro entre Electron y la app HTML
├── package.json     ← Configuración del proyecto y dependencias
├── src/
│   ├── index.html   ← ⭐ La aplicación completa (reemplazar para actualizar)
│   ├── icon.ico     ← Ícono Windows (opcional, reemplazar con el tuyo)
│   ├── icon.icns    ← Ícono macOS (opcional)
│   └── icon.png     ← Ícono Linux / fallback (opcional)
└── dist/            ← Carpeta de salida de compilación (se crea sola)
```

---

## ⌨️ Atajos de teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl+S` | Guardar Snapshot (diálogo nativo) |
| `Ctrl+O` | Abrir Snapshot desde disco |
| `Ctrl+E` | Exportar Excel |
| `F11` | Pantalla completa |
| `Ctrl+R` | Recargar |
| `Ctrl+Shift+I` | Herramientas de desarrollo |

---

## 💾 Datos y almacenamiento

Los datos se guardan en el **localStorage de Electron**, que persiste entre sesiones.
La ubicación exacta depende del sistema operativo:

- **Windows:** `C:\Users\[Usuario]\AppData\Roaming\redactiva-desktop`
- **macOS:** `~/Library/Application Support/redactiva-desktop`
- **Linux:** `~/.config/redactiva-desktop`

Para respaldar o compartir datos, usá siempre **Archivo → Guardar Snapshot**.

---

## ❓ Soporte
**BAP Partners** · bappartners.com
