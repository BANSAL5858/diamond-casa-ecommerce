# Bulk Product Import Guide

## Overview

The bulk product import feature allows you to import all products from ERPNext to your Diamond Casa website, including up to 5 photos and 1 video per product. This feature automatically fetches product data, images, and videos from ERPNext File attachments.

## Prerequisites

1. **ERPNext Integration Configured**
   - ERPNext API URL, Key, and Secret configured
   - Integration enabled in Admin Dashboard

2. **Products in ERPNext**
   - Products created in ERPNext with Item Group = "Jewelry" (or selected group)
   - Products have File attachments (images/videos) linked to the Item

3. **File Attachments in ERPNext**
   - Images: JPG, JPEG, PNG, GIF, WEBP, SVG (up to 5 per product)
   - Videos: MP4, WEBM, OGG, MOV, AVI (1 per product)
   - Files must be attached to the Item doctype in ERPNext

## How to Use Bulk Import

### Step 1: Access Bulk Import

1. Login to Admin Dashboard
2. Navigate to **ERPNext Integration** page
3. Scroll down to **Bulk Product Import** section

### Step 2: Configure Import Settings

1. **Item Group**: Select the item group to import from
   - Default: "Jewelry"
   - Options: Rings, Earrings, Necklaces, Bracelets, Bangles, Pendants, Collections

2. **Limit (optional)**: 
   - Leave empty to import all products
   - Enter a number to limit import (e.g., 100 for first 100 products)

3. **Update Existing Products**: 
   - Checked: Updates existing products with same Item Code
   - Unchecked: Only imports new products

### Step 3: Start Import

1. Click **"Start Bulk Import"** button
2. Monitor progress bar and status messages
3. Wait for import to complete

### Step 4: Review Results

After import completes, you'll see:
- Total products imported
- Number of products with images
- Number of products with videos

## How It Works

### 1. Product Data Fetching
- Fetches all Items from selected Item Group in ERPNext
- Retrieves product details: name, price, description, specifications
- Gets Item Prices from "Standard Selling" price list

### 2. Media Fetching
- For each product, fetches File attachments from ERPNext
- Separates images (up to 5) and videos (1)
- Builds full URLs for media files

### 3. Product Transformation
- Converts ERPNext Item format to website product format
- Maps Item Groups to website categories
- Includes all product specifications

### 4. Storage
- Saves products to localStorage
- Updates existing products if enabled
- Triggers product update events

## ERPNext Setup Requirements

### File Attachments in ERPNext

To attach images/videos to products in ERPNext:

1. **Go to Item** in ERPNext
2. **Open the Item** you want to add media to
3. **Click "Attach"** button (paperclip icon)
4. **Upload Files**:
   - Upload up to 5 image files (JPG, PNG, etc.)
   - Upload 1 video file (MP4, etc.)
5. **Save the Item**

The files will be automatically linked to the Item and fetched during bulk import.

### File Naming

- No specific naming convention required
- Files are identified by extension
- Images: .jpg, .jpeg, .png, .gif, .webp, .svg
- Videos: .mp4, .webm, .ogg, .mov, .avi

### File Organization

- All files attached to an Item are fetched
- First 5 images are used (if more than 5 exist)
- First video found is used (if multiple videos exist)

## Product Display

### Product Cards
- Shows first image from images array
- Displays video badge if video exists
- Fallback to placeholder if no images

### Product Detail Modal
- **Image Gallery**: 
  - Main large image display
  - Thumbnail navigation for multiple images
  - Click thumbnails to change main image
  
- **Video Section**:
  - Video player with controls
  - Appears below image gallery if video exists
  - Supports standard HTML5 video formats

## Troubleshooting

### No Images/Videos Imported

**Possible Causes:**
1. Files not attached to Items in ERPNext
2. File extensions not recognized
3. Files marked as private in ERPNext
4. API permissions issue

**Solutions:**
- Verify files are attached to Items in ERPNext
- Check file extensions are supported
- Ensure files are public (not private)
- Verify API user has File doctype read permissions

### Import Fails

**Possible Causes:**
1. ERPNext integration not enabled
2. Invalid API credentials
3. Network connectivity issues
4. ERPNext server error

**Solutions:**
- Check ERPNext integration is enabled
- Verify API URL, Key, and Secret
- Test connection using "Test Connection" button
- Check ERPNext server logs

### Partial Import

**Possible Causes:**
1. Some products don't have attachments
2. Some files failed to fetch
3. Network timeout for large files

**Solutions:**
- Import will continue even if some media fails
- Check integration logs for specific errors
- Re-import specific products if needed

## Best Practices

1. **Organize Files Before Import**
   - Ensure all products have images/videos attached
   - Use consistent file naming
   - Optimize image sizes (recommended: 800-1200px width)

2. **Test with Small Batch First**
   - Import 10-20 products first
   - Verify images and videos display correctly
   - Then import full batch

3. **Monitor Progress**
   - Watch progress bar during import
   - Check status messages
   - Review import results

4. **Update Existing Products**
   - Use "Update Existing Products" to refresh product data
   - Re-import to update media files
   - Products are matched by Item Code (SKU)

5. **Backup Before Import**
   - Export current products if needed
   - Import creates backup automatically in localStorage

## API Reference

### Bulk Import Function

```javascript
await window.ERPNextIntegration.bulkImportProducts({
    itemGroup: 'Jewelry',        // Item Group to import
    limit: 100,                  // Optional: limit number of products
    updateExisting: true,        // Update existing products
    onProgress: (progress) => {  // Progress callback
        console.log(progress.current, progress.total, progress.status);
    }
});
```

### Return Value

```javascript
{
    success: true,
    imported: 150,           // Total products imported
    withImages: 145,         // Products with images
    withVideos: 120,         // Products with videos
    products: [...]          // Array of imported products
}
```

## Product Data Structure

After import, products have this structure:

```javascript
{
    id: 12345,
    erpnextItemCode: 'ITEM-001',
    name: 'Diamond Ring',
    brand: 'Diamond Casa',
    category: 'rings',
    price: 50000,
    images: [
        'https://erpnext.diamondcasa.in/files/image1.jpg',
        'https://erpnext.diamondcasa.in/files/image2.jpg',
        // ... up to 5 images
    ],
    video: 'https://erpnext.diamondcasa.in/files/video.mp4',
    // ... other product fields
}
```

## Support

For issues or questions:
1. Check Admin Dashboard → ERPNext Integration → Integration Logs
2. Review error messages in import results
3. Verify ERPNext File attachments are correct
4. Test ERPNext API connection

---

**Feature Version**: 1.0  
**Last Updated**: 2024  
**Compatible with**: ERPNext Jewelry Edition
