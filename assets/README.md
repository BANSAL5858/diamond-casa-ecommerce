# Assets Folder

This folder contains static assets for the Diamond Casa Admin Dashboard.

## Folder Structure

```
assets/
├── images/          # Image files (logos, icons, product images, etc.)
├── fonts/           # Custom fonts (if any)
└── README.md        # This file
```

## Image Usage

### In HTML:
```html
<!-- Local image -->
<img src="assets/images/my-image.jpg" alt="My Image">

<!-- External image (CDN) -->
<img src="https://example.com/image.jpg" alt="External Image">
```

### In CSS:
```css
background-image: url('../assets/images/background.jpg');
```

### In JavaScript:
```javascript
const imageUrl = 'assets/images/product.jpg';
```

## Supported Image Formats

- `.jpg` / `.jpeg` - JPEG images
- `.png` - PNG images (with transparency)
- `.gif` - Animated GIFs
- `.svg` - Scalable Vector Graphics
- `.webp` - Modern web format (better compression)

## Best Practices

1. **Optimize Images**: Compress images before uploading
2. **Naming Convention**: Use lowercase, hyphens: `my-image.jpg`
3. **File Size**: Keep images under 500KB when possible
4. **Dimensions**: Resize images to required dimensions
5. **Alt Text**: Always include descriptive alt text

## Example Usage in Admin Dashboard

### User Avatar:
```html
<img src="assets/images/admin-avatar.jpg" alt="Admin" class="user-avatar">
```

### Logo:
```html
<img src="assets/images/logo.png" alt="Diamond Casa Logo">
```

### Product Image:
```html
<img src="assets/images/products/product-1.jpg" alt="Product Name">
```

## GitHub Pages Deployment

When deploying to GitHub Pages, ensure:
- Image paths are relative (start with `assets/`)
- Images are committed to the repository
- File names don't contain spaces or special characters
