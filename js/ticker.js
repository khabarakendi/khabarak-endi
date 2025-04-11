// Sample breaking news data (fallback if API fails)
const sampleBreakingNews = [
    {title: "البنك المركزي يعلن إجراءات جديدة لتحسين الاقتصاد", source: "المصدر أونلاين"},
    {title: "اجتماع هام بين الحكومة والمجلس الانتقالي في عدن", source: "يمن الآن"},
    {title: "ارتفاع أسعار النفط عالمياً يؤثر على السوق المحلي", source: "الاقتصادي اليمني"}
];

function updateBreakingNews() {
    fetch('data/news.json?t=' + Date.now())
        .then(response => response.json())
        .then(data => {
            const news = data.articles && data.articles.length > 0 ? 
                data.articles.slice(0, 3) : 
                sampleBreakingNews;
            
            const tickerItems = news.map(item => 
                `🚨 ${item.title} (${item.source}) • `
            ).join('');
            
            const ticker = document.getElementById('breaking-news-ticker');
            ticker.innerHTML = tickerItems;
            
            // Restart animation
            ticker.style.animation = 'none';
            void ticker.offsetWidth;
            ticker.style.animation = 'ticker 30s linear infinite';
        })
        .catch(error => {
            console.error("Error loading breaking news:", error);
            const tickerItems = sampleBreakingNews.map(item => 
                `🚨 ${item.title} (${item.source}) • `
            ).join('');
            document.getElementById('breaking-news-ticker').innerHTML = tickerItems;
        });
}

// Initialize and update every 5 minutes
updateBreakingNews();
setInterval(updateBreakingNews, 300000);
