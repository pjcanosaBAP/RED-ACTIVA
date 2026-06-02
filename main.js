const { app, BrowserWindow, Menu, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Keep a global reference to prevent garbage collection
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: 'RED Activa 2.0 · BAP Partners',
    icon: path.join(__dirname, 'src', process.platform === 'win32' ? 'icon.ico' : 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      // Allow localStorage to work
      partition: 'persist:redactiva'
    },
    // Clean look - no default menu bar
    autoHideMenuBar: false,
    backgroundColor: '#0d1b2e'
  });

  // Load the app
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Build custom menu
  const menu = Menu.buildFromTemplate([
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Abrir Snapshot...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const { filePaths } = await dialog.showOpenDialog(mainWindow, {
              title: 'Abrir Snapshot RED Activa',
              filters: [{ name: 'HTML', extensions: ['html'] }],
              properties: ['openFile']
            });
            if (filePaths.length) {
              mainWindow.webContents.send('open-snapshot', filePaths[0]);
            }
          }
        },
        {
          label: 'Fusionar Edición...',
          accelerator: 'CmdOrCtrl+M',
          click: async () => {
            const { filePaths } = await dialog.showOpenDialog(mainWindow, {
              title: 'Fusionar snapshot — agregar auditorías sin borrar las actuales',
              filters: [{ name: 'HTML Snapshot RED Activa', extensions: ['html'] }],
              properties: ['openFile']
            });
            if (filePaths.length) {
              mainWindow.webContents.send('merge-snapshot', filePaths[0]);
            }
          }
        },
        {
          label: 'Guardar Snapshot...',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('trigger-snapshot');
          }
        },
        { type: 'separator' },
        {
          label: 'Exportar Excel...',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            mainWindow.webContents.send('trigger-excel');
          }
        },
        { type: 'separator' },
        { role: 'quit', label: 'Salir' }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { role: 'reload', label: 'Recargar' },
        { role: 'togglefullscreen', label: 'Pantalla Completa' },
        { type: 'separator' },
        { role: 'zoomin', label: 'Zoom +' },
        { role: 'zoomout', label: 'Zoom -' },
        { role: 'resetzoom', label: 'Zoom normal' },
        { type: 'separator' },
        { role: 'toggledevtools', label: 'Herramientas de Desarrollo' }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Acerca de RED Activa 2.0',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'RED Activa 2.0',
              message: 'RED Activa 2.0 · Auditoría BPL',
              detail: 'Desarrollado por BAP Partners\n© 2025 Todos los derechos reservados\n\nVersión 2.0.0',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => { mainWindow = null; });
}

// ── IPC: Save snapshot to disk ──────────────────────────
ipcMain.handle('save-snapshot', async (event, { html, filename }) => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Guardar Snapshot RED Activa',
    defaultPath: filename,
    filters: [{ name: 'HTML', extensions: ['html'] }]
  });
  if (filePath) {
    fs.writeFileSync(filePath, html, 'utf8');
    return { success: true, path: filePath };
  }
  return { success: false };
});

// ── IPC: Save Excel to disk ──────────────────────────────
ipcMain.handle('save-pptx', async (event, { buffer, filename }) => {
  // app, shell, fs, path already imported at top of file
  
  // Try save dialog first
  let filePath;
  try {
    const desktopPath = path.join(app.getPath('desktop'), filename);
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Guardar Informe RED Activa',
      defaultPath: desktopPath,
      filters: [{ name: 'PowerPoint', extensions: ['pptx'] }]
    });
    if (result.canceled || !result.filePath) {
      // Canceled - save to Desktop automatically
      filePath = desktopPath;
    } else {
      filePath = result.filePath;
    }
  } catch(e) {
    // Dialog failed - save to Desktop
    filePath = path.join(app.getPath('desktop'), filename);
  }
  
  try {
    // Convert buffer (arrives as plain object/array from IPC)
    let buf;
    if (Buffer.isBuffer(buffer)) {
      buf = buffer;
    } else if (Array.isArray(buffer)) {
      buf = Buffer.from(buffer);
    } else if (buffer && buffer.data) {
      buf = Buffer.from(buffer.data);
    } else {
      buf = Buffer.from(Object.values(buffer));
    }
    fs.writeFileSync(filePath, buf);
    // Open containing folder so user sees the file
    shell.showItemInFolder(filePath);
    return { success: true, filePath };
  } catch(e) {
    console.error('PPTX save error:', e);
    return { success: false, error: e.message };
  }
});

// Direct save to Desktop - no dialog
ipcMain.handle('save-pptx-direct', async (event, { buffer, filename }) => {
  try {
    const destPath = path.join(app.getPath('desktop'), filename);
    let buf;
    if (Array.isArray(buffer)) buf = Buffer.from(buffer);
    else if (buffer && buffer.data) buf = Buffer.from(buffer.data);
    else buf = Buffer.from(Object.values(buffer));
    fs.writeFileSync(destPath, buf);
    shell.showItemInFolder(destPath);
    return { success: true, filePath: destPath };
  } catch(e) {
    console.error('Direct PPTX save error:', e);
    return { success: false, error: e.message };
  }
});

ipcMain.handle('save-excel', async (event, { buffer, filename }) => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Exportar Excel RED Activa',
    defaultPath: filename,
    filters: [{ name: 'Excel', extensions: ['xlsx'] }]
  });
  if (filePath) {
    fs.writeFileSync(filePath, Buffer.from(buffer));
    return { success: true, path: filePath };
  }
  return { success: false };
});

// ── IPC: Read snapshot file ──────────────────────────────
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return { success: true, content };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// ── IPC: Open file dialog (for merge button in renderer) ──
ipcMain.handle('open-file-dialog', async () => {
  const { filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Fusionar snapshot — agregar auditorías sin borrar las actuales',
    filters: [{ name: 'HTML Snapshot RED Activa', extensions: ['html'] }],
    properties: ['openFile']
  });
  return filePaths.length ? filePaths[0] : null;
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (!mainWindow) createWindow(); });
