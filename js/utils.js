// Format English date/time
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    document.getElementById('datetime').textContent = 
        now.toLocaleDateString('en-US', options);
}

// Simple error handler
function showError(message) {
    const container = document.getElementById('news-container');
    container.innerHTML = `
        <div class="error">
            <p>${message}</p>
            <button onclick="loadNews()">Retry</button>
        </div>
    `;
}
