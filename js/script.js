// Load news from JSON
async function loadNews() {
    try {
        // Add cache-buster to prevent stale content
        const response = await fetch(`data/news.json?t=${new Date().getTime()}`);
        if (!response.ok) throw new Error("Failed to load news");
        
        const data = await response.json();
        renderNews(data.articles);
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('news-container').innerHTML = `
            <div class="error">
                <p>News will update shortly. Last checked: ${new Date().toLocaleString()}</p>
            </div>
        `;
    }
}

// Render news to DOM
function renderNews(articles) {
    const container = document.getElementById('news-container');
    container.innerHTML = articles.map(article => `
        <div class="news-item" onclick="viewArticle('${encodeURIComponent(article.url)}')">
            <h3>${article.title}</h3>
            <div class="meta">
                <span class="source">${article.source}</span>
                <span class="time">${formatDate(article.date)}</span>
            </div>
        </div>
    `).join('');
}

// Format date in English
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// View article in embedded mode
function viewArticle(url) {
    localStorage.setItem('currentArticle', url);
    window.location.href = 'article.html';
}

// Update time every minute
function updateDateTime() {
    document.getElementById('datetime').textContent = 
        new Date().toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadNews();
    updateDateTime();
    setInterval(updateDateTime, 60000);
    setInterval(loadNews, 300000); // Refresh news every 5 mins
});
