"use strict";

fetch(`http://165.22.223.28/api/manga/read_comic?id=${getParams("comic_id")}`)
    .then((data) => {
        return data.json();
    })
    .then((obj) => {
        if (obj.success) {
            let episodeHTML = "";
            const comic = obj.comic_data;
            const episodes = comic.episodes;

            episodes.forEach((episode) => {
                episodeHTML += `<a href="read.html?comic_name=${comic.comic_title}&episode_id=${
                    episode.episode_id
                }" class="card"><img class="image" src="${placeholderImage}" alt="comic image" data-src="${
                    comic.title_img.replace("https", "http") /* placeholderTestImage*/
                }" /><h2 class="title">${episode.episode_number}</h2></a>`;
            });

            document.getElementById("comic_name").innerText = comic.comic_title;
            document.getElementById("all_episodes").innerHTML = episodeHTML;
        } else if (!obj.success) {
            showMsg(obj.error, true);
        } else {
            showMsg("Problem with api", false);
        }
    })
    .then(() => {
        hideLoader();
    })
    .catch((err) => {
        showMsg(err, true);
    });
