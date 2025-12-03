# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.14] - 2025-12-03
### Changed
- Fixed window controls not working, app now starts maximized, fixed content overflow at 250% scale, removed unnecessary scrollbars in carousel

## [1.0.13] - 2025-12-02
### Added
- Custom window controls for Electron app (minimize, maximize, close)
- Update modal component for better update notifications
- New Quick Start images: argus-overview, launch-argus, view-feeds, start-recording, view-recordings
- Preload script for better Electron security

### Changed
- Optimized Argus logo (reduced from 703KB to 55KB)
- Optimized network-health.png (reduced from 57KB to 25KB)
- Improved Quick Start operation page layout

### Fixed
- Fixed responsive layout for Surface Pro - buttons stay horizontal on tablet screens
- Fixed app icon - now uses Argus logo instead of default React icon

## [1.0.10] - 2025-12-01
### Fixed
- Fixed responsive layout for Surface Pro - buttons now stay horizontal on tablet screens
- Fixed app icon - now uses Argus logo instead of default React icon
- Adjusted breakpoint from 996px to 768px for vertical layout



## [1.0.8] - 2025-12-01
### Added
- Download progress dialog with percentage, speed, and remaining time
- In-app notification showing download progress in bottom-right corner
- Beautiful dark-themed progress UI

### Changed
- Improved auto-update user experience with real-time progress feedback

## [1.0.7] - 2025-12-01
### Added
- Release notes now automatically extracted from CHANGELOG.md and displayed in GitHub Releases

### Changed
- Updated release workflow to include changelog in release description

## [1.0.6] - 2025-12-01
### Fixed
- Disabled auto-update on macOS (requires Apple Developer certificate for code signing)
- Added CHANGELOG.md for release management

### Changed
- Updated bump-version.js to validate changelog entries

## [1.0.5] - 2025-12-01
### Fixed
- Fixed artifact naming for cross-platform builds
- Project structure cleanup (moved docs to docs-internal/, scripts to scripts/)

### Changed
- Removed legacy files and old documentation

## [1.0.4] - 2025-12-01
### Fixed
- Fixed electron-builder artifactName to match latest.yml for auto-update

## [1.0.3] - 2025-12-01
### Added
- Error dialogs for auto-update failures

### Fixed
- Improved error handling for update process

## [1.0.2] - 2025-12-01
### Fixed
- Fixed version synchronization between root and electron package.json
- Added cross-env for Windows compatibility in build scripts

## [1.0.1] - 2025-12-01
### Added
- Initial auto-update implementation using electron-updater
- GitHub Releases integration for update distribution

## [1.0.0] - 2025-12-01
### Added
- Initial release of VTS Guide
- Interactive documentation for Argus VTS system
- Offline Electron desktop app for Windows, macOS, and Linux
- GitHub Pages deployment for online access
- Version tracking and update checking
- Responsive design with dark/light mode support
