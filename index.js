const RSS_URL = "https://podcasts.files.bbci.co.uk/b006qykl.rss"

class Episode {
    constructor(title, subtitle, pubDate, link, episodeNum) {
        this.title = title;
        this.subtitle = subtitle;
        this.pubDate = pubDate;
        this.link = link;
        this.episodeNum = episodeNum;
    }
}

async function getRandomEpisode() {
    const response = await fetch(RSS_URL)
    const rssText = await response.text()
    const data = (
        new window.DOMParser().parseFromString(rssText, "text/xml")
    )

    const items = data.querySelectorAll("item")
    const randomIndex = Math.floor(Math.random() * items.length)
    const item = items[randomIndex]

    const title = item.querySelector("title")?.innerHTML
    const subtitle = item.querySelector("subtitle")?.innerHTML
    const pubDate = new Date(item.querySelector("pubDate")?.innerHTML)
    const link = item.querySelector("link")?.innerHTML
    const episodeNum = items.length - randomIndex

    episode = new Episode(title, subtitle, pubDate, link, episodeNum)
    return episode
}

function episodeElement(episode) {
    const episodeDiv = document.createElement('div');
    episodeDiv.className = 'episode';

    const titleLink = document.createElement('a');
    titleLink.href = episode.link || '#';
    titleLink.textContent = (episode.episodeNum + ". " + episode.title) || 'No title available';
    titleLink.target = '_blank';

    const titleElement = document.createElement('h2');
    titleElement.appendChild(titleLink);
    episodeDiv.appendChild(titleElement);

    const pubDateElement = document.createElement('p');
    pubDateElement.className = 'pub-date';
    pubDateElement.textContent = (
        episode.pubDate.toLocaleDateString() || 'No date available')
    episodeDiv.appendChild(pubDateElement);
    
    const subtitleElement = document.createElement('p');
    subtitleElement.textContent = episode.subtitle || 'No subtitle available';
    episodeDiv.appendChild(subtitleElement);

    return episodeDiv.outerHTML;
}


episode = getRandomEpisode()

getRandomEpisode().then(episode => {
    document.getElementById("episode-container").innerHTML = (
        episodeElement(episode));
}).catch(error => {
    console.error("Failed to render episode:", error);
});