// Cache DOM elements
const newsContainer = document.getElementById('news-container');

// Preload 5 Yemeni RSS feeds (for speed)
const FAST_FEEDS = [
    "https://www.almashhad-alyemeni.com/feed",
    "https://almasdaronline.com/feed",
    "https://yemennownews.com/feed",
    "https://www.yemeneconomist.com/feed",
    "https://www.24-post.com/feed"
];

async function fetchNews() {
    // Show loading state
    newsContainer.innerHTML = '<div class="loading">Loading latest updates...</div>';
    
    try {
        // Fetch from fastest feeds first
        const promises = FAST_FEEDS.map(feed => 
            fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`)
                .then(res => res.json())
                .catch(e => null)
        );

        // Resolve all feeds in parallel
        const results = await Promise.all(promises);
        const validNews = results.filter(r => r?.items).flatMap(r => r.items);
        
        // Render immediately with first 150 items
        renderNews(validNews.slice(0, 150));
        
        // Continue loading other feeds in background
        loadRemainingFeeds();
    } catch (error) {
        console.error("Initial load failed:", error);
        newsContainer.innerHTML = '<div class="error">Failed to load news. Retrying...</div>';
        setTimeout(fetchNews, 5000);
    }
}

function renderNews(items) {
    newsContainer.innerHTML = items.map(item => `
        <div class="news-item" onclick="viewArticle('${encodeURIComponent(item.link)}')">
            <h3>${item.title}</h3>
            <div class="meta">
                <span class="source">${getDomain(item.link)}</span>
                <span class="time">${formatDate(item.pubDate)}</span>
            </div>
        </div>
    `).join('');
}

// Helper functions
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function getDomain(url) {
    return new URL(url).hostname.replace('www.', '');
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchNews);
