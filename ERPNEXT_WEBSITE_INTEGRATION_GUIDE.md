# ERPNext to Website Integration Guide

## Overview

This guide explains how products uploaded to ERPNext are automatically synced to the Diamond Casa website with all their features, including 5 images and 1 video per product.

## Integration Flow

```
┌─────────────────────────────────┐
│   Excel File Upload             │
│   (Admin Dashboard)             │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   ERPNext                       │
│   - Items Created/Updated       │
│   - Media Files Uploaded        │
│   - All Custom Fields Saved     │
└──────────────┬──────────────────┘
               │
               │ Automatic Sync
               ▼
┌─────────────────────────────────┐
│   Diamond Casa Website          │
│   - Products Displayed          │
│   - Images & Videos Shown       │
│   - All Features Available      │
└─────────────────────────────────┘
```

## Automatic Product Sync

### How It Works

1. **Upload Products to ERPNext**
   - Upload Excel file via Admin Dashboard
   - Products are created/updated in ERPNext
   - Images and videos are automatically uploaded from URLs

2. **Automatic Website Sync**
   - After Excel upload completes, products are automatically synced to website
   - Website fetches all products from ERPNext
   - All product features are displayed

3. **Real-time Updates**
   - Products sync on page load (if ERPNext enabled)
   - Periodic sync every 15 minutes
   - Manual sync available in Admin Dashboard

## Product Features Synced

### Basic Information
- ✅ Product Name (item_name)
- ✅ SKU/Item Code (item_code)
- ✅ Description
- ✅ Category (item_group)
- ✅ Subcategory (custom_subcategory)
- ✅ Brand (custom_brand)

### Pricing
- ✅ Price (from Item Price)
- ✅ Price Range (calculated)
- ✅ Currency (INR)

### Specifications
- ✅ Metal Type (custom_metal_type)
- ✅ Metal Purity (custom_metal_purity)
- ✅ Weight (custom_weight) - in grams
- ✅ Carat (custom_weight converted)
- ✅ Diamond Type (custom_diamond_type)
- ✅ Diamond Details (custom_diamond_details)
- ✅ Diamond Shape
- ✅ Size (custom_size)
- ✅ Quantity (custom_quantity)
- ✅ Collection (custom_collection)

### Availability
- ✅ Ready to Ship (custom_lead_time = 0)
- ✅ Lead Time (custom_lead_time in days)
- ✅ Stock Status

### Media Files
- ✅ **5 Images** (from File attachments)
  - Main image (Rendering)
  - Photograph
  - Recommended Products 1, 2, 3
- ✅ **1 Video** (from File attachments)

## Sync Process

### Step 1: Upload to ERPNext

1. **Prepare Excel File**
   - Include all product data
   - Add image URLs (Rendering, Photograph, Recommended Products 1-3)
   - Add video URL (Video column)

2. **Upload via Admin Dashboard**
   - Go to Admin Dashboard → ERPNext Integration
   - Scroll to "Upload Products from Excel to ERPNext"
   - Select Excel file
   - Click "Upload to ERPNext"

3. **Automatic Processing**
   - Products created/updated in ERPNext
   - Images downloaded from URLs and uploaded to ERPNext
   - Videos downloaded from URLs and uploaded to ERPNext
   - All custom fields saved

### Step 2: Automatic Website Sync

After Excel upload completes:
1. System automatically triggers `syncProducts()`
2. Fetches all Items from ERPNext
3. Fetches File attachments (images/videos)
4. Transforms to website format
5. Updates website products
6. Website automatically re-renders all product sections

### Step 3: Display on Website

Products appear on website with:
- ✅ All product information
- ✅ Image gallery (up to 5 images)
- ✅ Video player (if available)
- ✅ All specifications
- ✅ Pricing and availability
- ✅ Ready to Ship status

## Product Display Features

### Product Cards
- Main product image
- Product name and brand
- Category and specifications
- Price
- Ready to Ship badge
- Video badge (if video available)
- Quick actions (View Details, Add to Cart)

### Product Detail Modal
- **Image Gallery**: 
  - Main large image
  - Thumbnail navigation (up to 5 images)
  - Click to change main image
  
- **Video Section**:
  - Video player with controls
  - Appears if video is available
  
- **Product Specifications**:
  - Category and Subcategory
  - Metal Type and Purity
  - Diamond Type and Details
  - Weight and Carat
  - Collection
  - Size and Quantity
  - SKU
  - Availability Status

## Sync Triggers

### Automatic Sync
1. **On Page Load**: If ERPNext integration is enabled
2. **After Excel Upload**: Automatically syncs after successful upload
3. **Periodic Sync**: Every 15 minutes (configurable)

### Manual Sync
1. **Admin Dashboard**: Click "Sync Products" button
2. **Sync All**: Click "Sync All" button (products + inventory)

