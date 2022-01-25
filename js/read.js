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
            comicPage.src = "images/214x333.png";
            showComicPage(url, comicPage, comicPageLoader);

            // next page
            function next() {
                page++;
                url = comicImages[page - 1].img_url.replace("https", "http");
                showComicPage(url, comicPage, comicPageLoader);

                document.getElementById("current-page").innerText = page;
                document.getElementById("next").focus();
            }

            // previous page
            function prev() {
                page--;
                url = comicImages[page - 1].img_url.replace("https", "http");
                showComicPage(url, comicPage, comicPageLoader);

                document.getElementById("current-page").innerText = page;
                document.getElementById("previous").focus();
            }

            let fullScreen = false;

            document.addEventListener("keydown", (e) => {
                if (e.key == "ArrowRight") {
                    if (page < totalPages) {
                        comicPageLoader.classList.remove("hide");
                        comicPageLoader.classList.add("show");
                        next();
                    } else {
                        showMsg("This is the last page!", false);
                    }

                    if (fullScreen) {
                        exitFullscreen();
                        fullScreen = false;
                    }
                } else if (e.key == "ArrowLeft") {
                    if (page > 1) {
                        comicPageLoader.classList.remove("hide");
                        comicPageLoader.classList.add("show");
                        prev();
                    } else {
                        showMsg("This is the first page!", false);
                    }

                    if (fullScreen) {
                        exitFullscreen();
                        fullScreen = false;
                    }
                } else if (e.key == "SoftLeft" || e.key == "5") {
                    search();
                } else if (e.key == "SoftRight" || e.key == "0") {
                    window.history.back();
                } else if (e.key == "Enter") {
                    imageZoom("comic-page");

                    // if (!fullScreen) {
                    //     requestFullscreen(comicPage);
                    //     fullScreen = true;
                    // } else {
                    //     exitFullscreen();
                    //     fullScreen = false;
                    // }
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

// load image and show
function showComicPage(url, comicPage, comicPageLoader) {
    imageLoadingStatus(url, "loaded")
        .then((image) => {
            comicPage.src = image;
            comicPage.onload = () => {
                comicPageLoader.classList.remove("show");
                comicPageLoader.classList.add("hide");
                document.getElementById("loaded").innerText = "0%";
            };
        })
        .catch(() => {
            comicPage.src = "images/not-found.png";
        });
}

var requestFullscreen = function (ele) {
    if (ele.requestFullscreen) {
        ele.requestFullscreen();
    } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen();
    } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
    } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
    } else {
        showMsg("Fullscreen API is not supported.", true);
    }
};

var exitFullscreen = function () {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else {
        showMsg("Fullscreen API is not supported.", true);
    }
};

function imageZoom(imgID) {
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
    cx = 2;
    cy = 2;
    /* Set background properties for the result DIV */
    zoomedImage.style.backgroundImage = "url('" + img.src + "')";
    zoomedImage.style.backgroundSize = img.width * cx + "px " + img.height * cy + "px";
    /* Execute a function when someone moves the cursor over the image, or the lens: */
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    /* And also for touch screens: */
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);
    function moveLens(e) {
        var pos, pos2, x, y, x2, y2;
        /* Prevent any other actions that may occur when moving over the image */
        e.preventDefault();
        /* Get the cursor's x and y positions: */
        pos = getCursorPos(e);
        /* Calculate the position of the lens: */
        x = pos.x - lens.offsetWidth / 2;
        y = pos.y - lens.offsetHeight / 2;
        /* Prevent the lens from being positioned outside the image: */
        if (x > img.width - lens.offsetWidth) {
            x = img.width - lens.offsetWidth;
        }
        if (x < 0) {
            x = 0;
        }
        if (y > img.height - lens.offsetHeight) {
            y = img.height - lens.offsetHeight;
        }
        if (y < 0) {
            y = 0;
        }

        pos2 = getCursorPos(e);
        /* Calculate the position of the lens: */
        x2 = pos2.x - zoomedImage.offsetWidth / 2;
        y2 = pos2.y - zoomedImage.offsetHeight / 2;
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
        zoomedImage.style.backgroundPosition = "-" + x * (cx / 1.375) + "px -" + y * cy + "px";
    }
    function getCursorPos(e) {
        var a,
            x = 0,
            y = 0;
        e = e || window.event;
        /* Get the x and y positions of the image: */
        a = img.getBoundingClientRect();
        /* Calculate the cursor's x and y coordinates, relative to the image: */
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /* Consider any page scrolling: */
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return { x: x, y: y };
    }
}
