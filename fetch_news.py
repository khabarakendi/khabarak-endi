import feedparser
import json
from datetime import datetime
import hashlib

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

def parse_feed(url):
    try:
        return feedparser.parse(url).entries
    except Exception as e:
        print(f"Error parsing {url}: {e}")
        return []

def clean_item(entry):
    return {
        "title": entry.get("title", "").strip(),
        "link": entry.get("link", ""),
        "source": entry.get("source", {}).get("title", "") if "source" in entry else entry.get("link", "").split('/')[2],
        "time": entry.get("published", entry.get("updated", "")),
        "category": entry.get("tags", [{}])[0].get("term", "عام") if "tags" in entry else "عام",
        "image": ""
    }

all_items = []

for feed_url in FEEDS:
    entries = parse_feed(feed_url)
    cleaned = [clean_item(entry) for entry in entries]
    all_items.extend(cleaned)

def sort_key(item):
    try:
        return datetime.strptime(item["time"][:25], "%a, %d %b %Y %H:%M:%S")
    except:
        return datetime.min

all_items.sort(key=sort_key, reverse=True)
latest_news = all_items[:150]

with open("news.json", "w", encoding="utf-8") as f:
    json.dump(latest_news, f, ensure_ascii=False, indent=2)
