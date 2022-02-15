"use strict";

if (navigator.onLine) {
    fetch(`${baseURL}/api/manga/get_comic?comic_id=${getParams("comic_id")}`)
        .then((data) => {
            return data.json();
        })
        .then((obj) => {
            if (obj.success) {
                const comic = obj.comic_info;
                const comicImage = document.getElementById("comic_image");
                comicImage.src = comic.title_img.replace("http://165.22.223.28", baseURL);

                document.getElementById("comic_name").innerText = comic.comic_title;
                document.getElementById("comic_publisher").innerText = comic.publisher;
                document.getElementById("comic_episodes").innerText = comic.total_episode;
                document.getElementById("comic_language").innerText = comic.language;
                document.getElementById("description").innerHTML =
                    comic.comic_description +
                    `<a href="episodes.html?comic_id=${comic.comic_id}" id="read-now">READ NOW</a>`;
            } else if (!obj.success) {
                showMsg(obj.error, true);
            } else {
                showMsg("COMIC OVERVIEW <br/><br/> Problem with api", true);
            }
        })
        .then(() => {
            if (!calledOnce) {
                hideLoader();
            }
        })
        .catch((err) => {
            showMsg("COMIC OVERVIEW <br/><br/>" + err, true);
        });
} else {
    showMsg("NO INTERNET <br/><br/> Please connect to internet first.", true);
}
