// Configuration
const NEWS_DATA_URL = 'data/news.json';
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// DOM Elements
const newsContainer = document.getElementById('news-container');
const datetimeElement = document.getElementById('datetime');

// Load and display news
async function loadNews() {
    try {
        const response = await fetch(`${NEWS_DATA_URL}?t=${Date.now()}`);
        if (!response.ok) throw new Error("Failed to fetch news");
        
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        console.error("Error loading news:", error);
        newsContainer.innerHTML = `
            <div class="error">
                <p>Failed to load news. Retrying...</p>
                <p>Last checked: ${formatDate(new Date())}</p>
            </div>
        `;
    }
}

// Display news articles
function displayNews(articles) {
    if (!articles || articles.length === 0) {
        newsContainer.innerHTML = '<div class="error">No news available at this time</div>';
        return;
    }

    newsContainer.innerHTML = articles.map(article => `
        <div class="news-item" onclick="viewArticle('${encodeURIComponent(article.url)}')">
            <h3>${article.title}</h3>
            <div class="meta">
                <span class="source">${article.source}</span>
                <span class="time">${formatDate(new Date(article.date))}</span>
            </div>
        </div>
    `).join('');
}

// Format date in English
function formatDate(date) {
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Update current time
function updateDateTime() {
    datetimeElement.textContent = formatDate(new Date());
}

// View article in embedded mode
function viewArticle(url) {
    sessionStorage.setItem('currentArticle', url);
    window.location.href = 'article.html';
}

// Initialize
function init() {
    loadNews();
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update time every minute
    setInterval(loadNews, REFRESH_INTERVAL); // Refresh news
}

document.addEventListener('DOMContentLoaded', init);
