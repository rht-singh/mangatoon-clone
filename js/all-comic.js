"use strict";

categoryCalled = true;
const comic_type = getParams("type");
const type = comic_type == "recent_comic" ? "new" : "top";

getComicsByType(type);

document.getElementById(comic_type).style.display = "grid";

document.getElementById("title").innerText = type + " comic";
document.querySelector("main").style.margin = "35px 0";
