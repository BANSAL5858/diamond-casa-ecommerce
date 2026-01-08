# GitHub Upload Instructions

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the repository details:
   - **Repository name**: `diamond-casa-ecommerce` (or your preferred name)
   - **Description**: "Diamond Casa Luxury Jewelry E-Commerce Platform with ERPNext Integration"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your terminal:

### Option A: If you haven't created the repo yet (recommended)

```bash
# Add remote repository (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Option B: If repository already exists on GitHub

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git push -u origin main
```

## Step 3: Authentication

If prompted for authentication:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your GitHub password)
  - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Generate new token with `repo` scope
  - Use this token as password

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
# Login to GitHub
gh auth login

# Create repository and push
gh repo create diamond-casa-ecommerce --public --source=. --remote=origin --push
```

## Quick Commands Reference

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

## Repository Structure

Your repository will contain:
- ✅ Main website files (index.html, styles.css, script.js)
- ✅ Admin dashboard (admin.html, admin-styles.css, admin-script.js)
- ✅ ERPNext integration (erpnext-integration.js)
- ✅ Documentation files
- ✅ Configuration files
- ❌ erpnext/ folder (excluded via .gitignore)

## Next Steps After Upload

1. **Add Repository Description**: Update GitHub repo description
2. **Add Topics**: Add topics like `ecommerce`, `jewelry`, `erpnext`, `javascript`
3. **Set up GitHub Pages** (optional): Enable GitHub Pages to host the website
4. **Add License**: Add appropriate license file if needed
5. **Create Releases**: Tag versions for important milestones

## GitHub Pages Setup (Optional)

To host your website on GitHub Pages:

1. Go to repository Settings
2. Scroll to "Pages" section
3. Select source branch: `main`
4. Select folder: `/ (root)`
5. Click Save
6. Your site will be available at: `https://YOUR_USERNAME.github.io/REPO_NAME`

## Troubleshooting

### Error: "remote origin already exists"
```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

### Error: "failed to push some refs"
```bash
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push origin main
```

### Error: Authentication failed
- Use Personal Access Token instead of password
- Or set up SSH keys for authentication

---

**Ready to push!** Follow Step 2 above with your actual GitHub repository URL.
