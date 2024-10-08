import bookingModel from "../models/booking.js";
import indexView from "./index.js";

let bookingView = {
    renderBooking: function(username, email, bookingInfo) {
        document.querySelector(".booking-greeting span").textContent = username;
        if (!bookingInfo) {
            document.querySelectorAll(".booking").forEach(function(element) {
                element.style.display = "none";
            });
            document.querySelector(".booking-total").style.display = "none";
            document.querySelectorAll(".booking__no-record").forEach(element => {
                element.style.display = "flex";
            });
            return;
        }
        let {attraction, date, time, price} = bookingInfo;
        time = "morning" ? "早上9點到下午4點" : "下午2點到晚上9點"
        document.querySelector(".booking__schedule").innerHTML = `
        <div class="booking__schedule__img-container">
            <img src=${attraction.image}>
        </div>
        <div class="booking-content">
        <div class="booking-content__name">${attraction.name}</div>
        <div class="booking-content__item">日期：<span>${date}</span></div>
        <div class="booking-content__item">時間：<span>${time}</span></div>
        <div class="booking-content__item">費用：<span>新台幣 ${price} 元</span></div>
        <div class="booking-content__item">地點：<span>${attraction.address}</span></div>
        <button class="booking-content__delete-btn">
          <img src="../static/images/icon/icon_delete.svg" >
        </button>
        </div>
        `;
        let imgContainer = document.querySelector(".booking__schedule__img-container");
        let loadingIcon = indexView.createLoadingIconElement();
        imgContainer.appendChild(loadingIcon);
        document.querySelector(".booking__schedule__img-container img").addEventListener("load", function(event) {
            loadingIcon.style.display = "none";
            event.currentTarget.style.display = "block";
        });
        document.querySelector(".booking-content__delete-btn").addEventListener("click", async function() {
            await bookingModel.fetchDeleteUnpaidBooking();
            window.location.reload();
        });
        document.querySelector("#booking-user-name").value = username;
        document.querySelector("#booking-user-email").value = email;
        document.querySelector(".booking-total__price").textContent = `總價：新台幣 ${price} 元`;
    }
}

export default bookingView;