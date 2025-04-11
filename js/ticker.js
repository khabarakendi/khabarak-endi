// Enhanced breaking news ticker with error handling and smooth animation
let tickerItems = [];
let currentTickerIndex = 0;
let tickerInterval;
const TICKER_SPEED = 5000; // 5 seconds per item

async function startTicker() {
    try {
        // Clear any existing interval
        if (tickerInterval) clearInterval(tickerInterval);
        
        // Load news data
        const response = await fetch('data/news.json');
        if (!response.ok) throw new Error('Failed to load news data');
        
        const data = await response.json();
        
        // Process news items for ticker (latest 10 headlines)
        tickerItems = data.articles
            .slice(0, 10)
            .map(item => item.title)
            .filter(title => title && title.trim().length > 0);
        
        // If we have items, start the ticker
        if (tickerItems.length > 0) {
            updateTicker();
            tickerInterval = setInterval(updateTicker, TICKER_SPEED);
        } else {
            showTickerError('No breaking news available');
        }
    } catch (error) {
        console.error('Ticker error:', error);
        showTickerError('Failed to load breaking news');
