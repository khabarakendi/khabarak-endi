// Initialize the ticker when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateBreakingNews(); // Run immediately
    setInterval(updateBreakingNews, 300000); // Update every 5 minutes
});

// Main function to update breaking news ticker
function updateBreakingNews() {
    fetch('data/news.json?t=' + Date.now()) // Cache buster
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            if (data.articles && data.articles.length > 0) {
                const latestNews = data.articles.slice(0, 3); // Get 3 latest
                const tickerContent = latestNews.map(news => 
                    `🚨 ${news.title} • `
                ).join('');
                
                // Update the bottom breaking news bar
                document.getElementById('breaking-news-ticker').innerHTML = tickerContent;
            } else {
                showTickerError();
            }
        })
        .catch(error => {
            console.error('Error loading breaking news:', error);
            showTickerError();
        });
}

// Show error/default message in ticker
function showTickerError() {
    document.getElementById('breaking-news-ticker').innerHTML = 
        '🚨 تحديث الأخبار العاجلة قريبًا • ';
}

// Backward compatibility (can be removed later)
function startTicker() {
    updateBreakingNews();
}

// Backward compatibility (can be removed later)
async function updateTicker() {
    await updateBreakingNews();
}
