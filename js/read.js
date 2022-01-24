"use strict";

fetch(`http://165.22.223.28/api/manga/read_episode?id=${getParams("episode_id")}`)
    .then((data) => {
        return data.json();
    })
    .then((obj) => {
        if (obj.success) {
            const comic = obj.read_comic;
            const comicPageLoader = document.querySelector(".comic-page-loader");
            document.getElementById("title").innerText = getParams("comic_name") + " - " + comic.episode_number;

            const comicImages = comic.comic_images;
            const totalPages = comic.comic_images.length;
            const comicPage = document.getElementById("comic-page");
            document.getElementById("total-pages").innerText = totalPages;

            let url = "";
            let page = 1;

            url = comicImages[page - 1]?.img_url.replace("https", "http");
            comicPage.src = url || "images/214x333.png";
            comicPage.onload = () => {
                comicPageLoader.style.display = "none";
            };

            // next page
            function next() {
                page++;
                url = comicImages[page - 1].img_url.replace("https", "http");
                comicPage.src = url;
                comicPage.onload = () => {
                    comicPageLoader.style.display = "none";
                };

                document.getElementById("current-page").innerText = page;
                document.getElementById("next").focus();
            }

            // previous page
            function prev() {
                page--;
                url = comicImages[page - 1].img_url.replace("https", "http");
                comicPage.src = url;
                comicPage.onload = () => {
                    comicPageLoader.style.display = "none";
                };

                document.getElementById("current-page").innerText = page;
                document.getElementById("previous").focus();
            }

            document.addEventListener("keydown", (e) => {
                if (e.key == "ArrowRight") {
                    if (page < totalPages) {
                        comicPageLoader.style.display = "block";
                        next();
                    } else {
                        showMsg("This is the last page!", false);
                    }
                } else if (e.key == "ArrowLeft") {
                    if (page > 1) {
                        comicPageLoader.style.display = "block";
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
            showMsg("READ COMIC <br/><br/> Problem with api", true);
        }
    })
    .then(() => {
        if (!calledOnce) {
            hideLoader();
        }
    })
    .catch((err) => {
        showMsg("READ COMIC <br/><br/>" + err, true);
    });
