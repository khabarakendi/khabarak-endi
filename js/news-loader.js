// Main function to load news
async function loadNews() {
    const container = document.getElementById('news-container');
    
    try {
        // Show loading state
        container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>جاري تحميل الأخبار اليمنية...</p>
            </div>
        `;
        
        // Fetch news data with cache buster
        const response = await fetch('data/news.json?t=' + Date.now());
        if (!response.ok) throw new Error("Server error");
        
        const data = await response.json();
        
        // Display news
        if (data.articles && data.articles.length > 0) {
            renderNews(data.articles);
            updateLastUpdated(data.lastUpdated);
        } else {
            showError("لا توجد أخبار متاحة حالياً. يرجى المحاولة لاحقاً.");
        }
    } catch (error) {
        showError("فشل تحميل الأخبار. يرجى المحاولة مرة أخرى.");
        console.error("News loading error:", error);
    }
}

// Render news articles to the page
function renderNews(articles) {
    const container = document.getElementById('news-container');
    container.innerHTML = articles.map(article => `
        <div class="news-item" onclick="viewArticle('${article.url}')">
            <h3>${article.title}</h3>
            <div class="news-excerpt">${generateExcerpt(article.title)}</div>
            <div class="news-meta">
                <span class="news-time">
                    ${formatNewsTime(article.date)}
                </span>
            </div>
        </div>
    `).join('');
}

// View article in embedded mode
function viewArticle(url) {
    localStorage.setItem('currentArticleUrl', url);
    window.location.href = 'article.html';
}

// Show error message
function showError(message) {
    const container = document.getElementById('news-container');
    container.innerHTML = `
        <div class="error">
            <p>${message}</p>
            <button onclick="loadNews()">إعادة المحاولة</button>
        </div>
    `;
}

// Update last updated time in footer
function updateLastUpdated(timestamp) {
    const date = new Date(timestamp);
    const options = {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    document.getElementById('last-updated').textContent = 
        date.toLocaleString('en-US', options);
}

// Generate short excerpt from title
function generateExcerpt(title) {
    return title.length > 60 ? title.substring(0, 60) + '...' : title;
}

// Format date in English
function formatNewsTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Initialize when page loads
if (document.getElementById('news-container')) {
    loadNews();
    setInterval(loadNews, 300000); // Refresh every 5 minutes
}
