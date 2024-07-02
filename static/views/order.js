let orderView = {
    renderOrder: function(data) {
        let content = document.querySelector(".booking-content");
        content.innerHTML = `
            <div class="booking-content__name">訂單編號 ${data.number}</div>
            <div class="booking-content__item">日期：<span>${data.trip.date}</span></div>
            <div class="booking-content__item">時間：<span>${data.trip.time}</span></div>
            <div class="booking-content__item">費用：<span>新台幣 ${data.price} 元</span></div>
            <div class="booking-content__item">地點：<span>${data.trip.attraction.name}</span></div>
            <div class="booking-content__item">付款狀態：<span>已完成付款</span></div>
        `;
    }
};

export default orderView;