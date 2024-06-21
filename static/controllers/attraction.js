import attractionModel from "../models/attraction.js";
import attractionView from "../views/attraction.js";
import * as auth from "../controllers/user.js";

let slideIndex = 1;
function showImage(n) {
    let images = document.querySelectorAll(".attraction-detail__img");
    let dots = document.querySelectorAll(".attraction-detail__dot");
    if(dots.length === 0) {
        let btns = document.querySelectorAll(".attraction-detail__btn");
        btns.forEach(btn => btn.style.display = "none");
        return;
    }
    if (n > images.length) {slideIndex = 1}
    if (n < 1) {slideIndex = images.length}
    for (let i = 0; i < images.length; i++) {
        images[i].style.display = "none";
        dots[i].style.backgroundColor = "#FFFFFF";
    }
    images[slideIndex-1].style.display = "block";
    dots[slideIndex-1].style.backgroundColor = "#000000";
}

function nextImage(n) {
    slideIndex += n;
    showImage(slideIndex);
}

function showImageByDot() {
    let n = Number(this.name);
    slideIndex = n;
    showImage(slideIndex);
}

document.querySelector(".attraction-detail__btn[name='left']").addEventListener("click", () => {
    nextImage(-1);
});

document.querySelector(".attraction-detail__btn[name='right']").addEventListener("click", () => {
    nextImage(1);
});

document.querySelector(".attraction-detail__booking-period").addEventListener("change", (event) => {
    let value = event.target.value;
    attractionView.renderBookingFee(value);
});

document.querySelector(".nav__title").addEventListener("click", () => {
    window.location.href = "/";
})

window.addEventListener("DOMContentLoaded", () => {
    auth.updateSignLink();
});

window.addEventListener("load", async() => {
    let path = window.location.pathname;
    let attractionId = path.split("/")[2];
    let data = await attractionModel.fetchAttractionById(attractionId);
    attractionView.renderSlideshow(data, showImageByDot);
    showImage(slideIndex);
    auth.updateSignLink();
});