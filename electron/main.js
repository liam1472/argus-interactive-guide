const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let progressWindow = null;
let downloadStartTime = null;
let server;
const PORT = 8080;
const MIN_PROGRESS_DISPLAY_MS = 2000; // Minimum 2 seconds to show progress

// Check if auto-update is supported on this platform
// macOS requires code signing certificate ($99/year Apple Developer Program)
const isAutoUpdateSupported = process.platform !== 'darwin';

// Auto-updater configuration
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// Create progress window for download
function createProgressWindow() {
  progressWindow = new BrowserWindow({
    width: 400,
    height: 160,
    parent: mainWindow,
    modal: true,
    resizable: false,
    minimizable: false,
    maximizable: false,
    closable: false,
    frame: false,
    transparent: false,
    backgroundColor: '#1e1e1e',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const progressHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
          color: #fff;
          padding: 24px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        h3 { 
          font-size: 16px; 
          font-weight: 600; 
          margin-bottom: 16px;
          color: #4fc3f7;
        }
        .progress-container {
          background: #333;
          border-radius: 8px;
          height: 12px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #4fc3f7 0%, #29b6f6 100%);
          width: 0%;
          transition: width 0.3s ease;
          border-radius: 8px;
        }
        .stats {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #aaa;
        }
        .percent { 
          font-weight: 600; 
          color: #4fc3f7;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <h3>⬇️ Downloading Update...</h3>
      <div class="progress-container">
        <div class="progress-bar" id="progressBar"></div>
      </div>
      <div class="stats">
        <span class="percent" id="percent">0%</span>
        <span id="speed">-- MB/s</span>
        <span id="remaining">Calculating...</span>
      </div>
      <script>
        const { ipcRenderer } = require('electron');
        ipcRenderer.on('download-progress', (event, data) => {
          document.getElementById('progressBar').style.width = data.percent + '%';
          document.getElementById('percent').textContent = data.percent + '%';
          document.getElementById('speed').textContent = data.speed;
          document.getElementById('remaining').textContent = data.remaining;
        });
      </script>
    </body>
    </html>
  `;

  progressWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(progressHTML));
}

function closeProgressWindow() {
  if (progressWindow) {
    progressWindow.close();
    progressWindow = null;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatTime(seconds) {
  if (!seconds || seconds === Infinity) return 'Calculating...';
  if (seconds < 60) return Math.round(seconds) + 's remaining';
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return mins + 'm ' + secs + 's remaining';
}

// Send progress to renderer (in-app notification)
function sendProgressToRenderer(data) {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.executeJavaScript(`
      (function() {
        let notification = document.getElementById('update-notification');
        if (!notification) {
          notification = document.createElement('div');
          notification.id = 'update-notification';
          notification.style.cssText = 'position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg,#1e1e1e,#2d2d2d);color:#fff;padding:16px 20px;border-radius:12px;font-family:system-ui;z-index:99999;min-width:280px;box-shadow:0 8px 32px rgba(0,0,0,0.3);border:1px solid #333;';
          notification.innerHTML = '<div style="font-weight:600;margin-bottom:8px;color:#4fc3f7;">⬇️ Downloading Update</div><div style="background:#333;height:8px;border-radius:4px;overflow:hidden;margin-bottom:8px;"><div id="notif-progress" style="height:100%;background:linear-gradient(90deg,#4fc3f7,#29b6f6);width:0%;transition:width 0.3s;border-radius:4px;"></div></div><div style="display:flex;justify-content:space-between;font-size:12px;color:#aaa;"><span id="notif-percent">0%</span><span id="notif-speed">--</span><span id="notif-remaining">...</span></div>';
          document.body.appendChild(notification);
        }
        document.getElementById('notif-progress').style.width = '${data.percent}%';
        document.getElementById('notif-percent').textContent = '${data.percent}%';
        document.getElementById('notif-speed').textContent = '${data.speed}';
        document.getElementById('notif-remaining').textContent = '${data.remaining}';
      })();
    `).catch(() => {});
  }
}

function removeRendererNotification() {
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.executeJavaScript(`
      (function() {
        const notification = document.getElementById('update-notification');
        if (notification) {
          notification.style.transition = 'opacity 0.3s, transform 0.3s';
          notification.style.opacity = '0';
          notification.style.transform = 'translateY(20px)';
          setTimeout(() => notification.remove(), 300);
        }
      })();
    `).catch(() => {});
  }
}

// Auto-updater event handlers
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info.version);
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'Update Available',
    message: `A new version (${info.version}) is available. Do you want to download it now?`,
    buttons: ['Download', 'Later'],
    defaultId: 0,
    cancelId: 1
  }).then((result) => {
    if (result.response === 0) {
      console.log('Starting download, creating progress window...');
      downloadStartTime = Date.now();
      createProgressWindow();
      console.log('Progress window created:', progressWindow ? 'YES' : 'NO');
      autoUpdater.downloadUpdate().catch((err) => {
        closeProgressWindow();
        removeRendererNotification();
        dialog.showMessageBox(mainWindow, {
          type: 'error',
          title: 'Download Error',
          message: `Failed to download update: ${err.message}`,
          buttons: ['OK']
        });
      });
    }
  });
});

autoUpdater.on('update-not-available', () => {
  console.log('No updates available.');
});

autoUpdater.on('download-progress', (progress) => {
  const percent = Math.round(progress.percent);
  const speed = formatBytes(progress.bytesPerSecond) + '/s';
  const remaining = formatTime((progress.total - progress.transferred) / progress.bytesPerSecond);
  
  console.log(`Download: ${percent}% | ${speed} | ${remaining}`);
  console.log(`Progress window exists: ${progressWindow ? 'YES' : 'NO'}`);
  
  // Taskbar progress
  if (mainWindow) {
    mainWindow.setProgressBar(progress.percent / 100);
  }
  
  // Progress window
  if (progressWindow && progressWindow.webContents) {
    console.log('Sending progress to progress window...');
    progressWindow.webContents.send('download-progress', { percent, speed, remaining });
  }
  
  // In-app notification
  console.log('Sending progress to renderer...');
  sendProgressToRenderer({ percent, speed, remaining });
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded:', info.version);
  
  // Ensure progress is shown for at least MIN_PROGRESS_DISPLAY_MS
  const elapsed = Date.now() - (downloadStartTime || 0);
  const delay = Math.max(0, MIN_PROGRESS_DISPLAY_MS - elapsed);
  
  // Update progress to 100%
  if (progressWindow && progressWindow.webContents) {
    progressWindow.webContents.send('download-progress', { 
      percent: 100, 
      speed: 'Complete!', 
      remaining: 'Installing...' 
    });
  }
  sendProgressToRenderer({ percent: 100, speed: 'Complete!', remaining: 'Installing...' });
  
  setTimeout(() => {
    closeProgressWindow();
    removeRendererNotification();
    
    if (mainWindow) {
      mainWindow.setProgressBar(-1); // Remove progress bar
    }
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Ready',
      message: `Version ${info.version} has been downloaded. Restart now to install?`,
      buttons: ['Restart', 'Later'],
      defaultId: 0,
      cancelId: 1
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  }, delay);
});

autoUpdater.on('error', (err) => {
  console.error('Auto-updater error:', err);
  closeProgressWindow();
  removeRendererNotification();
  dialog.showMessageBox(mainWindow, {
    type: 'error',
    title: 'Update Error',
    message: `Auto-update error: ${err.message}\n\nPlease download manually from GitHub Releases.`,
    buttons: ['OK']
  });
});

// Find build directory
function findBuildDir() {
  // Get the project root (parent of electron/ directory)
  const projectRoot = path.resolve(__dirname, '..');
  
  const possiblePaths = [
    // Packaged app paths (check first)
    app.isPackaged && process.resourcesPath ? path.join(process.resourcesPath, 'build') : null,
    app.isPackaged && process.resourcesPath ? path.join(process.resourcesPath, 'app', 'build') : null,
    app.isPackaged ? path.join(path.dirname(process.execPath), 'resources', 'build') : null,
    app.isPackaged ? path.join(__dirname, '..', 'build') : null,
    // Development paths
    path.join(projectRoot, 'build'),                         // Development (most common)
    path.join(__dirname, '..', 'build'),                    // Development (alternative)
    path.join(process.cwd(), 'build'),                       // If run from project root
    path.join(process.cwd(), '..', 'build'),                 // If run from electron/
  ].filter(p => p !== null).map(p => path.resolve(p)); // Convert to absolute paths and remove nulls

  console.log('Looking for build directory...');
  console.log('__dirname:', __dirname);
  console.log('projectRoot:', projectRoot);
  console.log('process.cwd():', process.cwd());
  console.log('process.resourcesPath:', process.resourcesPath);

  for (const buildPath of possiblePaths) {
    const exists = fs.existsSync(buildPath);
    console.log(`Checking: ${buildPath} - ${exists ? '✅ EXISTS' : '❌ not found'}`);
    if (exists) {
      console.log(`✅ Found build directory at: ${buildPath}`);
      return buildPath;
    }
  }
  
  console.log('❌ Build directory not found in any expected location');
  return null;
}

// Simple static file server
function startServer(buildDir) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(buildDir, req.url === '/' ? 'index.html' : req.url);
      
      // Security: prevent directory traversal
      filePath = path.normalize(filePath);
      if (!filePath.startsWith(buildDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      
      // Default to index.html for routes (SPA support)
      if (!path.extname(filePath) && !fs.existsSync(filePath)) {
        filePath = path.join(buildDir, 'index.html');
      }
      
      fs.readFile(filePath, (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            // Fallback to index.html for client-side routing
            fs.readFile(path.join(buildDir, 'index.html'), (err, data) => {
              if (err) {
                res.writeHead(404);
                res.end('Not Found');
              } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
              }
            });
          } else {
            res.writeHead(500);
            res.end('Server Error');
          }
        } else {
          const ext = path.extname(filePath);
          const contentType = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf',
            '.eot': 'application/vnd.ms-fontobject',
          }[ext] || 'application/octet-stream';
          
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(data);
        }
      });
    });

    // Try to find an available port
    let currentPort = PORT;
    const maxAttempts = 10;

    function tryListen() {
      server.listen(currentPort, '127.0.0.1', () => {
        console.log(`Server started on port ${currentPort}`);
        resolve({ server, port: currentPort });
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          currentPort++;
          if (currentPort < PORT + maxAttempts) {
            server.close();
            tryListen();
          } else {
            reject(new Error('Could not find available port'));
          }
        } else {
          reject(err);
        }
      });
    }

    tryListen();
  });
}

function createWindow() {
  // Register IPC handlers for window controls FIRST
  ipcMain.handle('window-minimize', () => {
    if (mainWindow) {
      mainWindow.minimize();
    }
  });

  ipcMain.handle('window-close', () => {
    if (mainWindow) {
      mainWindow.close();
    }
  });

  // Find build directory
  const buildDir = findBuildDir();
  
  if (!buildDir) {
    // Show error window with helpful info
    const errorWindow = new BrowserWindow({
      width: 700,
      height: 500,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });
    
    const checkedPaths = [
      path.join(__dirname, '..', 'build'),
      path.join(process.cwd(), 'build'),
      path.join(process.resourcesPath || 'N/A', 'build'),
    ].map(p => `  • ${p}`).join('<br>');
    
    errorWindow.loadURL(`data:text/html,<html><body style="font-family: system-ui; padding: 40px; text-align: center;">
      <h1>❌ Error</h1>
      <p><strong>Could not find the documentation files.</strong></p>
      <p>Please ensure you've built the Docusaurus site first:</p>
      <p style="background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace; text-align: left; margin: 20px auto; max-width: 500px;">
        npm run build:offline
      </p>
      <p style="margin-top: 20px; color: #666; font-size: 12px; text-align: left; max-width: 600px; margin: 20px auto;">
        <strong>Checked locations:</strong><br>
        ${checkedPaths}
      </p>
      <p style="margin-top: 20px; color: #666; font-size: 11px;">
        __dirname: ${__dirname}<br>
        process.cwd(): ${process.cwd()}
      </p>
    </body></html>`);
    return;
  }

  // Start local server
  startServer(buildDir)
    .then(({ server: srv, port }) => {
      server = srv;
      const url = `http://127.0.0.1:${port}`;

      // Create the browser window
      mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: path.join(__dirname, 'preload.js'),
        },
        icon: path.join(__dirname, '..', 'static', 'img', 'vts-guide', 'argus-logo.png'),
        title: 'VTS Guide',
        // Start in fullscreen (F11 mode - no window borders)
        fullscreen: true,
        show: false, // Don't show until ready
      });

      // Show window when ready
      mainWindow.once('ready-to-show', () => {
        mainWindow.show();
      });

      // Load the local server
      mainWindow.loadURL(url);

      // Open DevTools in development
      if (!app.isPackaged) {
        // mainWindow.webContents.openDevTools();
      }

      // Handle window closed
      mainWindow.on('closed', () => {
        mainWindow = null;
      });
    })
    .catch((err) => {
      console.error('Failed to start server:', err);
      // Show error window
      const errorWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        },
      });
      
      errorWindow.loadURL(`data:text/html,<html><body style="font-family: system-ui; padding: 40px; text-align: center;">
        <h1>❌ Server Error</h1>
        <p>Failed to start local server.</p>
        <p style="color: #666;">${err.message}</p>
      </body></html>`);
    });
}

// App event handlers
app.whenReady().then(() => {
  createWindow();

  // Check for updates after window is created (only in production)
  // Skip on macOS - auto-update requires Apple Developer certificate ($99/year)
  if (app.isPackaged && isAutoUpdateSupported) {
    setTimeout(() => {
      autoUpdater.checkForUpdates().catch((err) => {
        console.error('Failed to check for updates:', err);
      });
    }, 3000); // Wait 3 seconds after app starts
  } else if (app.isPackaged && !isAutoUpdateSupported) {
    console.log('Auto-update disabled on macOS (requires code signing certificate)');
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (server) {
    server.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (server) {
    server.close();
  }
});

