const RSS_URL = "https://podcasts.files.bbci.co.uk/b006qykl.rss"

class Episode {
    constructor(title, subtitle, pubDate, link) {
        this.title = title;
        this.subtitle = subtitle;
        this.pubDate = pubDate;
        this.link = link;
    }
}

async function getRandomEpisode() {
    const response = await fetch(RSS_URL)
    const rssText = await response.text()
    const data = (
        new window.DOMParser().parseFromString(rssText, "text/xml")
    )

    const items = data.querySelectorAll("item")
    const item = items[Math.floor(Math.random() * items.length)]

    const title = item.querySelector("title")?.innerHTML
    const subtitle = item.querySelector("subtitle")?.innerHTML
    const pubDate = new Date(item.querySelector("pubDate")?.innerHTML)
    const link = item.querySelector("link")?.innerHTML

    episode = new Episode(title, subtitle, pubDate, link)
    return episode
}

function episodeElement(episode) {
    const episodeDiv = document.createElement('div');
    episodeDiv.className = 'episode';

    const titleLink = document.createElement('a');
    titleLink.href = episode.link || '#';
    titleLink.textContent = episode.title || 'No title available';
    titleLink.target = '_blank';

    const titleElement = document.createElement('h2');
    titleElement.appendChild(titleLink);
    episodeDiv.appendChild(titleElement);

    const subtitleElement = document.createElement('p');
    subtitleElement.textContent = episode.subtitle || 'No subtitle available';
    episodeDiv.appendChild(subtitleElement);

    const pubDateElement = document.createElement('p');
    pubDateElement.className = 'pub-date';
    pubDateElement.textContent = (
        `Published on: ${
            episode.pubDate.toLocaleDateString() || 'No date available'
        }`)
    episodeDiv.appendChild(pubDateElement);

    return episodeDiv.outerHTML;
}


episode = getRandomEpisode()

getRandomEpisode().then(episode => {
    document.getElementById("episode-container").innerHTML = (
        episodeElement(episode));
}).catch(error => {
    console.error("Failed to render episode:", error);
});