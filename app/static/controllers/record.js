import {addSignEvents, updateSignLink} from "./user.js";
import recordView from "../views/record.js";

const booking = document.querySelector(".record__booking");
const order = document.querySelector(".record__order");
const bookingTab = document.querySelector("#booking-record");
const orderTab = document.querySelector("#order-record");

function toggleRecordTab() {
    if (this.style.borderBottom === "2px solid #448899") {
        return;
    }
    if (this === bookingTab) {
        booking.style.display = "block";
        order.style.display = "none";
        bookingTab.style.borderBottom = "2px solid #448899";
        orderTab.style.borderBottom = "2px solid #ffffff";
    } else {
        order.style.display = "block";
        booking.style.display = "none";
        orderTab.style.borderBottom = "2px solid #448899";
        bookingTab.style.borderBottom = "2px solid #ffffff";
    }
}

function showBookingDetail(e) {
    e.preventDefault();
    let targetElement = e.currentTarget.parentElement.parentElement.nextElementSibling;
    const display = targetElement.style.display;
    if (display === "" || display === "none") {
        targetElement.style.display = "block";
    } else {
        targetElement.style.display = "none";
    }
}

let user;
let orders;

window.addEventListener("DOMContentLoaded", async function() {
    user = await updateSignLink();
    if (!user) {
        window.location.href = "/";
        return;
    }
    addSignEvents();
    
    bookingTab.addEventListener("click", toggleRecordTab);

    orderTab.addEventListener("click", toggleRecordTab);

    recordView.renderBookingRecord();

    orders = await recordView.renderOrderRecord();

    document.querySelectorAll(".record__order-number a").forEach((element) => {
        element.addEventListener("click", showBookingDetail)
    })
});
