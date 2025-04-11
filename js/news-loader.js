// Configuration
const NEWS_PER_PAGE = 15;
let currentPage = 1;
let allArticles = [];

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
        
        // Process articles
        if (data.articles && data.articles.length > 0) {
            allArticles = data.articles;
            
            // Display news with pagination
            displayPaginatedNews();
            
            // Update last updated time
            updateLastUpdated(data.lastUpdated);
            
            // Initialize search and sort
            initNewsFilters();
        } else {
            showError("لا توجد أخبار متاحة حالياً. يرجى المحاولة لاحقاً.");
        }
    } catch (error) {
        showError("فشل تحميل الأخبار. يرجى المحاولة مرة أخرى.");
        console.error("News loading error:", error);
    }
}

// Display news with pagination
function displayPaginatedNews() {
    const startIdx = (currentPage - 1) * NEWS_PER_PAGE;
    const endIdx = startIdx + NEWS_PER_PAGE;
    const paginatedArticles = allArticles.slice(startIdx, endIdx);
    
    renderNews(paginatedArticles);
    updatePaginationControls();
}

// Render news articles to the page
function renderNews(articles) {
    const container = document.getElementById('news-container');
    container.innerHTML = articles.map(article => `
        <div class="news-item" onclick="viewArticle('${article.url}')">
            <h3>${article.title}</h3>
            <div class="news-source">${article.source || "مصدر غير معروف"}</div>
            <div class="news-excerpt">${generateExcerpt(article.description || article.title)}</div>
            <div class="news-meta">
                <span class="news-time">
                    ${formatNewsTime(article.date)}
                </span>
                <span class="view-count">👁️ ${formatViewCount(article.views || 0)}</span>
            </div>
        </div>
    `).join('');
}

// Update pagination controls
function updatePaginationControls() {
    const totalPages = Math.ceil(allArticles.length / NEWS_PER_PAGE);
    const paginationDiv = document.getElementById('pagination');
    
    if (paginationDiv) {
        // Update page numbers
        document.getElementById('page-numbers').innerHTML = Array.from(
            {length: totalPages}, 
            (_, i) => `<button class="page-btn ${i+1 === currentPage ? 'active' : ''}" onclick="goToPage(${i+1})">${i+1}</button>`
        ).join('');
        
        // Update prev/next buttons
        document.querySelector('.prev').disabled = currentPage === 1;
        document.querySelector('.next').disabled = currentPage === totalPages;
    }
}

// Navigation functions
function goToPage(page) {
    currentPage = page;
    displayPaginatedNews();
    window.scrollTo(0, 0);
}

function nextPage() {
    if (currentPage < Math.ceil(allArticles.length / NEWS_PER_PAGE)) {
        currentPage++;
        displayPaginatedNews();
        window.scrollTo(0, 0);
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayPaginatedNews();
        window.scrollTo(0, 0);
    }
}

// Initialize news filters
function initNewsFilters() {
    const searchInput = document.getElementById('news-search');
    const sortSelect = document.getElementById('news-sort');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allArticles.filter(article => 
                article.title.toLowerCase().includes(term) || 
                (article.description && article.description.toLowerCase().includes(term))
            
            allArticles = term ? filtered : allArticles;
            currentPage = 1;
            displayPaginatedNews();
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            allArticles.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return e.target.value === 'newest' ? dateB - dateA : dateA - dateB;
            });
            currentPage = 1;
            displayPaginatedNews();
        });
    }
}

// View article in embedded mode
function viewArticle(url) {
    // Track view count (simulated)
    const article = allArticles.find(a => a.url === url);
    if (article) {
        article.views = (article.views || 0) + 1;
    }
    
    localStorage.setItem('currentArticleUrl', url);
    window.location.href = 'article.html';
}

// Helper functions
function showError(message) {
    const container = document.getElementById('news-container');
    container.innerHTML = `
        <div class="error">
            <p>${message}</p>
            <button onclick="loadNews()">إعادة المحاولة</button>
        </div>
    `;
}

function updateLastUpdated(timestamp) {
    const date = new Date(timestamp);
    document.getElementById('last-updated').textContent = 
        date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
}

function generateExcerpt(text) {
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
}

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

function formatViewCount(count) {
    return count >= 1000 ? (count/1000).toFixed(1) + 'K' : count;
}

// Initialize when page loads
if (document.getElementById('news-container')) {
    loadNews();
    setInterval(loadNews, 300000); // Refresh every 5 minutes
    
    // Make functions globally available
    window.goToPage = goToPage;
    window.nextPage = nextPage;
    window.prevPage = prevPage;
    window.viewArticle = viewArticle;
}
