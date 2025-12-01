# Deployment and Update Strategy for Argus VTS Guide

## Overview

Docusaurus generates **static HTML/CSS/JS files** that are deployed to a hosting service. Updates work by:
1. **Building** the site (`npm run build`) - generates static files in `build/` directory
2. **Deploying** those files to a hosting service (GitHub Pages, Netlify, Vercel, etc.)
3. **Serving** the static files to users

## Current Setup

You're currently configured for:
- **GitHub Pages** deployment (`Fliight-Engineering/argus-interactive-guide-host`)
- **Offline builds** for local/electron deployment
- **Manual deployment** via `npm run deploy`

## Update Strategies

### Option 1: GitHub Actions CI/CD (Recommended)

Automatically build and deploy when you push to the repository.

#### Setup Steps:

1. **Create GitHub Actions workflow** (`.github/workflows/deploy.yml`):

```yaml
name: Deploy Docusaurus

on:
  push:
    branches:
      - main  # or your main branch name
  workflow_dispatch:  # Allows manual trigger

permissions:
  contents: write  # Needed to push to gh-pages branch

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build site
        run: npm run build
        env:
          # Use GitHub Pages baseUrl
          NODE_ENV: production
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
          cname: false  # Set to true if using custom domain
```

2. **Enable GitHub Pages** in your repo settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `/ (root)`

3. **Push to trigger deployment**:
   ```bash
   git push origin main
   ```
   - GitHub Actions will automatically build and deploy

#### Benefits:
- ✅ Automatic updates on every push
- ✅ No manual deployment needed
- ✅ Build logs and history
- ✅ Works with private repos (uses `GITHUB_TOKEN`)

---

### Option 2: Pull Content from Private Repo

If you want to pull documentation content from a **separate private repository**:

#### Setup with Fine-Grained PAT:

1. **Create a GitHub Fine-Grained PAT**:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens
   - Create token with:
     - **Repository access**: Select your private content repo
     - **Permissions**: `Contents: Read-only`
     - **Expiration**: Set as needed
   - Copy the token

2. **Add PAT as GitHub Secret**:
   - In your guide repo: Settings → Secrets and variables → Actions
   - Add secret: `CONTENT_REPO_TOKEN` (paste your PAT)

3. **Create workflow to pull content** (`.github/workflows/update-content.yml`):

```yaml
name: Update Content from Private Repo

on:
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'
  workflow_dispatch:  # Manual trigger

jobs:
  update-content:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.CONTENT_REPO_TOKEN }}
      
      - name: Pull content from private repo
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          
          # Add private repo as remote
          git remote add content-repo https://${{ secrets.CONTENT_REPO_TOKEN }}@github.com/ORG/private-content-repo.git
          
          # Pull content (adjust paths as needed)
          git subtree pull --prefix=docs content-repo main --squash
          
          # Or use git submodule if preferred
          # git submodule update --remote --merge
      
      - name: Commit and push changes
        run: |
          git add .
          git commit -m "Update content from private repo [skip ci]" || exit 0
          git push
```

4. **Alternative: Use Git Submodules**:

```bash
# Add private repo as submodule
git submodule add https://github.com/ORG/private-content-repo.git docs-content

# Update submodule
git submodule update --remote
```

---

### Option 3: Manual Update Script

Create a script to pull updates from private repo locally:

**`scripts/update-content.sh`**:

```bash
#!/bin/bash

# Set your PAT (or use environment variable)
CONTENT_REPO_TOKEN="${CONTENT_REPO_TOKEN:-your-token-here}"
CONTENT_REPO="https://${CONTENT_REPO_TOKEN}@github.com/ORG/private-content-repo.git"

# Pull latest content
git subtree pull --prefix=docs content-repo main --squash

# Or use submodule
# git submodule update --remote --merge

# Build and deploy
npm run build
npm run deploy
```

**`.env.local`** (add to `.gitignore`):
```
CONTENT_REPO_TOKEN=ghp_your_fine_grained_pat_here
```

---

## Version Tracking

### Option 1: Git Tags (Recommended)

Tag releases for version tracking:

```bash
# Create a version tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# List versions
git tag -l

# Checkout specific version
git checkout v1.0.0
```

### Option 2: Docusaurus Versioning Plugin

For multiple documentation versions (e.g., v1.0, v2.0):

```bash
npm install @docusaurus/plugin-content-docs
```

Update `docusaurus.config.js`:

```javascript
presets: [
  [
    'classic',
    {
      docs: {
        sidebarPath: './sidebars.js',
        // Enable versioning
        versions: {
          current: {
            label: '2.0.0',
            path: '2.0.0',
          },
        },
      },
    },
  ],
],
```

### Option 3: Package.json Version

Track version in `package.json`:

```json
{
  "version": "1.0.0",
  "scripts": {
    "version:patch": "npm version patch",
    "version:minor": "npm version minor",
    "version:major": "npm version major"
  }
}
```

---

## Security Best Practices

### For Private Repos with PATs:

1. **Never commit PATs to code**:
   - Use GitHub Secrets (for Actions)
   - Use `.env.local` (for local scripts, add to `.gitignore`)

2. **Use Fine-Grained PATs**:
   - Minimal permissions (read-only for content)
   - Repository-specific access
   - Set expiration dates

3. **Rotate tokens regularly**:
   - Update secrets when tokens expire
   - Revoke old tokens

4. **Use separate tokens**:
   - One token for content repo (read-only)
   - Different token for deployment (write access)

---

## Update Workflow Examples

### Daily Auto-Update from Private Repo:

```yaml
# .github/workflows/daily-update.yml
name: Daily Content Update

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM UTC daily
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.CONTENT_REPO_TOKEN }}
      
      - name: Pull latest content
        run: |
          git remote add content https://${{ secrets.CONTENT_REPO_TOKEN }}@github.com/ORG/content-repo.git
          git subtree pull --prefix=docs content main --squash
      
      - name: Build and deploy
        run: |
          npm ci
          npm run build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

### Manual Update Command:

```bash
# Pull content, build, and deploy
npm run update:content && npm run build && npm run deploy
```

Add to `package.json`:
```json
{
  "scripts": {
    "update:content": "node scripts/pull-content.js",
    "deploy:full": "npm run update:content && npm run build && npm run deploy"
  }
}
```

---

## Recommended Setup

For your use case (private content repo + public guide):

1. **Use GitHub Actions** for automatic deployment
2. **Use Fine-Grained PAT** stored as GitHub Secret
3. **Schedule daily updates** from private content repo
4. **Tag releases** for version tracking
5. **Keep PAT minimal** (read-only, repo-specific)

This gives you:
- ✅ Automatic updates
- ✅ Secure token handling
- ✅ Version history
- ✅ No manual deployment needed

---

## Troubleshooting

### PAT Not Working:
- Check token has correct permissions
- Verify token hasn't expired
- Ensure token has access to the private repo

### Build Fails:
- Check Node.js version (needs >= 20.0)
- Verify all dependencies installed (`npm ci`)
- Check build logs in GitHub Actions

### Content Not Updating:
- Verify subtree/submodule pull succeeded
- Check file paths are correct
- Ensure changes were committed and pushed

