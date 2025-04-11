import feedparser
import json
from datetime import datetime

# Yemeni RSS feeds
FEEDS = [
    "https://www.almashhad-alyemeni.com/feed",
    "https://yemennownews.com/feed",
    "https://www.24-post.com/feed",
    "https://www.anbaaden.com/feed",
    "https://huna-aden.com/feed",
    "https://taiztoday.net/feed",
    "https://www.lahjnews.net/feed",
    "https://almasdaronline.com/feed",
    "https://www.marebpress.net/feed",
    "https://www.yemeneconomist.com/feed",
    "https://yemen-press.net/feed",
    "https://alsahwa-yemen.net/feed",
    "https://www.aljazeera.net/",
    "https://www.france24.com/ar/",
    "https://sahaafa.net/",
    "https://sa24.co/",
    "https://www.awraqpress.net/portal/",
    "https://almethaq.net/news/"

]

articles = []

for feed_url in FEEDS:
    feed = feedparser.parse(feed_url)
    for entry in feed.entries[:50]:  # Get latest 50 per feed
        articles.append({
            "title": entry.title,
            "url": entry.link,
            "source": feed_url.split('//')[1].split('/')[0],
            "date": datetime.utcnow().isoformat() + "Z"
        })

# Save to JSON
with open('data/news.json', 'w') as f:
    json.dump({
        "lastUpdated": datetime.utcnow().isoformat() + "Z",
        "articles": articles
    }, f, ensure_ascii=False)
