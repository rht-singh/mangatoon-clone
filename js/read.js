"use strict";

fetch(`http://165.22.223.28/api/manga/read_episode?id=${getParams("episode_id")}`)
    .then((data) => {
        return data.json();
    })
    .then((obj) => {
        if (obj.success) {
            const comic = obj.read_comic;
            document.getElementById("title").innerText = getParams("comic_name") + " - " + comic.episode_number;

            const comicPage = document.getElementById("comic-page");
            const comicImages = comic.comic_images;
            const totalPages = comic.comic_images.length;
            document.getElementById("total-pages").innerText = totalPages;

            let page = 1;
            comicPage.src = placeholderPageImage;

            // loadPageImage("comic-page", placeholderTestImage);
            loadPageImage("comic-page", comicImages[page - 1].img_url.replace("https", "http"));

            function next() {
                page++;
                comicPage.src = placeholderPageImage;

                // loadPageImage("comic-page", placeholderTestImage);
                loadPageImage("comic-page", comicImages[page - 1].img_url.replace("https", "http"));

                document.getElementById("current-page").innerText = page;
                document.getElementById("next").focus();
            }
            function prev() {
                page--;
                comicPage.src = placeholderPageImage;

                // loadPageImage("comic-page", placeholderTestImage);
                loadPageImage("comic-page", comicImages[page - 1].img_url.replace("https", "http"));

                document.getElementById("current-page").innerText = page;
                document.getElementById("previous").focus();
            }

            document.addEventListener("keydown", (e) => {
                if (e.key == "ArrowRight") {
                    if (page < totalPages) {
                        next();
                    } else {
                        showMsg("This is the last page!", false);
                    }
                } else if (e.key == "ArrowLeft") {
                    if (page > 1) {
                        prev();
                    } else {
                        showMsg("This is the first page!", false);
                    }
                } else if (e.key == "SoftLeft" || e.key == "5") {
                    search();
                } else if (e.key == "SoftRight" || e.key == "0") {
                    window.history.back();
                }
            });
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
