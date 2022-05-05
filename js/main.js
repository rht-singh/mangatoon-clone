"use strict";

let calledOnce = false;
let categoryCalled = false;
const baseURL = "https://kaiostestapi.quadbtech.com";

// notification sound
const audio = new Audio("sounds/notification.mp3");
// current path
const path = location.pathname;

// alert box
const layer = document.getElementById("layer");
const msgBox = document.getElementById("msg-box");

// loader
function hideLoader() {
    const main = document.querySelector("main");
    const loader = document.getElementById("loader");

    loader.style.top = "100vh";

    if (navigator.onLine) {
        setTimeout(() => {
            main.style.opacity = "1";
        }, 1000);

        totalUsers();

        if (path !== "/read.html") {
            calledOnce = true;

            // handle keypress
            setTimeout(() => {
                handleKeyPressEvent();
            }, 1000);
        }
    } else {
        calledOnce = true;
        main.style.visibility = "hidden";
        showMsg(
            "NO INTERNET <br/><br/> Please connect to internet first.",
            true
        );
    }
}

function totalUsers() {
    fetch(`${baseURL}/api/manga/total_visitors`)
        .then((data) => {
            return data.json();
        })
        .then((obj) => {
            document.getElementById("users-count").innerText = obj.visitor;
        })
        .catch((err) => {
            showMsg("LOADING VISITIOR <br/><br/>" + err, true);
        });
}

// search
function search() {
    if (path == "/" || path == "/index.html" || path == "/search.html") {
        if (hasFocus) {
            hasFocus = false;
            searchInput.blur();

            // do search
            let keyword = searchInput.value;

            if (keyword == "") {
                showMsg("Please enter some keyword, it can't be empty!");
            } else {
                searchComic(keyword);
            }
        } else {
            // take input
            hasFocus = true;
            searchInput.focus();
            document.getElementById("search-instruction").style.display =
                "block";

            setTimeout(() => {
                searchInput.value = "";
            }, 1);
        }
    } else {
        location.href = `/search.html?keyword=all_comic`;
    }
}

// search comics
function searchComic(keyword) {
    fetch(`${baseURL}/api/manga/search?search=${keyword}`)
        .then((data) => {
            return data.json();
        })
        .then((obj) => {
            if (obj.success) {
                location.href = `/search.html?keyword=${keyword}`;
            } else if (!obj.success) {
                showMsg(obj.error, true);
            } else {
                showMsg("SEARCH COMIC <br/><br/> Problem with api", true);
            }
        })
        .catch((err) => {
            showMsg("SEARCH COMIC <br/><br/>" + err, true);
        });
}

// get all comics
function getAllComics(id) {
    fetch(`${baseURL}/api/manga/comic_info`)
        .then((data) => {
            return data.json();
        })
        .then((obj) => {
            if (obj.success) {
                let comicHTML = "";
                const comics =
                    path == "/" || path == "/index.html"
                        ? obj.data.slice(0, 4).reverse()
                        : obj.data;

                comics.forEach((comic) => {
                    comicHTML += `<a href="comic.html?comic_id=${
                        comic.comic_id
                    }" class="card"><img class="image" src="${comic.title_img.replace(
                        "http://165.22.223.28",
                        baseURL
                    )}" alt="comic image" /><h2 class="title">${
                        comic.comic_title
                    }</h2></a>`;
                });

                let eleId = path == "/search.html" ? "search_result" : id;
                document.getElementById(eleId).innerHTML = comicHTML;
            } else if (!obj.success) {
                showMsg(obj.error, true);
            } else {
                showMsg("ALL COMIC <br/><br/> Problem with api", true);
            }
        })
        .then(() => {
            if (!calledOnce) {
                hideLoader();
            }
        })
        .catch((err) => {
            showMsg("ALL COMIC <br/><br/>" + err, true);
        });
}

