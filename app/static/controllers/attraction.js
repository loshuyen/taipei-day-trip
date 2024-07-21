import attractionModel from "../models/attraction.js";
import attractionView from "../views/attraction.js";
import {updateSignLink, addSignEvents} from "../controllers/user.js";
import BookingModel from "../models/booking.js";

let slideIndex = 1;
function showImage(n) {
    const images = document.querySelectorAll(".attraction-detail__img");
    const dots = document.querySelectorAll(".attraction-detail__dot");
    if(dots.length === 0) {
        const btns = document.querySelectorAll(".attraction-detail__btn");
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
    const n = Number(this.name);
    slideIndex = n;
    showImage(slideIndex);
}

function isAfterToday(dateString) {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
}

let user;
const dateHint = document.querySelector(".attraction-detail__booking-date span");
window.addEventListener("DOMContentLoaded", async () => {
    user = await updateSignLink();
    addSignEvents();
    document.querySelector(".attraction-detail__booking-btn").addEventListener("click", async function() {
        if (!user) {
            document.querySelector("#signin-link").click();
            return;
        }
        const attractionId = window.location.pathname.split("/")[2];
        const date = document.querySelector("#booking-date").value;
        const periods = document.getElementsByName("booking-period");
        let time;
        for (let period of periods) {
            if (period.checked) {
                time = period.value;
                break;
            }
        }
        const price = document.querySelector(".attraction-detail__booking-fee").textContent.split(" ")[1];
        
        if (!date) {
            dateHint.textContent = "日期不能為空白";
            return;
        }
        if (!isAfterToday(date)) {
            dateHint.textContent = "僅提供明天之後的預約";
            return;
        }
        const bookingInfo = {attractionId, date, time, price};
        const isCreateSuccess = await BookingModel.fetchCreateBooking(bookingInfo);
        if (isCreateSuccess) {
            window.location.href = "/booking";
        }
    });
    
    document.querySelector(".attraction-detail__booking-date label").addEventListener("click", function() {
        dateHint.textContent = "";
    });

    document.querySelector(".attraction-detail__btn[name='left']").addEventListener("click", () => {
        nextImage(-1);
    });
    
    document.querySelector(".attraction-detail__btn[name='right']").addEventListener("click", () => {
        nextImage(1);
    });
    
    document.querySelector(".attraction-detail__booking-period").addEventListener("change", (event) => {
        const value = event.target.value;
        attractionView.renderBookingFee(value);
    });
    
    document.querySelector(".nav__title").addEventListener("click", () => {
        window.location.href = "/";
    });
});

window.addEventListener("load", async() => {
    let path = window.location.pathname;
    let attractionId = path.split("/")[2];
    let data = await attractionModel.fetchAttractionById(attractionId);
    attractionView.renderSlideshow(data, showImageByDot);
    showImage(slideIndex);
});

