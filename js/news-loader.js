// Main news loading function with enhanced error handling
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

        // Try multiple fallback methods if primary fails
        let newsData = await tryFetchNews();
        
        if (!newsData || !newsData.articles || newsData.articles.length === 0) {
            newsData = await tryLocalStorageNews();
        }

        if (!newsData || !newsData.articles || newsData.articles.length === 0) {
            newsData = await trySampleNews();
        }

        if (newsData?.articles?.length > 0) {
            renderNews(newsData.articles);
            updateLastUpdated(newsData.lastUpdated || new Date().toISOString());
            localStorage.setItem('cachedNews', JSON.stringify(newsData));
        } else {
            showError("لا توجد أخبار متاحة حالياً. يرجى المحاولة لاحقاً.");
        }
    } catch (error) {
        console.error("Failed to load news:", error);
        showError("فشل تحميل الأخبار. يرجى المحاولة مرة أخرى.");
    }
}

// Try fetching from API first
async function tryFetchNews() {
    try {
        const response = await fetch('data/news.json?t=' + Date.now());
        if (!response.ok) throw new Error("API response not OK");
        return await response.json();
    } catch (error) {
        console.warn("Failed to fetch news:", error);
        return null;
    }
}

// Fallback to cached news
async function tryLocalStorageNews() {
    const cached = localStorage.getItem('cachedNews');
    if (cached) {
        console.log("Using cached news data");
        return JSON.parse(cached);
    }
    return null;
}

// Final fallback to sample news
async function trySampleNews() {
    console.log("Using sample news data");
    return {
        lastUpdated: new Date().toISOString(),
        articles: [
            {
                title: "اجتماع هام بين الحكومة والمجلس الانتقالي في عدن",
                url: "#",
                source: "المصدر أونلاين",
                date: new Date().toISOString(),
                description: "اجتماع يهدف إلى مناقشة الأوضاع السياسية والأمنية في البلاد"
            },
            {
                title: "البنك المركزي يعلن إجراءات جديدة لتحسين الاقتصاد",
                url: "#",
                source: "يمن الآن",
                date: new Date().toISOString(),
                description: "إجراءات تهدف إلى تحسين سعر الصرف وتثبيت الأسعار"
            }
        ]
    };
}

// Render news articles
function renderNews(articles) {
    const container = document.getElementById('news-container');
    container.innerHTML = articles.map(article => `
        <div class="news-item" onclick="viewArticle('${article.url}')">
            <h3>${article.title}</h3>
            <div class="news-source">${article.source || "مصدر غير معروف"}</div>
            <div class="news-excerpt">${article.description || "لا يوجد وصف متاح"}</div>
            <div class="news-meta">
                <span>${formatNewsTime(article.date)}</span>
                <span class="view-count">👁️ ${Math.floor(Math.random() * 1000)}</span>
            </div>
        </div>
    `).join('');
}

// Helper functions
function updateLastUpdated(timestamp) {
    document.getElementById('last-updated').textContent = formatNewsTime(timestamp);
}

function formatNewsTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('ar-YE', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showError(message) {
    const container = document.getElementById('news-container');
    container.innerHTML = `
        <div class="error">
            <p>${message}</p>
            <button onclick="loadNews()">إعادة المحاولة</button>
        </div>
    `;
}

// Initialize
if (document.getElementById('news-container')) {
    loadNews();
    setInterval(loadNews, 300000); // Refresh every 5 minutes
}
