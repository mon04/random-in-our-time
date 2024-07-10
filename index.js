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
        new window.DOMParser().parseFromString(rssText, "text/xml"))

    const items = data.querySelectorAll("item")
    
    const randomIndex = Math.floor(Math.random() * items.length)
    const item = items[randomIndex]
    const episodeNum = items.length - randomIndex

    const title = getElementContent(item, "title")
    const subtitle = getElementContent(item, "subtitle")
    const pubDate = new Date(getElementContent(item, "pubDate"))
    const link = getElementContent(item, "link")

    return new Episode(title, subtitle, pubDate, link, episodeNum)
}

function getElementContent(element, tag) {
    return element.querySelector(tag)?.innerHTML || '';
}

function episodeAsElement(episode) {
    const episodeDiv = createElement('div', 'episode');

    const titleLink = createElement('a', null, 
        `${episode.episodeNum}. ${episode.title || 'No title available'}`);
    titleLink.href = episode.link || '#';
    titleLink.target = '_blank';

    const titleElement = createElement('h2');
    titleElement.appendChild(titleLink);
    episodeDiv.appendChild(titleElement);

    const pubDateElement = createElement('p', 'pub-date', 
        episode.pubDate
            ? episode.pubDate.toLocaleDateString()
            : 'No date available');
    episodeDiv.appendChild(pubDateElement);

    const subtitleElement = createElement('p', null, 
        episode.subtitle || 'No subtitle available');
    episodeDiv.appendChild(subtitleElement);

    return episodeDiv.outerHTML;
}

function createElement(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
}

getRandomEpisode().then(episode => {
    document.getElementById("episode-container").innerHTML = (
        episodeAsElement(episode));
}).catch(error => {
    console.error("Failed to render episode:", error);
});