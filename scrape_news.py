import feedparser
import json
from datetime import datetime
from bs4 import BeautifulSoup
import requests

FEEDS = [
    "https://www.almashhad-alyemeni.com/feed",
    "https://yemennownews.com/feed",
    "https://www.24-post.com/feed"
]

def get_feed(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return feedparser.parse(response.content)
    except:
        return None

articles = []
for feed_url in FEEDS:
    feed = get_feed(feed_url)
    if feed and feed.entries:
        for entry in feed.entries[:30]:  # Get 30 latest per feed
            try:
                articles.append({
                    "title": BeautifulSoup(entry.title, 'html.parser').get_text(),
                    "url": entry.link,
                    "source": feed_url.split('//')[1].split('/')[0],
                    "date": datetime.utcnow().isoformat() + "Z"
                })
            except:
                continue

# Save to JSON
with open('data/news.json', 'w', encoding='utf-8') as f:
    json.dump({
        "lastUpdated": datetime.utcnow().isoformat() + "Z",
        "articles": articles[:150]  # Keep only 150 latest
    }, f, ensure_ascii=False, indent=2)
