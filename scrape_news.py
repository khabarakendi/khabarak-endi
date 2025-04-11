import feedparser
import json
from datetime import datetime
from bs4 import BeautifulSoup

FEEDS = [
    "https://almasdaronline.com/feed",
    "https://yemennownews.com/feed",
    "https://www.24-post.com/feed"
]

def clean_html(text):
    soup = BeautifulSoup(text, 'html.parser')
    return soup.get_text()

articles = []
for feed_url in FEEDS:
    feed = feedparser.parse(feed_url)
    for entry in feed.entries[:50]:  # Get 50 latest per feed
        articles.append({
            "title": clean_html(entry.title),
            "url": entry.link,
            "source": feed_url.split('//')[1].split('/')[0],
            "date": datetime.utcnow().isoformat() + "Z"
        })

# Save to JSON
with open('data/news.json', 'w', encoding='utf-8') as f:
    json.dump({
        "lastUpdated": datetime.utcnow().isoformat() + "Z",
        "articles": articles[:150]  # Keep only 150 latest
    }, f, ensure_ascii=False, indent=2)
