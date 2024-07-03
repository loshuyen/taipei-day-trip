import bookingModel from "../models/booking.js";
import bookingView from "../views/booking.js";
import userModel from "../models/user.js";
import * as auth from "../controllers/user.js";

document.querySelector(".nav__title").addEventListener("click", function() {
    window.location.href = "/";
});

window.addEventListener("DOMContentLoaded", async function() {
    let user = await userModel.fetchAuthUser();
    if (!user) {
        window.location.href = "/";
        return;
    }
    document.querySelector("#signin-link").style.display = "none";
    document.querySelector("#signout-link").style.display = "block";
    let bookingInfo = await bookingModel.fetchUnpaidBooking();
    bookingView.renderBooking(user.name, user.email, bookingInfo);
});