## Custom Fields Mapping

| ERPNext Field | Website Display | Location |
|---------------|----------------|----------|
| `item_name` | Product Name | Card, Detail Modal |
| `item_code` | SKU | Detail Modal |
| `description` | Description | Detail Modal |
| `item_group` | Category | Card, Filters |
| `custom_subcategory` | Subcategory | Detail Modal |
| `custom_metal_type` | Metal Type | Card, Detail Modal |
| `custom_metal_purity` | Metal Purity | Card, Detail Modal |
| `custom_weight` | Weight (grams) | Detail Modal |
| `custom_diamond_type` | Diamond Type | Card, Detail Modal |
| `custom_diamond_details` | Diamond Details | Detail Modal |
| `custom_collection` | Collection | Card, Detail Modal |
| `custom_size` | Size | Detail Modal |
| `custom_quantity` | Quantity | Detail Modal |
| `custom_lead_time` | Lead Time | Detail Modal |
| `custom_ready_to_ship` | Ready to Ship | Badge, Detail Modal |
| `images[]` (5) | Image Gallery | Product Card, Detail Modal |
| `video` | Video Player | Detail Modal |

## Product Sections Updated

When products sync from ERPNext, these website sections are automatically updated:

1. **Main Products Grid** - All products
2. **Ready to Ship** - Products with lead_time = 0
3. **Trending Now** - Popular products
4. **Rings Obsession** - Ring category
5. **Best Sellers** - Best-selling products
6. **Portuguese Cut** - Portuguese cut products
7. **Titanium Collection** - Titanium products
8. **Customer Favorites** - Favorite products

## Verification

### Check Products on Website

1. **Visit Website**: Open `index.html` in browser
2. **Check Products**: Scroll through product sections
3. **View Details**: Click "View Details" on any product
4. **Verify Features**:
   - Images display correctly (up to 5)
   - Video plays (if available)
   - All specifications shown
   - Price and availability correct

### Check in Admin Dashboard

1. **ERPNext Integration Page**: View sync status
2. **Integration Logs**: Check for sync success
3. **Last Sync Time**: Verify recent sync

## Troubleshooting

### Products Not Appearing on Website

**Possible Causes:**
1. ERPNext integration not enabled
2. Sync not triggered after upload
3. Products not in "Jewelry" item group
4. API connection issues

**Solutions:**
- Enable ERPNext integration in Admin Dashboard
- Click "Sync Products" manually
- Verify Item Group is "Jewelry" (or selected group)
- Test connection using "Test Connection" button

### Images/Videos Not Displaying

**Possible Causes:**
1. Files not attached to Items in ERPNext
2. File URLs not accessible
3. File download failed during upload

**Solutions:**
- Check File attachments in ERPNext Item
- Verify file URLs are accessible
- Re-upload Excel file with correct URLs

### Product Features Missing

**Possible Causes:**
1. Custom fields not created in ERPNext
2. Custom fields not included in sync query
3. Data not mapped correctly

**Solutions:**
- Create all required custom fields in ERPNext
- Verify custom fields are included in sync
- Check Excel column mapping

## Best Practices

1. **Upload in Batches**
   - Upload 50-100 products at a time
   - Verify sync after each batch
   - Check website display

2. **Verify Media Files**
   - Test image URLs before upload
   - Ensure video URLs are accessible
   - Use supported formats (JPG, PNG, MP4)

3. **Monitor Sync Status**
   - Check integration logs regularly
   - Monitor sync errors
   - Retry failed syncs

4. **Test After Upload**
   - Visit website immediately after upload
   - Verify products appear correctly
   - Check all features display properly

## API Endpoints Used

### Product Sync
- `GET /api/resource/Item` - Fetch all items
- `GET /api/resource/Item Price` - Fetch prices
- `GET /api/resource/File` - Fetch attachments (images/videos)

### Excel Upload
- `POST /api/resource/Item` - Create items
- `PUT /api/resource/Item` - Update items
- `POST /api/resource/Item Price` - Create prices
- `POST /api/resource/File` - Upload media files

## Configuration

### Sync Settings

**Location**: Admin Dashboard → ERPNext Integration

**Settings:**
- **Auto Sync Interval**: 15 minutes (default)
- **Item Group Filter**: "Jewelry" (default)
- **Price List**: "Standard Selling" (default)

### Enable/Disable Sync

1. Go to Admin Dashboard
2. Navigate to ERPNext Integration
3. Toggle "Integration Status" switch
4. Click "Save Configuration"

---

**Last Updated:** 2024  
**Integration Status:** ✅ Fully Integrated  
**Auto-Sync:** ✅ Enabled  
**Media Support:** 5 Images + 1 Video per product
