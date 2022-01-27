"use strict";

let loading = true;
let zoomedIn = false;

if (navigator.onLine) {
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
                comicPage.src = "images/214x333.png";
                showComicPage(url, comicPage, comicPageLoader);

                // next page
                function next() {
                    if (navigator.onLine) {
                        page++;
                        url = comicImages[page - 1].img_url.replace("https", "http");
                        showComicPage(url, comicPage, comicPageLoader);

                        document.getElementById("current-page").innerText = page;
                        document.getElementById("next").focus();
                    } else {
                        showMsg("NO INTERNET <br/><br/> Please connect to internet first.", true);
                    }
                }

                // previous page
                function prev() {
                    if (navigator.onLine) {
                        page--;
                        url = comicImages[page - 1].img_url.replace("https", "http");
                        showComicPage(url, comicPage, comicPageLoader);

                        document.getElementById("current-page").innerText = page;
                        document.getElementById("previous").focus();
                    } else {
                        showMsg("NO INTERNET <br/><br/> Please connect to internet first.", true);
                    }
                }

                document.addEventListener("keydown", (e) => {
                    if (e.key == "ArrowRight") {
                        if (page < totalPages) {
                            if (!loading) {
                                comicPageLoader.classList.remove("hide");
                                comicPageLoader.classList.add("show");
                                next();
                                loading = true;
                            } else {
                                showMsg("Please wait, we are loading your requested page.", false);
                            }
                        } else {
                            showMsg("This is the last page!", false);
                        }

                        if (zoomedIn) {
                            imageZoomOut();
                            zoomedIn = false;
                        }
                    } else if (e.key == "ArrowLeft") {
                        if (page > 1) {
                            if (!loading) {
                                comicPageLoader.classList.remove("hide");
                                comicPageLoader.classList.add("show");
                                prev();
                                loading = true;
                            } else {
                                showMsg("Please wait, we are loading your requested page.", false);
                            }
                        } else {
                            showMsg("This is the first page!", false);
                        }

                        if (zoomedIn) {
                            imageZoomOut();
                            zoomedIn = false;
                        }
                    } else if (e.key == "SoftLeft" || e.key == "5") {
                        if (navigator.onLine) {
                            search();
                        } else {
                            showMsg("NO INTERNET <br/><br/> Please connect to internet first.", true);
                        }
                    } else if (e.key == "SoftRight" || e.key == "0") {
                        if (navigator.onLine) {
                            window.history.back();
                        } else {
                            showMsg("NO INTERNET <br/><br/> Please connect to internet first.", true);
                        }
                    } else if (e.key == "Enter") {
                        if (!zoomedIn && !loading) {
                            imageZoomIn("comic-page");
                            zoomedIn = true;
                        } else {
                            imageZoomOut();
                            zoomedIn = false;
                        }
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
} else {
    showMsg("NO INTERNET <br/><br/> Please connect to internet first.", true);
}

// load image and show
function showComicPage(url, comicPage, comicPageLoader) {
    imageLoadingStatus(url, "loaded")
        .then((image) => {
            comicPage.src = image;
            comicPage.onload = (e) => {
                comicPageLoader.classList.remove("show");
                comicPageLoader.classList.add("hide");
                document.getElementById("loaded").innerText = "0%";
                loading = false;
                e.key = 9;
                hideMsg(e);
            };
        })
        .catch(() => {
            comicPage.src = "images/not-found.png";
        });
}

function imageZoomIn(imgID) {
    var img, lens, zoomedImage, cx, cy;
    img = document.getElementById(imgID);
    // result = document.getElementById(resultID);
    /* Create lens: */
    lens = document.createElement("DIV");
    lens.setAttribute("class", "img-zoom-lens");
    zoomedImage = document.createElement("DIV");
    zoomedImage.setAttribute("class", "zoomed-image");
    /* Insert lens: */
    img.parentElement.insertBefore(lens, img);
    img.parentElement.insertBefore(zoomedImage, img);
    /* Calculate the ratio between result DIV and lens: */
    cx = 3;
    cy = 3;
    /* Set background properties for the result DIV */
    zoomedImage.style.backgroundImage = "url('" + img.src + "')";
    zoomedImage.style.backgroundSize = img.width * cx + "px " + img.height * cy + "px";
    /* Execute a function when someone moves the cursor over the image, or the lens: */
    // lens.addEventListener("mousemove", moveLens);
    /* And also for touch screens: */
    let dirX = 0;
    let dirY = 0;
    let steps = 1;

    document.addEventListener("keypress", (e) => {
        if (e.key == "4") {
            dirX -= steps;
            if (dirX < 0) {
                dirX = 0;
            }
        } else if (e.key == "6") {
            dirX += steps;
            if (dirX > img.width - lens.offsetWidth) {
                dirX = img.width - lens.offsetWidth;
            }
        } else if (e.key == "8") {
            dirY -= steps;
            if (dirY < 0) {
                dirY = 0;
            }
        } else if (e.key == "2") {
            dirY += steps;
            if (dirY > img.height - lens.offsetHeight) {
                dirY = img.height - lens.offsetHeight;
            }
        }
        moveLens(e);
    });

    function moveLens(e) {
        var pos, pos2, x, y, x2, y2;
        /* Prevent any other actions that may occur when moving over the image */
        e.preventDefault();
        /* Calculate the position of the lens: */
        x = dirX;
        y = dirY;

        /* Calculate the position of the lens: */
        x2 = 0;
        y2 = 0;
        /* Prevent the lens from being positioned outside the image: */
        if (x2 > img.width - zoomedImage.offsetWidth) {
            x2 = img.width - zoomedImage.offsetWidth;
        }
        if (x2 < 0) {
            x2 = 0;
        }
        if (y2 > img.height - zoomedImage.offsetHeight) {
            y2 = img.height - zoomedImage.offsetHeight;
        }

        if (y2 < 0) {
            y2 = 0;
        }
        /* Set the position of the lens: */
        lens.style.left = x + "px";
        lens.style.top = y + "px";
        /* Set the position of the zoomed image: */
        zoomedImage.style.left = x2 + "px";
        zoomedImage.style.top = y2 + "px";
        /* Display what the lens "sees": */
        zoomedImage.style.backgroundPosition = "-" + x * (cx / 0.925) + "px -" + y * (cy / 1.28) + "px";
    }

    openFullscreen(zoomedImage);
}

function imageZoomOut() {
    if (zoomedIn) {
        closeFullscreen();
        document.querySelector(".img-zoom-lens").remove();
        document.querySelector(".zoomed-image").remove();
    }
}

/* View in fullscreen */
function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
    } else {
        showComicPage("Fullscreen API is not supported!", false);
    }
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
    } else {
        showComicPage("Fullscreen API is not supported!", false);
    }
}
