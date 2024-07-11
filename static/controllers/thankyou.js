import userModel from "../models/user.js";
import * as auth from "../controllers/user.js";
import orderModel from "../models/order.js";
import orderView from "../views/order.js";

let url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let orderNumber = params.get("number");

window.addEventListener("DOMContentLoaded", async function() {
    let user = await userModel.fetchAuthUser();
    let data = await orderModel.fetchOrderByNumber(orderNumber);
    if (!user || !data) {
        window.location.href = "/";
        return;
    }
    document.querySelector("#signin-link").style.display = "none";
    document.querySelector("#signout-link").style.display = "block";
    document.querySelector(".booking-greeting span").textContent = `${user.name}，您的訂單資訊如下：`;
    orderView.renderOrder(data);

    document.querySelector(".thankyou__show-more").addEventListener("click", function(event) {
        let value = event.currentTarget.textContent;
        let container = document.querySelector(".thankyou");
        if (value === "顯示更多 ▼") {
            container.style.height = "230px";
            event.currentTarget.textContent = "顯示更少 ▲";
            event.currentTarget.style.top = "174px";
            return;
        }
        container.style.height = "80px";
        event.currentTarget.textContent = "顯示更多 ▼";
        event.currentTarget.style.top = "40px";
    });
});
