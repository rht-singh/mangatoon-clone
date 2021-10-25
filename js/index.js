"use strict";

if (getLocalStorageItem("comic_token")) {
    userInfo(getLocalStorageItem("comic_token"));
} else {
    getIpAndRegister();
    showMsg("Welcome to Comic!", false);
}

//  get user ip address
function getIpAndRegister() {
    fetch("https://api.ipify.org?format=json")
        .then((data) => {
            return data.json();
        })
        .then(({ ip }) => {
            register(ip);
        })
        .catch((err) => {
            showMsg("GET IP ADDRESS <br/><br/>" + err, true);
        });
}

// register
function register(ip) {
    fetch("http://165.22.223.28/api/manga/register", {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
            ip_address: ip,
            device: navigator.userAgent,
        }),
    })
        .then((data) => {
            return data.json();
        })
        .then((obj) => {
            if (obj.status == "success") {
                const token = obj["created_data"].token;
                setLocalStorageItem("comic_token", token);
                userInfo(token);
            } else if (obj.status == "fail") {
                const msg = obj["Error"]["errors"][0].message;
                showMsg("REGISTRATION <br/><br/>" + msg, true);
            } else {
                showMsg("REGISTRATION <br/><br/> Problem with api", false);
            }
        })
        .catch((err) => {
            showMsg("REGISTRATION <br/><br/>" + err, true);
        });
}

// get user info
function userInfo(token) {
    fetch(`http://165.22.223.28/api/manga/user_info?token=${token}`)
        .then((data) => {
            return data.json();
        })
        .then((obj) => {
            if (obj.status == "success") {
                showAppUI();
            } else if (obj.status == "fail") {
                const msg = obj["Error"]["errors"][0].message;
                showMsg("GET USERINFO <br/><br/>" + msg, true);
            } else {
                showMsg("GET USERINFO <br/><br/> Problem with api", false);
            }
        })
        .catch((err) => {
            showMsg("GET USERINFO <br/><br/>" + err, true);
        });
}

// get all category
function getCategory() {
    fetch(`http://165.22.223.28/api/manga/get_category`)
        .then((data) => {
            return data.json();
        })
        .then((obj) => {
            if (obj.success) {
                let categoryHTML = "";
                obj.categories.forEach((category) => {
                    categoryHTML += `<a href="search.html?keyword=${category}">${category}</a>`;
                });
                document.getElementById("publisher").innerHTML = categoryHTML;
            } else if (!obj.success) {
                showMsg("GET CATEGORY <br/><br/>" + obj.error, true);
            } else {
                showMsg("GET CATEGORY <br/><br/> Problem with api", false);
            }
        })
        .catch((err) => {
            showMsg("GET CATEGORY <br/><br/>" + err, true);
        });
}

// search button
const searchInput = document.getElementById("search-input");
let notFocus = searchInput.blur() ? true : false;

// show ui
function showAppUI() {
    getComicsByType("new");
    getComicsByType("top");
}
