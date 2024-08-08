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


async function downloadRss(url) {
    try {
        const response = await fetch(url);
        const rssText = await response.text();
        return new window.DOMParser().parseFromString(rssText, "text/xml");
    } catch (error) {
        console.error("Error fetching RSS:", error);
        throw error;
    }
}


function itemAsEpisode(item, episodeNum) {

    const title = item.querySelector("title")?.innerHTML
    const subtitle = item.querySelector("subtitle")?.innerHTML
    const pubDate = new Date(item.querySelector("pubDate")?.innerHTML)
    const link = item.querySelector("link")
    
    return new Episode(title, subtitle, pubDate, link, episodeNum)
}


function episodeAsCard(episode) {
    const card = createElement('div', 'episode');

    const titleLink = createElement(
        'a', null, `${episode.episodeNum}. ${episode.title}`);

    titleLink.href = episode.link;
    titleLink.target = '_blank';

    const title = createElement('h2');
    title.appendChild(titleLink);
    card.appendChild(title);

    const pubDate = createElement(
        'p', 'pub-date', episode.pubDate.toLocaleDateString())
    card.appendChild(pubDate);

    const subtitle = createElement('p', 'subtitle',  episode.subtitle);
    card.appendChild(subtitle);

    return card.outerHTML;
}


function createElement(tag, className, content) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
}


function parseEpisodes(json) {
    return JSON.parse(json, (key, value) => {
        if (key === "pubDate") {
            return new Date(value);
        }
        return value;
    }).map(item => Object.assign(new Episode(), item));
}



async function main() {
    
    let episodes = []

    json = sessionStorage.getItem("episodesCache")

    if (json) {

        console.log("Cache found")
        episodes = parseEpisodes(json)
        
    } else {

        console.log("Cache not found")

        const rss = await downloadRss(RSS_URL);
        const items = rss.querySelectorAll("item");
        const n = items.length;

        for (let i = 0; i < n; i++) {
            const ep = itemAsEpisode(items[i], (n - i));
            episodes.push(ep);
        }

        sessionStorage.setItem("episodesCache", JSON.stringify(episodes));
    }

    console.log("episodes:", episodes)

    const i = Math.floor(Math.random() * episodes.length);
    const suggestedEp = episodes[i];

    document
        .getElementById("episode-container")
        .innerHTML = (episodeAsCard(suggestedEp));
}

main();
