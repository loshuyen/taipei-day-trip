import bookingModel from "../models/booking.js";
import bookingView from "../views/booking.js";
import {addSignEvents} from "../controllers/user.js";
import orderSubmit from "../controllers/order.js";
import { updateSignLink } from "../controllers/user.js";

let user;
window.addEventListener("DOMContentLoaded", async function() {
    user = await updateSignLink();
    if (!user) {
        window.location.href = "/";
        return;
    }
    let unpaidBooking = await bookingModel.fetchUnpaidBooking();
    bookingView.renderBooking(user.name, user.email, unpaidBooking);

    addSignEvents();

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

    document.querySelector(".booking-total__submit-btn").addEventListener("click", function() {
        orderSubmit(unpaidBooking);
    });
});

