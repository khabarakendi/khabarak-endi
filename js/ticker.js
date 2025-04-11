let tickerItems = [];
let animationId;

async function startTicker() {
    try {
        // إلغاء أي حركة سابقة
        if (animationId) {
            cancelAnimationFrame(animationId);
        }

        updateTickerContent('جاري تحميل العناوين...');

        // إعداد التحكم في الوقت
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000); // 7 ثوانٍ مهلة

        // تحميل ملف الأخبار
        const response = await fetch('data/news.json', {
            signal: controller.signal,
            cache: 'no-cache'
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`فشل التحميل: ${response.status}`);
        }

        const data = await response.json();

        // التأكد من وجود مقالات
        if (!data.articles || !Array.isArray(data.articles)) {
            throw new Error('ملف الأخبار غير صالح أو فارغ');
        }

        tickerItems = processNewsItems(data.articles);

        if (tickerItems.length === 0) {
            updateTickerContent('لا توجد أخبار عاجلة حالياً');
            return;
        }

        startScrollingAnimation();

    } catch (error) {
        console.error('خطأ تحميل الأخبار:', error.message);
        updateTickerContent('فشل في تحميل الأخبار العاجلة، ستتم إعادة المحاولة...');
        setTimeout(startTicker, 5000); // إعادة المحاولة بعد 5 ثوانٍ
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
            console.warn('تعذر تحليل التاريخ للمقال:', item.title);
            return item.title;
        }
    }).filter(Boolean);
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
    const speed = 50; // السرعة بالبكسل/ثانية

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

// تحميل عند فتح الصفحة
document.addEventListener('DOMContentLoaded', startTicker);
