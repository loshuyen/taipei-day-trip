async function getAttractionInfo(attractionId) {
    const response = await fetch(`/api/attraction/${attractionId}`);
    const result = await response.json();
    if(response.status === 200) {
        return result.data;
    }
    return window.location.href = "/";
}

async function renderAttractionInfo(attractionId) {
    const data = await getAttractionInfo(attractionId);
    const slideShow = document.querySelector(".attraction-detail__slideshow");
    const dotBar = document.querySelector(".attraction-detail__dot-bar");
    if(data.images.length === 0) {
        const img = document.createElement("img");
        img.className = "attraction-detail__img";
        img.src = "../static/images/default_img.png";
        slideShow.appendChild(img);
    } else {
        let i = 1;
        for(let img_url of data.images) {
            const img = document.createElement("img");
            img.className = "attraction-detail__img";
            img.src = img_url;
            slideShow.appendChild(img);
            const dotButton = document.createElement("button");
            dotButton.className = "attraction-detail__dot";
            dotButton.name = i;
            dotButton.onclick = currentImage.bind(dotButton);
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
    return;
}   

let slideIndex = 1;
function showImage(n) {
    const images = document.querySelectorAll(".attraction-detail__img");
    const dots = document.querySelectorAll(".attraction-detail__dot");
    if(dots.length === 0) {
        const btns = document.querySelectorAll(".attraction-detail__btn");
        btns.forEach(btn => btn.style.display = "none");
        return;
    }
    if (n > images.length) {slideIndex = 1}
    if (n < 1) {slideIndex = images.length} ;
    for (let i = 0; i < images.length; i++) {
        images[i].style.display = "none";
        dots[i].style.backgroundColor = "#FFFFFF";
    }
    images[slideIndex-1].style.display = "block";
    dots[slideIndex-1].style.backgroundColor = "#000000";
    return;
}

function nextImage(n) {
    slideIndex += n;
    return showImage(slideIndex);
}

function currentImage() {
    let n = Number(this.name);
    slideIndex = n;
    return showImage(slideIndex);
}

async function fetchUser() {
    const data = await fetchWithToken("/api/user/auth").then(response=>response.json());
    const user = data.data;
    return user ? user : null;
}

async function updateSignLink() {
    const user = await fetchUser();
    if (user) {
        document.querySelector("#signin-link").style.display = "none";
        document.querySelector("#signout-link").style.display = "block";
    } else {
        document.querySelector("#signin-link").style.display = "block";
        document.querySelector("#signout-link").style.display = "none";
    }
}

async function fetchWithToken(url, options = {}) {
    const token = localStorage.getItem("token");
    options.headers = options.headers || {};
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(url, options);
    return response;
}

const periodOption = document.querySelector(".attraction-detail__booking-period");
periodOption.addEventListener("change", (event) => {
    const value = event.target.value;
    const fee = document.querySelector(".attraction-detail__booking-fee");
    if(value === "上半天") {
        return fee.textContent = "新台幣 2000 元";
    }
    else {
        return fee.textContent = "新台幣 2500 元";
    }
});

const title = document.querySelector(".nav__title");
title.addEventListener("click", () => {
    return window.location.href = "/";
})

window.addEventListener("DOMContentLoaded", () => {
    updateSignLink();
});

window.addEventListener("load", async() => {
    const path = window.location.pathname;
    const attractionId = path.split("/")[2];
    await renderAttractionInfo(attractionId);
    showImage(slideIndex);
    updateSignLink();
    return;
});