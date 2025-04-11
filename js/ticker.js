async function updateTicker() {
    try {
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_FEEDS[0])}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        const headlines = data.items.slice(0, 3).map(item => item.title);
        document.getElementById('ticker-content').textContent = headlines.join(' | ');
    } catch (error) {
        console.error("Ticker error:", error);
    }
}

// Update every 2 minutes
updateTicker();
setInterval(updateTicker, 120000);
