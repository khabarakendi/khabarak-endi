function startTicker() {
    updateTicker();
    setInterval(updateTicker, 300000); // Update every 5 minutes
}

async function updateTicker() {
    try {
        const response = await fetch('data/news.json?t=' + Date.now());
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            const breakingNews = data.articles.slice(0, 3).map(item => item.title);
            document.getElementById('ticker-content').textContent = 
                breakingNews.map(news => `🚨 ${news}`).join(' | ');
        }
    } catch (error) {
        console.error("Ticker error:", error);
        document.getElementById('ticker-content').textContent = 
            "🚨 Important news updates coming soon...";
    }
}
