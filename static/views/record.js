import bookingModel from "../models/booking.js";
import orderModel from "../models/order.js";

let recordView = {
    renderBookingRecord: async function() {
        const response = await bookingModel.fetchAllBookings();
        const bookings = response.data;
        const bookingRecord = document.querySelector(".record__booking");
        for (let booking of bookings) {
            const container = document.createElement("div");
            container.className = "record__container";
            container.innerHTML = `
            <div class="record__order-attraction">
                <a href="/attraction/${booking.attraction.id}">${booking.attraction.name}</a>
            </div>
            <div class="record__order-date">${booking.date}</div>
            <div class="record__order-status">${booking.time}</div>
            <div class="record__order-price">${booking.price}</div>
            <div class="record__order-status">
                ${booking.is_paid === 1 ? "付款完成" : "尚未付款"}
            </div>
            `
            bookingRecord.append(container);
        }
    },
    renderOrderRecord: async function() {
        const response = await orderModel.fetchAllOrders()
        const orders = response.data;
        const orderRecord = document.querySelector(".record__order");
        for (let order of orders) {
            const container = document.createElement("div");
            const detail = document.createElement("div");
            container.className = "record__container";
            container.innerHTML = `
                <div class="record__order-number">
                    <a href="#">${order.number}</a>
                </div>
                <div class="record__order-price">
                    ${order.price}
                </div>
                <div class="record__order-status">
                    ${order.status === 1 ? "付款成功" : "付款失敗"}
                </div>
                <div class="record__order-time">
                    ${order.created_time}
                </div>
            `
            detail.className = "record__detail";
            detail.id = `booking-id-${order.booking.id}}`;
            detail.innerHTML = `
                <div class="record__detail-content"><span>景點：</span>${order.booking.attraction.name}</div>
                <div class="record__detail-content"><span>地址：</span>${order.booking.attraction.address}</div>
                <div class="record__detail-content"><span>日期：</span>${order.booking.date}</div>
                <div class="record__detail-content"><span>時段：</span>${order.booking.time}</div>
                <div class="record__detail-content"><span>聯絡人：</span>${order.contact.name}</div>
                <div class="record__detail-content"><span>Email：</span>${order.contact.email}</div>
                <div class="record__detail-content"><span>聯絡電話：</span>${order.contact.phone}</div>
            `;
            orderRecord.append(container);
            orderRecord.append(detail);
        }
        return orders;
    }
};

export default recordView;