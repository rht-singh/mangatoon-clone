"use strict";

fetch(`http://165.22.223.28/api/manga/get_comic?comic_id=${getParams("comic_id")}`)
    .then((data) => {
        return data.json();
    })
    .then((obj) => {
        if (obj.success) {
            const comic = obj.comic_info;
            const comicImage = document.getElementById("comic_image");
            comicImage.src = placeholderImage;
            // comicImage.setAttribute("data-src", placeholderTestImage);
            comicImage.setAttribute("data-src", comic.title_img.replace("https", "http"));

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
            showMsg("Problem with api", false);
        }
    })
    .then(() => {
        hideLoader();
    })
    .catch((err) => {
        showMsg(err, true);
    });
