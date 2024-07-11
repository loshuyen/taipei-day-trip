import bookingModel from "../models/booking.js";
import bookingView from "../views/booking.js";
import userModel from "../models/user.js";
import * as auth from "../controllers/user.js";
import config from "./config.js";


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

    document.querySelector("#booking-user-name").addEventListener("input", function(event) {
        let input = event.currentTarget.value;
        if (input === "") {
            document.querySelector("#booking-user-name-check").className = "booking-info__check--fail";
        } else {
            document.querySelector("#booking-user-name-check").className = "booking-info__check--ok";
        }
    });

    document.querySelector("#booking-user-email").addEventListener("input", function(event) {
        let input = event.currentTarget.value;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
            document.querySelector("#booking-user-email-check").className = "booking-info__check--fail";
        } else {
            document.querySelector("#booking-user-email-check").className = "booking-info__check--ok";
        }
    });

    document.querySelector("#booking-user-phoneNumber").addEventListener("input", function(event) {
        let phoneNumber = event.currentTarget.value;
        if (!/^09[0-9]{8}$/.test(phoneNumber)) {
            document.querySelector("#booking-user-phoneNumber-check").className = "booking-info__check--fail";
        } else {
            document.querySelector("#booking-user-phoneNumber-check").className = "booking-info__check--ok";
        }
    });

    
});

