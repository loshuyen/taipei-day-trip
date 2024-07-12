import {addSignEvents} from "../controllers/user.js";
import orderModel from "../models/order.js";
import orderView from "../views/order.js";
import { updateSignLink } from "../controllers/user.js";

let url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
let orderNumber = params.get("number");
let user;

window.addEventListener("DOMContentLoaded", async function() {
    user = await updateSignLink();
    let data = await orderModel.fetchOrderByNumber(orderNumber);
    if (!user || !data) {
        window.location.href = "/";
        return;
    }

    document.querySelector(".booking-greeting span").textContent = `${user.name}，您的訂單資訊如下：`;
    orderView.renderOrder(data);

    addSignEvents();

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
