# 🚀 Docusaurus + Electron Template

Template to create documentation website with offline desktop app and auto-update.

## Features

- ✅ **Docusaurus 3** - Modern documentation website
- ✅ **GitHub Pages** - Auto-deploy on push
- ✅ **Electron App** - Offline desktop app (Windows, macOS, Linux)
- ✅ **Auto-Update** - Users get update notifications
- ✅ **One-Command Release** - `npm run publish`

---

## 🎯 Use for New Project

### Step 1: Copy Required Files

```bash
# From this project, copy the following folders/files:
.github/workflows/
  ├── deploy.yml              # Deploy to GitHub Pages
  └── release-electron.yml    # Build Electron apps

electron/
  ├── main.js                 # Electron main process
  └── package.json            # Electron config

scripts/
  ├── bump-version.js         # Bump version script
  └── update-version.js       # Update version.json

static/
  └── version.json            # Runtime version info

src/components/
  └── VersionChecker/         # Version check component (optional)
```

### Step 2: Update Config

#### `electron/package.json`
```json
{
  "name": "your-app-name",
  "productName": "Your App Name",
  "version": "1.0.0",
  "homepage": "https://github.com/YOUR_ORG/YOUR_REPO",
  "author": {
    "name": "Your Company",
    "email": "your@email.com"
  },
  "build": {
    "appId": "com.yourcompany.yourapp",
    "publish": {
      "provider": "github",
      "owner": "YOUR_ORG",
      "repo": "YOUR_REPO"
    }
  }
}
```

#### `package.json` (root)
```json
{
  "name": "your-project",
  "version": "1.0.0",
  "scripts": {
    "bump": "node scripts/bump-version.js",
    "bump:minor": "node scripts/bump-version.js minor",
    "bump:major": "node scripts/bump-version.js major",
    "publish": "npm run bump && git add -A && git commit -m \"chore: bump version\" && git push origin main && npm run release",
    "publish:minor": "npm run bump:minor && git add -A && git commit -m \"chore: bump minor version\" && git push origin main && npm run release",
    "publish:major": "npm run bump:major && git add -A && git commit -m \"chore: bump major version\" && git push origin main && npm run release",
    "release": "node -e \"const v=require('./electron/package.json').version; require('child_process').execSync('git tag v'+v+' && git push origin v'+v, {stdio:'inherit'})\"",
    "build:offline": "npm run update-version && cross-env OFFLINE_BUILD=true docusaurus build",
    "update-version": "node scripts/update-version.js"
  }
}
```

#### `docusaurus.config.js`
```javascript
const config = {
  title: 'Your Project Name',
  url: 'https://YOUR_ORG.github.io',
  baseUrl: process.env.OFFLINE_BUILD === 'true' ? '/' : '/YOUR_REPO/',
  organizationName: 'YOUR_ORG',
  projectName: 'YOUR_REPO',
};
```

#### `scripts/update-version.js`
```javascript
// Update these URLs
const versionData = {
  updateUrl: 'https://github.com/YOUR_ORG/YOUR_REPO/releases/latest',
  versionCheckUrl: 'https://raw.githubusercontent.com/YOUR_ORG/YOUR_REPO/main/static/version.json'
};
```

### Step 3: GitHub Settings

1. **Repository Settings → Pages**
   - Source: `Deploy from a branch`
   - Branch: `gh-pages` / `root`

2. **Repository Settings → Actions → General**
   - Workflow permissions: `Read and write permissions`

### Step 4: Install Dependencies

```bash
npm install cross-env --save-dev
cd electron && npm install
```

### Step 5: First Release

```bash
npm run publish
```

---

## 📁 Minimal File Structure

```
your-project/
├── .github/workflows/
│   ├── deploy.yml
│   └── release-electron.yml
├── docs/
│   └── *.md
├── electron/
│   ├── main.js
│   └── package.json
├── scripts/
│   ├── bump-version.js
│   └── update-version.js
├── static/
│   └── version.json
├── src/
├── docusaurus.config.js
├── package.json
└── sidebars.js
```

---

## 🔧 Customization

### Change App Icon
1. Prepare icon files:
   - Windows: `.ico` (256x256)
   - macOS: `.icns` or `.png` (512x512)
   - Linux: `.png` (512x512)

2. Update `electron/package.json`:
```json
{
  "build": {
    "mac": { "icon": "path/to/icon.png" },
    "win": { "icon": "path/to/icon.ico" },
    "linux": { "icon": "path/to/icon.png" }
  }
}
```

### Add Code Signing (Production)
For Windows/macOS code signing, add secrets to GitHub:
- `CSC_LINK` - Certificate file (base64)
- `CSC_KEY_PASSWORD` - Certificate password
- `APPLE_ID` / `APPLE_ID_PASSWORD` - For macOS notarization

---

## 📋 Quick Reference

| Command | Description |
|---------|-------------|
| `npm start` | Dev server |
| `npm run build` | Build website |
| `npm run build:offline` | Build for Electron |
| `npm run publish` | Release patch version |
| `npm run publish:minor` | Release minor version |
| `npm run publish:major` | Release major version |
