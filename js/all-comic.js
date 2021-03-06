"use strict";

categoryCalled = true;

if (navigator.onLine) {
    const comic_type = getParams("type");

    if (comic_type == "all_comic") {
        getAllComics(comic_type);
        document.getElementById("title").innerText = "all comic";
    } else {
        const type = comic_type == "recent_comic" ? "new" : "top";
        getComicsByType(type);
        document.getElementById("title").innerText = type + " comic";
    }

    document.getElementById(comic_type).style.display = "grid";

    document.querySelector("main").style.margin = "35px 0";
} else {
    showMsg("NO INTERNET <br/><br/> Please connect to internet first.", true);
}
