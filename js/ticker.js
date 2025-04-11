function updateBreakingNews() {
    fetch('data/news.json?t=' + Date.now())
        .then(response => {
            if (!response.ok) throw new Error("Network error");
            return response.json();
        })
        .then(data => {
            if (data.articles && data.articles.length > 0) {
                const breakingNews = data.articles.slice(0, 3)
                    .map(item => `🚨 ${item.title}`)
                    .join(' • ');
                
                const ticker = document.getElementById('breaking-news-ticker');
                if (ticker) {
                    ticker.innerHTML = breakingNews;
                    // Restart animation
                    ticker.style.animation = 'none';
                    void ticker.offsetWidth; // Trigger reflow
                    ticker.style.animation = 'ticker 30s linear infinite';
                }
            } else {
                throw new Error("No articles found");
            }
        })
        .catch(error => {
            console.error("Breaking news error:", error);
            document.getElementById('breaking-news-ticker').innerHTML = 
                '🚨 تحديث الأخبار العاجلة قريبًا • ';
        });
}

// Initialize immediately
updateBreakingNews();
setInterval(updateBreakingNews, 300000); // Update every 5 minutes
