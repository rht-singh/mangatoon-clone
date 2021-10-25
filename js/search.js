"use strict";

const keyword = getParams("keyword");

if (keyword == "all") {
    fetch(`http://165.22.223.28/api/manga/comic_info`)
        .then((data) => {
            return data.json();
        })
        .then((obj) => {
            if (obj.success) {
                let comicHTML = "";
                const comics = obj.data;
                comics.forEach((comic) => {
                    comicHTML += `<a href="comic.html?comic_id=${
                        comic.comic_id
                    }" class="card"><img class="image" src="${placeholderImage}" alt="comic image" data-src="${
                        comic.title_img.replace("https", "http") /* placeholderTestImage*/
                    }"/><h2 class="title">${comic.comic_title}</h2></a>`;
                });
                document.getElementById("search_result").innerHTML = comicHTML;
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
} else {
    fetch(`http://165.22.223.28/api/manga/search?search=${keyword}`)
        .then((data) => {
            return data.json();
        })
        .then((obj) => {
            if (obj.success) {
                let comicHTML = "";
                const comics = obj.data;
                comics.forEach((comic) => {
                    comicHTML += `<a href="comic.html?comic_id=${
                        comic.comic_id
                    }" class="card"><img class="image" src="${placeholderImage}" alt="comic image" data-src="${
                        comic.title_img.replace("https", "http") /* placeholderTestImage*/
                    }" /><h2 class="title">${comic.comic_title}</h2></a>`;
                });
                document.getElementById("search_result").innerHTML = comicHTML;
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
}

// search button
const searchInput = document.getElementById("search-input");
let notFocus = searchInput.blur() ? true : false;
