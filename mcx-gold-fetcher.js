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
     * For production, implement a backend API endpoint to avoid CORS issues
     */
    async fetchMCXGoldPrice() {
        // List of CORS proxy services to try (in order)
        const proxyServices = [
            'https://api.allorigins.win/get?url=',
            'https://cors-anywhere.herokuapp.com/',
            'https://api.codetabs.com/v1/proxy?quest='
        ];
        
        const targetUrl = 'https://mcxlive.org/';
        
        // Try each proxy service
        for (let i = 0; i < proxyServices.length; i++) {
            try {
                let response;
                let htmlContent;
                
                if (proxyServices[i].includes('allorigins.win')) {
                    // AllOrigins returns JSON with contents field
                    const proxyUrl = proxyServices[i] + encodeURIComponent(targetUrl);
                    response = await fetch(proxyUrl, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    htmlContent = data.contents;
                } else if (proxyServices[i].includes('codetabs.com')) {
                    // CodeTabs proxy
                    const proxyUrl = proxyServices[i] + encodeURIComponent(targetUrl);
                    response = await fetch(proxyUrl, {
                        method: 'GET',
                        mode: 'cors'
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    htmlContent = await response.text();
                } else {
                    // Standard CORS proxy
                    const proxyUrl = proxyServices[i] + targetUrl;
                    response = await fetch(proxyUrl, {
                        method: 'GET',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    htmlContent = await response.text();
                }
                
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
                console.warn(`Proxy service ${i + 1} failed:`, error.message);
                
                // If this is the last proxy, throw the error
                if (i === proxyServices.length - 1) {
                    console.error('All proxy services failed. Consider using a backend API proxy for production.');
                    throw new Error('Unable to fetch MCX Gold price. All proxy services failed. For production, implement a backend API endpoint.');
                }
                // Otherwise, try next proxy
                continue;
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
            const tables = doc.querySelectorAll('table');
            
            for (let table of tables) {
                const rows = table.querySelectorAll('tr');
                
                for (let row of rows) {
                    const cells = row.querySelectorAll('td');
                    if (cells.length >= 2) {
                        const symbolCell = cells[0];
                        const linkCell = symbolCell ? symbolCell.querySelector('a') : null;
                        const symbolText = (linkCell ? linkCell.textContent : (symbolCell ? symbolCell.textContent : '')).trim();
                        
                        // Check if this row contains MCX Gold (not Gold Mini)
                        if (symbolText && symbolText.includes('MCX Gold') && !symbolText.includes('Mini') && !symbolText.includes('Micro')) {
                            // Extract all data from cells
                            // Structure: Symbol | Last | Change | Change % | Close | High | Low | Last Trade
                            if (cells.length >= 7) {
                                const lastPrice = this.extractPrice(cells[1].textContent);
                                const change = this.extractPrice(cells[2].textContent);
                                const changePercent = this.extractChangePercent(cells[3].textContent);
                                const close = this.extractPrice(cells[4].textContent);
                                const high = this.extractPrice(cells[5].textContent);
                                const low = this.extractPrice(cells[6].textContent);
                                
                                if (lastPrice !== null) {
                                    return {
                                        symbol: 'MCX Gold',
                                        lastPrice: lastPrice,
                                        change: change,
                                        changePercent: changePercent,
                                        close: close,
                                        high: high,
                                        low: low,
                                        timestamp: new Date().toISOString()
                                    };
                                }
                            }
                        }
                    }
                }
            }
            
            // Alternative: Try regex pattern matching (more robust for different HTML structures)
            // Pattern: MCX Gold followed by price data in table format
            const goldRowPattern = /MCX Gold[^<]*<\/a>[^<]*<\/td>[^<]*<td[^>]*>([\d,]+\.\d{2})[^<]*<\/td>[^<]*<td[^>]*>([+-]?[\d,]+\.\d{2})[^<]*<\/td>[^<]*<td[^>]*>([+-]?[\d.]+%)[^<]*<\/td>[^<]*<td[^>]*>([\d,]+\.\d{2})[^<]*<\/td>[^<]*<td[^>]*>([\d,]+\.\d{2})[^<]*<\/td>[^<]*<td[^>]*>([\d,]+\.\d{2})/i;
            
            const match = html.match(goldRowPattern);
            
            if (match && match.length >= 7) {
                return {
                    symbol: 'MCX Gold',
                    lastPrice: parseFloat(match[1].replace(/,/g, '')),
                    change: parseFloat(match[2].replace(/,/g, '')),
                    changePercent: parseFloat(match[3].replace(/%/g, '')),
                    close: parseFloat(match[4].replace(/,/g, '')),
                    high: parseFloat(match[5].replace(/,/g, '')),
                    low: parseFloat(match[6].replace(/,/g, '')),
                    timestamp: new Date().toISOString()
                };
            }
            
            // Simpler regex pattern for just the price
            const simplePricePattern = /MCX Gold[\s\S]{0,1000}?<td[^>]*>[\s\S]*?<td[^>]*>([\d,]+\.\d{2})/i;
            const simpleMatch = html.match(simplePricePattern);
            
            if (simpleMatch && simpleMatch[1]) {
                const price = parseFloat(simpleMatch[1].replace(/,/g, ''));
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
