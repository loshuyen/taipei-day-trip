let orderView = {
    renderOrder: function(data) {
        let content = document.querySelector(".thankyou-content");
        content.innerHTML = `
            <div class="thankyou-content__name">訂單編號 ${data.number}</div>
            <div class="thankyou-content__item">付款狀態：<span>已完成付款</span></div>
            <div class="thankyou-content__item">預定日期：<span>${data.trip.date}</span></div>
            <div class="thankyou-content__item">預定時間：<span>${data.trip.time}</span></div>
            <div class="thankyou-content__item">訂單費用：<span>新台幣 ${data.price} 元</span></div>
            <div class="thankyou-content__item">預定景點：<span>${data.trip.attraction.name}</span></div>
            <div class="thankyou__show-more">顯示更多 ▼</div>
        `;
    }
};

export default orderView;