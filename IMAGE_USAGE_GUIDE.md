# Image Usage Guide for Admin Dashboard

## Current Image Implementation

The admin dashboard currently uses:
- **External URLs** for user avatars (ui-avatars.com API)
- **Emoji placeholders** for product images
- **Font Awesome icons** for UI elements

## Adding Local Images

### 1. Create Assets Folder Structure

```
DEMOAPP/
├── assets/
│   ├── images/
│   │   ├── logo.png
│   │   ├── admin-avatar.jpg
│   │   └── products/
│   └── README.md
```

### 2. Reference Images in HTML

#### Option A: Local Image (Recommended for Production)
```html
<!-- In admin.html -->
<img src="assets/images/my-image.jpg" alt="My Image" class="user-avatar">
```

#### Option B: External URL (Current Implementation)
```html
<!-- Current implementation -->
<img src="https://ui-avatars.com/api/?name=Admin&background=d4af37&color=fff" alt="Admin" class="user-avatar">
```

### 3. Update User Avatar Example

**Current (admin.html line 117):**
```html
<img src="https://ui-avatars.com/api/?name=Admin&background=d4af37&color=fff" alt="Admin" class="user-avatar">
```

**Updated to use local image:**
```html
<img src="assets/images/admin-avatar.jpg" alt="Admin" class="user-avatar">
```

### 4. Image Paths for GitHub Pages

When deployed to GitHub Pages (https://bansal5858.github.io/diamond-casa-ecommerce/):

- ✅ **Correct**: `assets/images/my-image.jpg`
- ✅ **Correct**: `./assets/images/my-image.jpg`
- ❌ **Wrong**: `/assets/images/my-image.jpg` (absolute path)
- ❌ **Wrong**: `C:\Users\...\assets\images\my-image.jpg` (local path)

## Image Path Examples

### In HTML:
```html
<!-- Logo in sidebar -->
<img src="assets/images/logo.png" alt="Diamond Casa Logo">

<!-- User avatar -->
<img src="assets/images/admin-avatar.jpg" alt="Admin">

<!-- Product image -->
<img src="assets/images/products/ring-001.jpg" alt="Diamond Ring">
```

### In CSS (admin-styles.css):
```css
.sidebar-header {
    background-image: url('../assets/images/sidebar-bg.jpg');
}

.logo {
    background-image: url('../assets/images/logo.png');
}
```

### In JavaScript (admin-script.js):
```javascript
// Set image dynamically
const imageUrl = 'assets/images/product.jpg';
document.getElementById('productImage').src = imageUrl;

// Or use template literal
const productHTML = `
    <img src="assets/images/products/${product.id}.jpg" alt="${product.name}">
`;
```

## Quick Setup

1. **Create the folder:**
   ```bash
   mkdir assets
   mkdir assets\images
   ```

2. **Add your image:**
   - Place `my-image.jpg` in `assets/images/`

3. **Reference in HTML:**
   ```html
   <img src="assets/images/my-image.jpg" alt="My Image">
   ```

4. **Commit to Git:**
   ```bash
   git add assets/
   git commit -m "Add image assets"
   git push origin main
   ```

## Testing

1. **Local Testing:**
   - Open `admin.html` in browser
   - Images should load from `assets/images/`

2. **GitHub Pages Testing:**
   - Push to repository
   - Visit: `https://bansal5858.github.io/diamond-casa-ecommerce/admin.html`
   - Images should load correctly

## Troubleshooting

### Image Not Showing?

1. **Check file path:**
   - Ensure path is relative: `assets/images/...`
   - No leading slash: ❌ `/assets/...` ✅ `assets/...`

2. **Check file exists:**
   - Verify file is in correct folder
   - Check file name (case-sensitive on GitHub Pages)

3. **Check browser console:**
   - Open F12 → Console
   - Look for 404 errors
   - Check Network tab for failed requests

4. **Check file permissions:**
   - Ensure file is committed to Git
   - Check `.gitignore` doesn't exclude assets

### Common Issues:

**Issue:** Image shows broken icon
- **Fix:** Check file path and ensure file exists

**Issue:** Image loads locally but not on GitHub Pages
- **Fix:** Use relative paths, not absolute paths

**Issue:** Image too large, slow loading
- **Fix:** Compress image (use tools like TinyPNG)

---

**Need help?** Check the `assets/README.md` file for more details.