// get comics by type
function getComicsByType(comic_type) {
    const type = comic_type == "new" ? "recent_comic" : "top_ten_comic";

    fetch(`${baseURL}/api/manga/${type}`)
        .then((data) => {
            return data.json();
        })
        .then((obj) => {
            if (obj.success) {
                let comicHTML = "";

                const comics =
                    type == "recent_comic"
                        ? path == "/" || path == "/index.html"
                            ? obj.comic_data.slice(0, 2)
                            : obj.comic_data
                        : path == "/" || path == "/index.html"
                        ? obj.top_ten.slice(0, 2)
                        : obj.top_ten;

                comics.forEach((comic) => {
                    comicHTML += `<a href="comic.html?comic_id=${
                        comic.comic_id
                    }" class="card"><img class="image" src="${comic.title_img.replace(
                        "http://165.22.223.28",
                        baseURL
                    )}" alt="comic image" /><h2 class="title">${
                        comic.comic_title
                    }</h2></a>`;
                });
                document.getElementById(type).innerHTML = comicHTML;
            } else if (!obj.success) {
                showMsg(obj.error, true);
            } else {
                showMsg(
                    `GET COMICS BY TYPE: ${type} <br/><br/>` +
                        "Problem with api",
                    true
                );
            }
        })
        .then(() => {
            if (!categoryCalled) {
                getCategory();
                categoryCalled = true;
            } else if (!calledOnce) {
                hideLoader();
            }
        })
        .catch((err) => {
            showMsg(`GET COMICS BY TYPE: ${type} <br/><br/>` + err, true);
        });
}

// show message
function showMsg(message, alert) {
    const msg = document.getElementById("msg");
    const msgType = document.getElementById("msg-type");

    // msgType.innerText = alert ? "💥 New Alert!" : "🔔 New Message";
    // msg.innerHTML = message + "<br/><br/><span id='close-text'>( Press 9 to close )</span>";

    layer.style.top = "0";
    msgBox.style.transform = "translate(-50%, -50%) scale(1)";
    document.body.style.overflowY = "hidden";

    document.body.click();
    audio.play();

    if (alert && !calledOnce) {
        hideLoader();
    }

    document.addEventListener("keypress", hideMsg);
}

// hide message
// function hideMsg(e) {
//     if (e.key == 9) {
//         layer.style.top = "-100vh";
//         msgBox.style.transform = "translate(-50%, -50%) scale(0)";
//         document.body.style.overflowY = "scroll";

//         document.removeEventListener("keypress", hideMsg);
//     }
// }

// set localStorage
function setLocalStorageItem(name, value) {
    return localStorage.setItem(name, value);
}

// get localStorage
function getLocalStorageItem(name) {
    return localStorage.getItem(name);
}

// get params
function getParams(parma) {
    const search = new URLSearchParams(location.search);
    return search.get(parma);
}

function handleKeyPressEvent() {
    let currentButton = 0;
    const buttons = document.querySelectorAll("a");

    // add keydown event
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            // KaiOS
            case "SoftLeft":
                search();
                break;

            case "SoftRight":
                window.history.back();
                break;

            // desktop and KaiOS
            case "ArrowRight":
                if (currentButton < buttons.length) {
                    currentButton++;
                    buttons[currentButton - 1].focus();
                }
                break;

            case "ArrowLeft":
                if (currentButton > 1) {
                    currentButton--;
                    buttons[currentButton - 1].focus();
                }
                break;

            // desktop
            case "5":
                search();
                break;

            case "0":
                window.history.back();
                break;
        }
    });
}

function imageLoadingStatus(imageURL, elementId) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", imageURL);
        xhr.responseType = "arraybuffer";

        xhr.onprogress = function (e) {
            if (e.lengthComputable) {
                const loaded = Math.round((e.loaded / e.total) * 100) + "%";
                document.getElementById(elementId).innerText = loaded;
            }
        };

        xhr.onloadend = function () {
            const blob = new Blob([this.response]);
            resolve(window.URL.createObjectURL(blob));
        };

        xhr.onerror = function (e) {
            reject(e);
        };

        xhr.send();
    });
}
