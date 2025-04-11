// Sample news data (replace with API calls)
const newsData = [
    {
        title: "البنك المركزي اليمني يعلن إصلاحات اقتصادية جديدة",
        category: "economic",
        source: "https://example.com/1",
        time: "منذ ساعة",
        reads: "١,٢٠٤"
    },
    {
        title: "مفاوضات الحوثيين في عمان تصل إلى طريق مسدود",
        category: "local",
        source: "https://example.com/2",
        time: "منذ ٣ ساعات",
        reads: "٨٤٥"
    },
    // Add 150+ items here
];

function renderNews() {
    const container = document.getElementById('news-container');
    container.innerHTML = newsData.map(item => `
        <div class="news-item">
            <h3><a href="${item.source}" target="_blank">${item.title}</a></h3>
            <p class="meta">${item.time} | 👁️ ${item.reads}</p>
            <button class="read-more" onclick="window.open('${item.source}', '_blank')">اقرأ المزيد</button>
        </div>
    `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', renderNews);
