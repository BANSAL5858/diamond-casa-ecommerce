/**
 * MCX Gold Price Fetcher
 * Fetches live MCX Gold prices from https://mcxlive.org/
 */

class MCXGoldFetcher {
    constructor() {
        this.apiEndpoint = 'https://mcxlive.org/';
        this.updateInterval = 60000; // Update every 60 seconds (1 minute)
        this.currentPrice = null;
        this.priceHistory = JSON.parse(localStorage.getItem('mcx_gold_history')) || [];
        this.listeners = [];
    }

    /**
     * Fetch MCX Gold price from the website
     * Note: Due to CORS restrictions, this uses a proxy approach
     */
    async fetchMCXGoldPrice() {
        try {
            // Method 1: Try using a CORS proxy (for development/testing)
            // In production, use a backend proxy to avoid CORS issues
            const proxyUrl = 'https://api.allorigins.win/get?url=';
            const targetUrl = encodeURIComponent('https://mcxlive.org/');
            
            const response = await fetch(`${proxyUrl}${targetUrl}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const htmlContent = data.contents;
            
            // Parse the HTML to extract MCX Gold price
            const goldPrice = this.parseGoldPriceFromHTML(htmlContent);
            
            if (goldPrice) {
                this.currentPrice = goldPrice;
                this.updatePriceHistory(goldPrice);
                this.notifyListeners(goldPrice);
                return goldPrice;
            } else {
                throw new Error('Could not parse gold price from page');
            }
        } catch (error) {
            console.error('Error fetching MCX Gold price:', error);
            
            // Fallback: Try alternative method using regex on response
            try {
                return await this.fetchGoldPriceAlternative();
            } catch (fallbackError) {
                console.error('Fallback method also failed:', fallbackError);
                throw new Error('Unable to fetch MCX Gold price. Please check your internet connection or use a backend proxy.');
            }
        }
    }

    /**
     * Alternative method: Parse HTML using DOMParser
     */
    async fetchGoldPriceAlternative() {
        // Since we can't directly fetch due to CORS, we'll use a different approach
        // For production, implement a backend API endpoint
        
        // Try using fetch with mode: 'no-cors' (limited, but might work)
        try {
            const response = await fetch('https://mcxlive.org/', {
                method: 'GET',
                mode: 'no-cors',
                cache: 'no-cache'
            });
            
            // Note: no-cors mode doesn't allow reading response in browser
            // This is just for demonstration - you'll need a backend proxy
            throw new Error('Direct fetch blocked by CORS. Backend proxy required.');
        } catch (error) {
            throw error;
        }
    }

    /**
     * Parse Gold price from HTML content
     */
    parseGoldPriceFromHTML(html) {
        try {
            // Create a temporary DOM element to parse HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Look for MCX Gold in the table
            // The table structure from the website shows MCX Gold with Last price
            const rows = doc.querySelectorAll('table tr, .table tr');
            
            for (let row of rows) {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 2) {
                    const symbolCell = cells[0];
                    const priceCell = cells[1];
                    
                    // Check if this row contains MCX Gold
                    if (symbolCell && symbolCell.textContent.includes('MCX Gold')) {
                        // Get the last price from the second column
                        const priceText = priceCell.textContent.trim();
                        const price = this.extractPrice(priceText);
                        
                        if (price) {
                            // Also try to get additional info
                            const changeCell = cells[2];
                            const changePercentCell = cells[3];
                            const closeCell = cells[4];
                            const highCell = cells[5];
                            const lowCell = cells[6];
                            
                            return {
                                symbol: 'MCX Gold',
                                lastPrice: price,
                                change: changeCell ? this.extractPrice(changeCell.textContent) : null,
                                changePercent: changePercentCell ? this.extractChangePercent(changePercentCell.textContent) : null,
                                close: closeCell ? this.extractPrice(closeCell.textContent) : null,
                                high: highCell ? this.extractPrice(highCell.textContent) : null,
                                low: lowCell ? this.extractPrice(lowCell.textContent) : null,
                                timestamp: new Date().toISOString()
                            };
                        }
                    }
                }
            }
            
            // Alternative: Try to find using regex pattern
            const goldRegex = /MCX Gold[^<]*<td[^>]*>[\s\S]*?<td[^>]*>([\d,]+\.\d{2})/i;
            const match = html.match(goldRegex);
            
            if (match && match[1]) {
                const price = parseFloat(match[1].replace(/,/g, ''));
                return {
                    symbol: 'MCX Gold',
                    lastPrice: price,
                    timestamp: new Date().toISOString()
                };
            }
            
            // Another regex pattern
            const pricePattern = /MCX Gold[\s\S]{0,500}?(\d{1,3}(?:,\d{3})*\.\d{2})/i;
            const priceMatch = html.match(pricePattern);
            
            if (priceMatch && priceMatch[1]) {
                const price = parseFloat(priceMatch[1].replace(/,/g, ''));
                return {
                    symbol: 'MCX Gold',
                    lastPrice: price,
                    timestamp: new Date().toISOString()
                };
            }
            
            return null;
        } catch (error) {
            console.error('Error parsing HTML:', error);
            return null;
        }
    }

    /**
     * Extract price from text
     */
    extractPrice(text) {
        if (!text) return null;
        
        // Remove commas and extract number
        const cleaned = text.replace(/,/g, '').trim();
        const match = cleaned.match(/(\d+\.\d{2}|\d+)/);
        return match ? parseFloat(match[1]) : null;
    }

    /**
     * Extract change percent from text
     */
    extractChangePercent(text) {
        if (!text) return null;
        
        const cleaned = text.replace(/%/g, '').trim();
        const match = cleaned.match(/([+-]?\d+\.\d{2}|\d+)/);
        return match ? parseFloat(match[1]) : null;
    }

    /**
     * Update price history
     */
    updatePriceHistory(priceData) {
        this.priceHistory.push({
            ...priceData,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 100 entries
        if (this.priceHistory.length > 100) {
            this.priceHistory = this.priceHistory.slice(-100);
        }
        
        // Save to localStorage
        localStorage.setItem('mcx_gold_history', JSON.stringify(this.priceHistory));
    }

    /**
     * Add a listener for price updates
     */
    onPriceUpdate(callback) {
        this.listeners.push(callback);
    }

    /**
     * Remove a listener
     */
    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }

    /**
     * Notify all listeners of price update
     */
    notifyListeners(priceData) {
        this.listeners.forEach(listener => {
            try {
                listener(priceData);
            } catch (error) {
                console.error('Error in price update listener:', error);
            }
        });
    }

    /**
     * Start auto-updating prices
     */
    startAutoUpdate() {
        // Fetch immediately
        this.fetchMCXGoldPrice().catch(err => {
            console.error('Initial price fetch failed:', err);
        });
        
        // Then update at intervals
        this.updateTimer = setInterval(() => {
            this.fetchMCXGoldPrice().catch(err => {
                console.error('Auto-update failed:', err);
            });
        }, this.updateInterval);
    }

    /**
     * Stop auto-updating prices
     */
    stopAutoUpdate() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
            this.updateTimer = null;
        }
    }

    /**
     * Get current cached price
     */
    getCurrentPrice() {
        return this.currentPrice;
    }

    /**
     * Get price history
     */
    getPriceHistory(limit = 10) {
        return this.priceHistory.slice(-limit);
    }
}

// Create a global instance
const mcxGoldFetcher = new MCXGoldFetcher();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MCXGoldFetcher, mcxGoldFetcher };
}
