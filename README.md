# VTS Interactive Guide

Interactive documentation for Argus VTS system with offline desktop app support.

## 🚀 Quick Start

```bash
npm install
npm start           # Dev server at http://localhost:3000
```

## 📦 Release New Version

```bash
# 1. Update CHANGELOG.md with new version entry
# 2. Run publish command
npm run publish     # Bump version, build apps, create GitHub Release
```

## ✨ Features

- **Website**: Auto-deploy to GitHub Pages on push
- **Desktop Apps**: Windows (.exe), macOS (.dmg), Linux (.AppImage, .deb)
- **Auto-Update**: Windows & Linux apps auto-update from GitHub Releases
- **Offline Mode**: Full documentation available offline

## 📁 Project Structure

```
├── .github/workflows/    # CI/CD workflows
├── docs/                 # Documentation content (Markdown)
├── docs-internal/        # Developer documentation
├── electron/             # Electron desktop app
├── scripts/              # Build & utility scripts
├── src/                  # React components & styles
├── static/               # Static assets
├── CHANGELOG.md          # Release notes
├── docusaurus.config.js  # Site configuration
└── package.json          # Project config
```

## 📖 Documentation

- [Deployment Guide](docs-internal/DEPLOYMENT_AND_UPDATES.md) - CI/CD & auto-update
- [Developer Guide](docs-internal/DEVELOPER_GUIDE.md) - Development workflow
- [Template Guide](docs-internal/TEMPLATE_GUIDE.md) - Reuse for other projects

## 🔗 Links

- **Website**: https://fliight-engineering.github.io/argus-interactive-guide/
- **Releases**: https://github.com/Fliight-Engineering/argus-interactive-guide/releases
