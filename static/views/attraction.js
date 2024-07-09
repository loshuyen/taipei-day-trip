import indexView from "./index.js";

let attractionView = {
    renderSlideshow: function(data, handleClick) {
        let slideShow = document.querySelector(".attraction-detail__slideshow");
        let dotBar = document.querySelector(".attraction-detail__dot-bar");
        let loadingIcon = indexView.createLoadingIconElement();
        if (data.images.length === 0) {
            let img = document.createElement("img");
            img.className = "attraction-detail__img";
            img.src = "../../static/images/default_img.png";
            img.display = "none";
            img.onload = function() {
                loadingIcon.style.display = "none";
                img.style.display = "block";
            };
            slideShow.appendChild(loadingIcon);
            slideShow.appendChild(img);
        } else {
            let i = 1;
            for (let img_url of data.images) {
                const img = document.createElement("img");
                img.className = "attraction-detail__img";
                img.src = img_url;
                if (i === 1) {
                    img.display = "none";
                    img.onload = function() {
                        loadingIcon.style.display = "none";
                        img.style.display = "block";
                    };
                    slideShow.appendChild(loadingIcon);
                }
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