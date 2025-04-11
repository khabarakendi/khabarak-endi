// Fetch breaking news
async function updateTicker() {
    try {
        const response = await fetch(`data/news.json?t=${new Date().getTime()}`);
        const data = await response.json();
        const breakingNews = data.articles.slice(0, 3).map(item => item.title);
        document.getElementById('ticker-content').textContent = 
            breakingNews.map(news => `🚨 ${news}`).join(' | ');
    } catch (error) {
        console.error("Ticker error:", error);
    }
}

// Initialize
updateTicker();
setInterval(updateTicker, 300000); // Update every 5 mins
