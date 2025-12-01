#!/usr/bin/env node

/**
 * Script to bump version in both package.json files and update version.json
 * Usage: node scripts/bump-version.js [major|minor|patch]
 * Default: patch
 */

const fs = require('fs');
const path = require('path');

const bumpType = process.argv[2] || 'patch';

// Read root package.json
const rootPkgPath = path.join(__dirname, '../package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));

// Read electron package.json
const electronPkgPath = path.join(__dirname, '../electron/package.json');
const electronPkg = JSON.parse(fs.readFileSync(electronPkgPath, 'utf8'));

// Parse current version
const currentVersion = rootPkg.version;
const [major, minor, patch] = currentVersion.split('.').map(Number);

// Calculate new version
let newVersion;
switch (bumpType) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
  default:
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

// Update both package.json files
rootPkg.version = newVersion;
electronPkg.version = newVersion;

fs.writeFileSync(rootPkgPath, JSON.stringify(rootPkg, null, 2) + '\n');
fs.writeFileSync(electronPkgPath, JSON.stringify(electronPkg, null, 2) + '\n');

// Update version.json
const versionJsonPath = path.join(__dirname, '../static/version.json');
const versionData = {
  version: newVersion,
  buildDate: new Date().toISOString(),
  updateUrl: 'https://github.com/Fliight-Engineering/argus-interactive-guide/releases/latest',
  versionCheckUrl: 'https://raw.githubusercontent.com/Fliight-Engineering/argus-interactive-guide/main/static/version.json'
};
fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2) + '\n');

console.log(`✅ Bumped version: ${currentVersion} → ${newVersion}`);
console.log(`   Updated: package.json, electron/package.json, static/version.json`);
