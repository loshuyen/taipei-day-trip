import bookingModel from "../models/booking.js";
import bookingView from "../views/booking.js";
import userModel from "../models/user.js";
import * as auth from "../controllers/user.js";

document.querySelector("#booking-card-number").addEventListener("input", function(event) {
    let input = event.target.value.replace(/\D/g, "").substring(0,16);
    let formattedInput = input.match(/.{1,4}/g);
    if (formattedInput) {
        event.target.value = formattedInput.join(" ");
    }
});

document.querySelector("#booking-card-exp-date").addEventListener("input", function(event) {
    let input = event.target.value.replace(/\D/g, "").substring(0,4);
    let formattedInput = input.match(/.{1,2}/g);
    if (formattedInput) {
        event.target.value = formattedInput.join("/");
    }
});

document.querySelector(".nav__title").addEventListener("click", function() {
    window.location.href = "/";
});

window.addEventListener("DOMContentLoaded", async function() {
    let user = await userModel.fetchAuthUser();
    if (!user) {
        window.location.href = "/";
        return;
    }
    auth.updateSignLink();
    let bookingInfo = await bookingModel.fetchUnpaidBooking();
    bookingView.renderBooking(user.name, user.email, bookingInfo);
});

