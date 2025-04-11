async function loadNews() {
    try {
        const response = await fetch('data/news.json');
        if (!response.ok) throw new Error('Failed to load news');
        
        const data = await response.json();
        displayNews(data.articles);
        updateLastUpdated(data.lastUpdated);
    } catch (error) {
        console.error('Error loading news:', error);
        document.getElementById('news-container').innerHTML = `
            <div class="error">
                <p>حدث خطأ أثناء تحميل الأخبار. يرجى المحاولة مرة أخرى لاحقًا.</p>
            </div>
        `;
    }
}

function displayNews(articles) {
    const container = document.getElementById('news-container');
    if (!articles || articles.length === 0) {
        container.innerHTML = '<div class="error"><p>لا توجد أخبار متاحة حاليًا.</p></div>';
        return;
    }

    let html = '<div class="news-grid">';
    articles.forEach(article => {
        html += `
            <div class="news-card">
                <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                <div class="news-meta">
                    <span class="source">${article.source}</span>
                    <span class="date">${formatDate(article.date)}</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

function updateLastUpdated(timestamp) {
    const date = new Date(timestamp);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('last-updated').textContent = date.toLocaleDateString('ar-EG', options);
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
function displayNews(articles) {
    const container = document.getElementById('news-container');
    if (!articles || articles.length === 0) {
        container.innerHTML = '<div class="error"><p>لا توجد أخبار متاحة حاليًا</p></div>';
        return;
    }

    let html = '<div class="news-grid">';
    articles.forEach(article => {
        const date = new Date(article.date);
        const dateString = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        const timeString = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        
        html += `
            <div class="news-card">
                <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
                <div class="news-meta">
                    <span class="source">${article.source}</span>
                    <span class="datetime">${dateString} • ${timeString}</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

function updateLastUpdated(timestamp) {
    const date = new Date(timestamp);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    document.getElementById('last-updated').textContent = `آخر تحديث: ${date.toLocaleDateString('en-US', options)}`;
}
