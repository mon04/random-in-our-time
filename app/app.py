from flask import Flask
from bs4 import BeautifulSoup
from episode import Episode
import requests
import random

RSS_URL = "https://podcasts.files.bbci.co.uk/b006qykl.rss"

app = Flask(__name__)

@app.route("/")
def hello_world():
    episode = get_random_episode()
    return f'''
    <div class="episode">
        <h2>{episode.title}</h2>
        <p>{episode.subtitle}</p>
        <p>{episode.publish_date}</p>
        <p><a href="{episode.link}">{episode.link}</a></p>
    </div>
    '''

def get_random_episode():
    res = requests.get(RSS_URL)
    soup = BeautifulSoup(res.content, 'xml')
    item = random.choice(soup.find_all('item'))

    title = item.title.text
    subtitle = item.subtitle.text
    description = item.description.text
    summary = item.summary.text
    publish_date = item.pubDate.text
    guid = item.guid.text
    link = item.link.text

    return Episode(title, description, subtitle, summary,
                   publish_date, guid, link)

