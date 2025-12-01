const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');
const { autoUpdater } = require('electron-updater');

let mainWindow;
let server;
const PORT = 8080;

// Auto-updater configuration
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

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
      dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Downloading',
        message: 'Download started. Please wait...',
        buttons: ['OK']
      });
      autoUpdater.downloadUpdate().catch((err) => {
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
  console.log(`Download progress: ${Math.round(progress.percent)}%`);
  if (mainWindow) {
    mainWindow.setProgressBar(progress.percent / 100);
  }
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded:', info.version);
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
});

autoUpdater.on('error', (err) => {
  console.error('Auto-updater error:', err);
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
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        },
        icon: path.join(__dirname, '..', 'static', 'img', 'vts-guide', 'image29.png'),
        title: 'VTS Guide',
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
  if (app.isPackaged) {
    setTimeout(() => {
      autoUpdater.checkForUpdates().catch((err) => {
        console.error('Failed to check for updates:', err);
      });
    }, 3000); // Wait 3 seconds after app starts
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

