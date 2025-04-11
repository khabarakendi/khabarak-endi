// Sample breaking news for ticker
const breakingNews = [
    "🚨 الحكومة اليمنية تعلن عن إصلاحات جديدة في قطاع الطاقة",
    "🚨 ارتفاع أسعار النفط عالمياً يؤثر على الاقتصاد اليمني",
    "🚨 وفد حوثي يصل إلى مسقط للمشاركة في محادثات السلام"
];

function updateTicker() {
    const ticker = document.getElementById('ticker-content');
    ticker.textContent = breakingNews.join(' | ');
}

// Update ticker every 10 seconds
updateTicker();
setInterval(updateTicker, 10000);
