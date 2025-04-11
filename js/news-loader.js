async function loadNews() {
    const container = document.getElementById('news-container');
    
    try {
        // Show loading state
        container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading Yemeni news...</p>
            </div>
        `;
        
        // Fetch news data
        const response = await fetch('data/news.json?t=' + Date.now());
        if (!response.ok) throw new Error("Server error");
        
        const data = await response.json();
        
        // Display news
        if (data.articles && data.articles.length > 0) {
            renderNews(data.articles);
        } else {
            showError("No news available right now. Please check back later.");
        }
    } catch (error) {
        showError("Failed to load news. Please try again.");
        console.error("News loading error:", error);
    }
}

function renderNews(articles) {
    const container = document.getElementById('news-container');
    container.innerHTML = articles.map(article => `
        <div class="news-item" onclick="viewArticle('${article.url}')">
            <h3>${article.title}</h3>
            <div class="meta">
                <span class="source">${article.source}</span>
                <span class="time">${new Date(article.date).toLocaleString('en-US')}</span>
            </div>
        </div>
    `).join('');
}

function viewArticle(url) {
    // Open in new tab for now (we'll add embedded viewer later)
    window.open(url, '_blank');
}
