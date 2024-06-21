import attractionModel from "../models/attraction.js";
import indexView from "../views/index.js";
import mrtModel from "../models/mrt.js";
import userModel from "../models/user.js";
import * as auth from "../controllers/user.js";

function scrollContent(name, direction) {
    const content = document.querySelector(name);
    let movement = content.offsetWidth * 0.8;
    if (direction === "left") {
        movement *= -1;
    }
    content.scrollBy({left: movement, behavior: "smooth"});
}

let keyword = "";
function searchByKeyword() {
    let keywordInput = document.querySelector("#keyword").value;
    if (!keywordInput) return;
    nextPage = 0;
    document.querySelector(".attraction").innerHTML = "";
    keyword = keywordInput;
    loadAttraction(keyword);
}

let nextPage = 0;
let requestInProgress = false;
async function loadAttraction(keyword) {
    if (requestInProgress) return;
    requestInProgress = true;
    if (nextPage === null) {return requestInProgress = false;}
    let result = await attractionModel.fetchAllAttractions(nextPage, keyword);
    indexView.renderAllAttractions(result.data, toAttractionPage);
    nextPage = result.nextPage;
    requestInProgress = false;
}

function toAttractionPage(e) {
    const attractionId = e.currentTarget.id.split("-")[1];
    window.location.href = "/attraction/" + attractionId;
}

async function loadMrt() {
    let mrts = await mrtModel.fetchAllMRT();
    indexView.renderAllMRT(mrts, searchByKeyword);
}

async function updateSignLink() {
    let user = userModel.fetchAuthUser();
    if (user) {
        document.querySelector("#signin-link").style.display = "none";
        document.querySelector("#signout-link").style.display = "block";
    } else {
        document.querySelector("#signin-link").style.display = "block";
        document.querySelector("#signout-link").style.display = "none";
    }
}

window.addEventListener("DOMContentLoaded", () => {
    updateSignLink();
});

window.addEventListener("load", async function() {
    loadMrt();
    loadAttraction(keyword);
    auth.updateSignLink();
});

window.addEventListener("scroll", async function() {
    const footer = document.querySelector(".footer");
    const rect = footer.getBoundingClientRect()
    if (rect.top <= window.innerHeight - 50) {
        loadAttraction(keyword);
    }
});

document.querySelector(".header__search-btn").addEventListener("click", searchByKeyword);

document.querySelector(".mrt-bar__btn[name='left']").addEventListener("click", () => {
    scrollContent(".mrt-bar__list", "left");
});

document.querySelector(".mrt-bar__btn[name='right']").addEventListener("click", () => {
    scrollContent(".mrt-bar__list", "right");
});

document.querySelector(".nav__title").addEventListener("click", () => {
    window.location.reload();
});
