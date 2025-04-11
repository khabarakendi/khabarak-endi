import json
from datetime import datetime
import feedparser
import requests
from bs4 import BeautifulSoup

SOURCES = [
    # ========================
    # Yemeni Local News Sources
    # ========================
    
    # RSS Feeds
    {"url": "https://www.24-post.com/feed", "name": "24 بوست", "type": "rss", "category": "محلي"},
    {"url": "https://yemennownews.com/feed", "name": "اليمن الآن", "type": "rss", "category": "محلي"},
    {"url": "https://www.almashhad-alyemeni.com/feed", "name": "المشهد اليمني", "type": "rss", "category": "محلي"},
    
    # Scraping Sources
    {
        "url": "https://www.anbaaden.com/news",
        "name": "أنباء عدن",
        "type": "html",
        "category": "عدن",
        "selectors": {
            "articles": ".news-item",
            "title": "h3",
            "link": "a",
            "time": ".time"
        }
    },
    {
        "url": "https://crater-sky.net/category/news",
        "name": "كريتر سكاي",
        "type": "html",
        "category": "محلي",
        "selectors": {
            "articles": ".post",
            "title": ".entry-title",
            "link": "a.entry-title",
            "time": ".entry-date"
        }
    },
    {
        "url": "https://almasdaronline.com/articles/latest",
        "name": "المصدر أونلاين",
        "type": "html",
        "category": "محلي",
        "selectors": {
            "articles": ".article-item",
            "title": "h2",
            "link": "a",
            "time": ".time"
        }
    },
    {
        "url": "https://alharf28.com/articles/latest",
        "name": "الحرف 28",
        "type": "html",
        "category": "محلي",
        "selectors": {
            "articles": ".post",
            "title": ".entry-title",
            "link": "a.entry-title",
            "time": ".entry-date"
        }
    },
    {
        "url": "https://sahaafa.net/articles/latest",
        "name": "صحافة نت",
        "type": "html",
        "category": "محلي",
        "selectors": {
            "articles": ".post",
            "title": ".entry-title",
            "link": "a.entry-title",
            "time": ".entry-date"
        }
    },
    # ========================
    # International Arabic News
    # ========================
    {"url": "https://www.bbc.com/arabic/arabic-news/rss.xml", "name": "BBC عربي", "type": "rss", "category": "دولي"},
    {"url": "https://www.aljazeera.net/aljazeerarss", "name": "الجزيرة نت", "type": "rss", "category": "دولي"},
    {"url": "https://www.alquds.co.uk/feed/", "name": "القدس العربي", "type": "rss", "category": "دولي"},
    {
        "url": "https://www.alhadath.net/yemen",
        "name": "الحدث نت",
        "type": "html",
        "category": "محلي",
        "selectors": {
            "articles": ".news-card",
            "title": "h3",
            "link": "a",
            "time": ".time"
        }
    }
]

def fetch_rss(url, source_name, category):
    """Fetch news from RSS feed"""
    try:
        feed = feedparser.parse(url)
        articles = []
        for entry in feed.entries[:15]:
            try:
                articles.append({
                    "title": entry.get('title', 'لا يوجد عنوان'),
                    "link": entry.get('link', '#'),
                    "source": source_name,
                    "time": entry.get('published', datetime.now().strftime("%H:%M")),
                    "category": category,
                    "image": entry.get('media_content', [{}])[0].get('url', '') if 'media_content' in entry else ''
                })
            except Exception as e:
                print(f"Error parsing RSS item from {source_name}: {str(e)}")
                continue
        return articles
    except Exception as e:
        print(f"Error fetching {source_name} RSS: {str(e)}")
        return []

def fetch_html(url, config):
    """Scrape news from HTML page"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8'
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.text, 'html.parser')
        
        articles = []
        for item in soup.select(config['selectors']['articles'])[:15]:
            try:
                title = item.select_one(config['selectors']['title']).text.strip()
                link = item.select_one(config['selectors']['link'])['href']
                
                # Fix relative links
                if not link.startswith('http'):
                    base_url = url.split('/')[0] + '//' + url.split('/')[2]
                    link = base_url + link if link.startswith('/') else base_url + '/' + link
                
                # Get image if available
                image = item.select_one('img')['src'] if item.select_one('img') else ''
                
                articles.append({
                    "title": title,
                    "link": link,
                    "source": config['name'],
                    "time": datetime.now().strftime("%H:%M"),
                    "category": config['category'],
                    "image": image
                })
            except Exception as e:
                print(f"Error parsing item from {config['name']}: {str(e)}")
                continue
                
        return articles
    except Exception as e:
        print(f"Error scraping {config['name']}: {str(e)}")
        return []

def main():
    all_articles = []
    
    for source in SOURCES:
        try:
            if source["type"] == "rss":
                all_articles.extend(fetch_rss(source["url"], source["name"], source["category"]))
            else:
                all_articles.extend(fetch_html(source["url"], source))
        except Exception as e:
            print(f"Failed to process {source.get('name', 'unknown')}: {str(e)}")
            continue
    
    # Remove duplicates
    unique_articles = []
    seen_links = set()
    for article in all_articles:
        if article['link'] not in seen_links:
            unique_articles.append(article)
            seen_links.add(article['link'])
    
    # Sort by time (newest first)
    sorted_articles = sorted(unique_articles, key=lambda x: x['time'], reverse=True)[:50]
    
    # Save to JSON
    with open('news.json', 'w', encoding='utf-8') as f:
        json.dump(sorted_articles, f, ensure_ascii=False, indent=2, default=str)

if __name__ == "__main__":
    main()
