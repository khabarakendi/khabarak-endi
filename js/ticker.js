let tickerItems = [];
let animationId;

async function startTicker() {
    try {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }

        updateTickerContent('جاري تحميل العناوين...');

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

        tickerItems = processNewsItems(data.articles);

        if (!tickerItems.length) {
            updateTickerContent('لا توجد أخبار عاجلة حالياً');
            return;
        }

        startScrollingAnimation();

    } catch (error) {
        console.error('Ticker loading error:', error);
        updateTickerContent('خطأ في تحميل الأخبار - إعادة المحاولة خلال لحظات...');
        setTimeout(startTicker, 5000);
    }
}

function processNewsItems(articles) {
    return articles
        .slice(0, 10)
        .map(item => {
            try {
                const date = new Date(item.date);
                const timeString = date.toLocaleTimeString('ar-EG', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
                return `${item.title} (${timeString})`;
            } catch (e) {
                console.warn('Date parsing failed for:', item.title);
                return item.title;
            }
        })
        .filter(Boolean);
}

function startScrollingAnimation() {
    const tickerElement = document.getElementById('breaking-news-ticker');
    if (!tickerElement) return;

    tickerElement.innerHTML = '';

    const contentElement = document.createElement('div');
    contentElement.className = 'ticker-scroll-content';

    const contentText = tickerItems.join(' ••• ');
    contentElement.textContent = `${contentText} ••• ${contentText}`;

    tickerElement.appendChild(contentElement);

    let position = 0;
    const contentWidth = contentElement.scrollWidth / 2;
    const speed = 50;

    const animate = () => {
        position -= speed / 60;
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

document.addEventListener('DOMContentLoaded', startTicker);
