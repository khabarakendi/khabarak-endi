let tickerItems = [];
let animationId;

async function startTicker() {
    try {
        // Clear previous animation if any
        if (animationId) {
            cancelAnimationFrame(animationId);
        }

        // Show loading message
        updateTickerContent('جاري تحميل العناوين...');

        // Load news data with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('data/news.json', {
            signal: controller.signal,
            cache: 'no-cache'
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Process news items
        tickerItems = processNewsItems(data.articles);

        if (tickerItems.length === 0) {
            updateTickerContent('لا توجد أخبار عاجلة حالياً');
            return;
        }

        // Start scrolling animation
        startScrollingAnimation();

    } catch (error) {
        console.error('Ticker loading error:', error);
        updateTickerContent('خطأ في تحميل الأخبار - جاري المحاولة مرة أخرى');
        // Retry after 5 seconds
        setTimeout(startTicker, 5000);
    }
}

function processNewsItems(articles) {
    return articles.slice(0, 10).map(item => {
        try {
            const date = new Date(item.date);
            const timeString = date.toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            return `${item.title} (${timeString})`;
        } catch (e) {
            console.error('Error processing news item:', e);
            return item.title;
        }
    }).filter(Boolean);
}

function startScrollingAnimation() {
    const tickerElement = document.getElementById('breaking-news-ticker');
    if (!tickerElement) return;

    const contentElement = document.createElement('div');
    contentElement.className = 'ticker-scroll-content';

    // Duplicate content for seamless looping
    const contentText = tickerItems.join(' ••• ');
    contentElement.textContent = contentText + ' ••• ' + contentText;

    tickerElement.innerHTML = '';
    tickerElement.appendChild(contentElement);

    let position = 0;
    const contentWidth = contentElement.scrollWidth / 2;
    const speed = 50; // pixels per second

    const animate = () => {
        position -= speed / 60; // Adjust for 60fps
        if (position <= -contentWidth) {
            position = 0;
        }
        contentElement.style.transform = `translateX(${position}px)`;
        animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
}

function updateTickerContent(message) {
    const tickerElement = document.getElementById('breaking-news-ticker');
    if (tickerElement) {
        tickerElement.innerHTML = `<div class="ticker-message">${message}</div>`;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', startTicker);
