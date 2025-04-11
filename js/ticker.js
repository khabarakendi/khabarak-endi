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
            return Promise.resolve(); // Indicate success
        } else {
            showTickerError('No breaking news available');
            return Promise.reject('No news items available');
        }
    } catch (error) {
        console.error('Ticker error:', error);
        showTickerError('Failed to load breaking news');
        return Promise.reject(error);
    }
}

function updateTicker() {
    const tickerElement = document.getElementById('breaking-news-ticker');
    if (!tickerElement) return;
    
    // Fade out current content
    tickerElement.style.opacity = 0;
    
    setTimeout(() => {
        // Update content
        tickerElement.textContent = tickerItems[currentTickerIndex];
        // Fade in new content
        tickerElement.style.opacity = 1;
        
        // Move to next item
        currentTickerIndex = (currentTickerIndex + 1) % tickerItems.length;
    }, 300); // Match this with CSS transition time
}

function showTickerError(message) {
    const tickerElement = document.getElementById('breaking-news-ticker');
    if (tickerElement) {
        tickerElement.innerHTML = `<span class="ticker-error">${message}</span>`;
    }
}
