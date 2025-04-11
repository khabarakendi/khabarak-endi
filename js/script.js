// Yemeni RSS Feed Sources (your list)
const RSS_FEEDS = [
    "https://yemennownews.com/feed",
    "https://www.24-post.com/feed",
    "https://www.anbaaden.com/feed",
    "https://huna-aden.com/feed",
    "https://taiztoday.net/feed",
    "https://www.lahjnews.net/feed",
    "https://almasdaronline.com/feed",
    "https://www.marebpress.net/feed",
    "https://www.yemeneconomist.com/feed",
    "https://yemen-press.net/feed",
    "https://alsahwa-yemen.net/feed",
    "https://www.aljazeera.net/feed",
    "https://www.france24.com/ar/",
    "https://sahaafa.net/",
    "https://sa24.co/",
    "https://www.awraqpress.net/portal/",
    "https://almethaq.net/news/",
    "https://www.adngad.net/",
    "https://crater-news.net/",
    "https://crater-sky.net/",
    "https://www.alhurra.com/",
    "https://aawsat.com/feed",
    "https://apnews.com/feed",
    "https://x.com/financialjuice",
    "https://belqees.net/",
    "https://alsjl-news.com/",
    "https://www.khabaragency.net/",
    "https://ym-now.net/",
    "https://arabic.rt.com/focuses/62314-%D8%A7%D9%84%D9%8A%D9%85%D9%86/",
];

// Convert RSS to JSON using free proxy (rss2json.com)
async function fetchNews() {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '<p>جاري تحميل الأخبار...</p>';

    try {
        let allNews = [];
        
        // Fetch from each RSS feed
        for (const feedUrl of RSS_FEEDS) {
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.items) {
                allNews = [...allNews, ...data.items.map(item => ({
                    title: item.title,
                    source: item.link,
                    time: new Date(item.pubDate).toLocaleString('ar-YE'),
                    reads: "جديد"
                }))];
            }
        }

        // Display first 150 news items
        renderNews(allNews.slice(0, 150));
    } catch (error) {
        console.error("Error:", error);
        newsContainer.innerHTML = '<p>عذراً، حدث خطأ أثناء تحميل الأخبار.</p>';
    }
}

function renderNews(news) {
    const container = document.getElementById('news-container');
    container.innerHTML = news.map(item => `
        <div class="news-item">
            <h3><a href="${item.source}" target="_blank">${item.title}</a></h3>
            <p class="meta">${item.time} | 👁️ ${item.reads}</p>
            <button class="read-more" onclick="window.open('${item.source}', '_blank')">اقرأ المزيد</button>
        </div>
    `).join('');
}

// Initialize and refresh every 10 minutes
document.addEventListener('DOMContentLoaded', fetchNews);
setInterval(fetchNews, 600000);
