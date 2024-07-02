import userModel from "../models/user.js";
import * as auth from "../controllers/user.js";
import orderModel from "../models/order.js";
import orderView from "../views/order.js";

let url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let orderNumber = params.get("number");

document.querySelector(".nav__title").addEventListener("click", function() {
    window.location.href = "/";
});

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
});

