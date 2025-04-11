let tickerItems = [];
let currentTickerIndex = 0;

async function startTicker() {
    try {
        const response = await fetch('data/news.json');
        if (!response.ok) throw new Error('Failed to load ticker news');
        
        const data = await response.json();
        tickerItems = data.articles.slice(0, 10).map(item => item.title);
        
        if (tickerItems.length > 0) {
            updateTicker();
            setInterval(updateTicker, 5000);
        }
    } catch (error) {
        console.error('Error loading ticker:', error);
        document.getElementById('breaking-news-ticker').innerHTML = 
            '<span>لا يمكن تحميل الأخبار العاجلة حالياً</span>';
    }
}

function updateTicker() {
    const tickerElement = document.getElementById('breaking-news-ticker');
    if (!tickerElement) return;
    
    tickerElement.innerHTML = `<span>${tickerItems[currentTickerIndex]}</span>`;
    currentTickerIndex = (currentTickerIndex + 1) % tickerItems.length;
}
