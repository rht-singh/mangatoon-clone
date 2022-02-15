"use strict";

if (navigator.onLine) {
    fetch(`${baseURL}/api/manga/read_comic?id=${getParams("comic_id")}`)
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
                    }" class="card"><img class="image" src="${comic.title_img.replace(
                        "http://165.22.223.28",
                        baseURL
                    )}" alt="comic image" /><h2 class="title">${episode.episode_number}</h2></a>`;
                });

                document.getElementById("comic_name").innerText = comic.comic_title;
                document.getElementById("all_episodes").innerHTML = episodeHTML;
            } else if (!obj.success) {
                showMsg(obj.error, true);
            } else {
                showMsg("COMIC EPISODES <br/><br/> Problem with api", true);
            }
        })
        .then(() => {
            if (!calledOnce) {
                hideLoader();
            }
        })
        .catch((err) => {
            showMsg("COMIC EPISODES <br/><br/>" + err, true);
        });
} else {
    showMsg("NO INTERNET <br/><br/> Please connect to internet first.", true);
}
