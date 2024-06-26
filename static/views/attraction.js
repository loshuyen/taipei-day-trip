let attractionView = {
    renderSlideshow: function(data, handleClick) {
        let slideShow = document.querySelector(".attraction-detail__slideshow");
        let dotBar = document.querySelector(".attraction-detail__dot-bar");
        if (data.images.length === 0) {
            let img = document.createElement("img");
            img.className = "attraction-detail__img";
            img.src = "../../static/images/default_img.png";
            slideShow.appendChild(img);
        } else {
            let i = 1;
            for (let img_url of data.images) {
                const img = document.createElement("img");
                img.className = "attraction-detail__img";
                img.src = img_url;
                slideShow.appendChild(img);
                const dotButton = document.createElement("button");
                dotButton.className = "attraction-detail__dot";
                dotButton.name = i;
                dotButton.onclick = handleClick;
                dotBar.appendChild(dotButton);
                i++;
            }
        }
        document.querySelector(".attraction-detail__name").textContent = data.name;
        document.querySelector(".attraction-detail__info").textContent = `${data.category} at ${data.mrt}`;
        document.querySelector(".attraction-information").innerHTML = `
            <div class="attraction-information__content">${data.description}</div>
            <div class="attraction-information__title">景點地址：</div>
            <div class="attraction-information__content">${data.address}</div>
            <div class="attraction-information__title">交通方式：</div>
            <div class="attraction-information__content">${data.transport}</div>
        `;
    },
    renderBookingFee: function(value) {
        let fee = document.querySelector(".attraction-detail__booking-fee");
        if(value === "上半天") {
            return fee.textContent = "新台幣 2000 元";
        }
        fee.textContent = "新台幣 2500 元";
    },
};

export default attractionView;