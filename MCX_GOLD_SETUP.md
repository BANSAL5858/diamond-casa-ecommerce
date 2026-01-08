# MCX Gold Price Integration

This document explains how the MCX Gold live price fetching works and setup instructions.

## Overview

The application fetches live MCX Gold prices from https://mcxlive.org/ and displays them on the website. The price updates automatically every 60 seconds.

## Files Added

1. **mcx-gold-fetcher.js** - Main JavaScript module for fetching MCX Gold prices
2. **MCX_GOLD_SETUP.md** - This documentation file

## Current Implementation

### Frontend Implementation
- Uses CORS proxy services to fetch data from mcxlive.org
- Parses HTML to extract price information
- Updates price display every 60 seconds
- Stores price history in localStorage

### Display Location
The MCX Gold price is displayed in a dedicated section right after the Hero section on the homepage.

## CORS Limitations

Due to browser CORS (Cross-Origin Resource Sharing) restrictions, direct fetch requests to mcxlive.org from the browser are blocked. The current implementation uses public CORS proxy services, which:

- ✅ Work for development and testing
- ⚠️ May have rate limits
- ⚠️ May be unreliable in production
- ⚠️ Not recommended for production use

## Production Setup (Recommended)

For production, you should implement a backend API proxy. Here are options:

### Option 1: Node.js Backend Proxy

Create a simple Node.js endpoint:

```javascript
// server.js (Express example)
const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/mcx-gold', async (req, res) => {
    try {
        const response = await axios.get('https://mcxlive.org/');
        const html = response.data;
        // Parse and return JSON
        // ... parsing logic ...
        res.json(goldPriceData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch MCX Gold price' });
    }
});

app.listen(3000);
```

### Option 2: Serverless Function (AWS Lambda / Vercel / Netlify)

Create a serverless function to act as a proxy:

```javascript
// api/mcx-gold.js (Vercel example)
export default async function handler(req, res) {
    try {
        const response = await fetch('https://mcxlive.org/');
        const html = await response.text();
        // Parse HTML and return JSON
        // ... parsing logic ...
        res.json(goldPriceData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
}
```

### Option 3: Update mcx-gold-fetcher.js to Use Your API

Once you have a backend endpoint, update the `fetchMCXGoldPrice()` method:

```javascript
async fetchMCXGoldPrice() {
    try {
        const response = await fetch('https://yourdomain.com/api/mcx-gold');
        const data = await response.json();
        this.currentPrice = data;
        this.updatePriceHistory(data);
        this.notifyListeners(data);
        return data;
    } catch (error) {
        throw new Error('Failed to fetch MCX Gold price');
    }
}
```

## Features

### Automatic Updates
- Price refreshes every 60 seconds automatically
- Manual refresh button available

### Price History
- Stores last 100 price updates in localStorage
- Accessible via `mcxGoldFetcher.getPriceHistory()`

### Real-time Display
- Shows Last Price, Change, Change %, Previous Close, High, Low
- Color-coded display (green for up, red for down)
- Shows last update timestamp

## Usage in Code

```javascript
// Get current price
const currentPrice = mcxGoldFetcher.getCurrentPrice();

// Listen for price updates
mcxGoldFetcher.onPriceUpdate((priceData) => {
    console.log('Price updated:', priceData);
});

// Manually fetch price
mcxGoldFetcher.fetchMCXGoldPrice()
    .then(priceData => {
        console.log('MCX Gold Price:', priceData);
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Start auto-update
mcxGoldFetcher.startAutoUpdate();

// Stop auto-update
mcxGoldFetcher.stopAutoUpdate();
```

## Price Data Structure

```javascript
{
    symbol: 'MCX Gold',
    lastPrice: 137682.00,      // Last traded price
    change: -327.00,            // Price change
    changePercent: -0.24,       // Percentage change
    close: 138009.00,           // Previous close
    high: 137996.00,            // Day high
    low: 136443.00,             // Day low
    timestamp: '2026-01-08T23:44:00.000Z'
}
```

## Troubleshooting

### Price Not Loading

1. **Check browser console** for errors
2. **Check internet connection**
3. **Verify CORS proxy services** are accessible
4. **Check if mcxlive.org** is accessible from your network

### CORS Errors

If you see CORS errors:
- Implement a backend proxy (recommended for production)
- Use browser extensions (development only, not for end users)

### Parsing Errors

If price data is not parsing correctly:
- The website structure may have changed
- Update the `parseGoldPriceFromHTML()` method
- Check the HTML structure of mcxlive.org

## Notes

- The price data is fetched from mcxlive.org and is for informational purposes only
- Prices are updated in real-time during MCX trading hours
- Outside trading hours, prices may show last traded price
- Always verify critical price data from official sources

## Support

For issues or questions, check:
1. Browser console for error messages
2. Network tab to see if requests are being made
3. Verify mcxlive.org is accessible
4. Consider implementing backend proxy for production use
