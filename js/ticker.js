// Red RTL ticker (left-to-right in Arabic)
const ticker = document.getElementById('ticker-content');
let tickerPos = 0;

function updateTicker() {
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://almasdaronline.com/feed')
        .then(res => res.json())
        .then(data => {
            const headlines = data.items.slice(0, 3).map(item => item.title);
            ticker.textContent = headlines.join(' • ');
            animateTicker();
        });
}

function animateTicker() {
    tickerPos -= 1;
    ticker.style.transform = `translateX(${tickerPos}px)`;
    
    if (-tickerPos > ticker.offsetWidth) {
        tickerPos = window.innerWidth;
    }
    
    requestAnimationFrame(animateTicker);
}

// Start
updateTicker();
setInterval(updateTicker, 300000); // Update every 5 minutes
