const FAST_FEEDS = [
  "https://almasdaronline.com/feed",
  "https://yemennownews.com/feed"
];

async function fetchNews() {
  const newsContainer = document.getElementById('news-container');
  
  try {
    // Try CORS-anywhere proxy
    const feed = FAST_FEEDS[0];
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${feed}`;
    const response = await fetch(proxyUrl);
    const text = await response.text();
    
    // Parse RSS manually (simple version)
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    const items = xml.querySelectorAll("item");
    
    const news = Array.from(items).map(item => ({
      title: item.querySelector("title").textContent,
      link: item.querySelector("link").textContent,
      pubDate: item.querySelector("pubDate").textContent
    }));
    
    renderNews(news.slice(0, 150));
  } catch (error) {
    console.error("Error:", error);
    // Fallback to hardcoded news
    renderNews([{
      title: "اقرأ آخر الأخبار على المصدر مباشرة",
      link: "https://almasdaronline.com",
      pubDate: new Date().toISOString()
    }]);
  }
}

function renderNews(items) {
  const container = document.getElementById('news-container');
  container.innerHTML = items.map(item => `
    <div class="news-item" onclick="window.open('${item.link}', '_blank')">
      <h3>${item.title}</h3>
      <div class="meta">
        <span class="source">${new URL(item.link).hostname}</span>
        <span class="time">${new Date(item.pubDate).toLocaleString('en-US')}</span>
      </div>
    </div>
  `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchNews);
