# Quick Push Commands

## Replace these placeholders:
- `YOUR_USERNAME` - Your GitHub username
- `REPO_NAME` - Your repository name (e.g., `diamond-casa-ecommerce`)

## Run these commands:

```bash
# Add GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Example:
If your username is `john-doe` and repo name is `diamond-casa-ecommerce`:

```bash
git remote add origin https://github.com/john-doe/diamond-casa-ecommerce.git
git branch -M main
git push -u origin main
```

## Authentication:
When prompted:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your password)
  - Generate at: https://github.com/settings/tokens
  - Select `repo` scope
  - Copy and use as password
