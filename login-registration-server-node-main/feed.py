import feedparser
import json
from time import mktime, strftime, strptime

# List of RSS feed URLs
feed_urls = [
    "https://www.bleepingcomputer.com/feed/",
    "https://www.darkreading.com/rss.xml",
    "https://feeds.feedburner.com/TheHackersNews",
    "https://rss.packetstormsecurity.com/news/tags/malware/",
    "https://news.drweb.com/rss/get/?c=5&lng=en",
    "https://www.malwarepatrol.net/feed/",
    "https://www.malwarebytes.com/blog/feed/index.xml ",
    "https://www.mcafee.com/blogs/other-blogs/mcafee-labs/feed",
    "https://www.cshub.com/rss/categories/attacks",
    "https://www.databreaches.net/feed/",
    "https://www.experian.com/blogs/data-breach/feed/",
    "https://medium.com/feed/@2ndsightlab",
]

# Create a list to store the feed data
feed_data = []

# Iterate over the feed URLs
for feed_url in feed_urls:
    # Parse the RSS feed
    feed = feedparser.parse(feed_url)

    # Create a dictionary to store the feed metadata
    feed_metadata = {}

    # Check if feed metadata exists
    if 'title' in feed.feed:
        feed_metadata['title'] = feed.feed.title
    else:
        feed_metadata['title'] = "Feed Title not available"

    # Check if feed metadata exists
    if 'description' in feed.feed:
        feed_metadata['description'] = feed.feed.description
    else:
        feed_metadata['description'] = "Feed Description not available"

    # Check if feed metadata exists
    if 'updated' in feed.feed:
        feed_metadata['published-date'] = feed.feed.updated
    else:
        feed_metadata['published-date'] = "Feed published-date not available"

    # Create a list to store the entry data
    entry_data = []

    # Access individual feed entries
    for entry in feed.entries:
        # Create a dictionary to store the entry metadata
        entry_metadata = {}

        # Check if entry metadata exists
        if 'title' in entry:
            entry_metadata['title'] = entry.title
        else:
            entry_metadata['title'] = "Entry Title not available"

        # Check if entry metadata exists
        if 'link' in entry:
            entry_metadata['link'] = entry.link
        else:
            entry_metadata['link'] = "Entry Link not available"

        # Check if entry metadata exists
        if 'published_parsed' in entry:
            entry_metadata['updated'] = strftime("%a, %d %b %Y %H:%M:%S %z", entry.published_parsed)
        else:
            entry_metadata['updated'] = "Entry Update not available"

        # Append the entry metadata to the entry data list
        entry_data.append(entry_metadata)

    # Append the feed metadata and entry data to the feed data list
    feed_data.append({
        'metadata': feed_metadata,
        'entries': entry_data
    })

# Save the feed data to a JSON file
with open('feeds.json', 'w') as file:
    json.dump(feed_data, file, indent=4)

# Print a success message
print("Feed data saved to feeds.json")