function scrollContent(name, direction) {
    const content = document.querySelector(name);
    let movement = content.offsetWidth * 0.8;
    if (direction === "left") {
        movement *= -1;
    }
    content.scrollBy({left: movement, behavior: "smooth"});
    return;
}

let keyword = "";
function searchByKeyword() {
    let keywordInput = document.querySelector("#keyword").value;
    nextPage = 0;
    document.querySelector(".attraction").innerHTML = "";
    keyword = keywordInput;
    return renderAttraction(keyword);
}

let nextPage = 0;
let requestInProgress = false;
async function renderAttraction(keyword) {
    if (requestInProgress) {
        return;
    }
    requestInProgress = true;
    if (nextPage === null) {return requestInProgress = false;}
    const response = await fetch(`/api/attractions?page=${nextPage}&keyword=${keyword}`);
    const attractionsDataObject = await response.json();
    const attractionData = attractionsDataObject.data;
    const attraction = document.querySelector(".attraction");
    for (let data of attractionData) {
        const item = document.createElement("div");
        const imgDiv = document.createElement("div");
        const img = document.createElement("img");
        const name = document.createElement("div");
        const span = document.createElement("span");
        const info = document.createElement("div");
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        const a = document.createElement("a");
        item.id = "attraction-" + data.id;
        item.className = "attraction__item";
        imgDiv.className = "attraction__img";
        img.src = data.images[0] || "../static/images/default_img.png";
        name.className = "attraction__name";
        span.textContent = data.name;
        info.className = "attraction__info";
        p1.textContent = data.mrt;
        p2.textContent = data.category;
        attraction.appendChild(item);
        item.appendChild(imgDiv);
        imgDiv.appendChild(img);
        item.appendChild(name);
        name.appendChild(span);
        item.appendChild(info);
        info.appendChild(p1);
        info.appendChild(p2);
        item.onclick = getAttractionPage;
    }
    nextPage = attractionsDataObject.nextPage;
    return requestInProgress = false;
}

function getAttractionPage(e) {
    const attractionId = e.currentTarget.id.split("-")[1];
    return window.location.href = "/attraction/" + attractionId;
}

async function renderMrt() {
    const response = await fetch("/api/mrts").then(response => response.json());
    const mrts = response.data;
    const mrtListElement = document.querySelector(".mrt-bar__list");
    for (let mrt of mrts) {
        const item = document.createElement("div");
        item.className = "mrt-bar__item";
        item.textContent = mrt;
        item.addEventListener("click", (e) => {
            const mrtName = e.target.textContent;
            document.querySelector("#keyword").value = mrtName;
            return searchByKeyword();
        })
        mrtListElement.appendChild(item);
    }
    return;
}

window.addEventListener("load", async function() {
    renderMrt();
    renderAttraction(keyword);
    return;
});

window.addEventListener("scroll", async function() {
    const footer = document.querySelector(".footer");
    const rect = footer.getBoundingClientRect()
    if (rect.top <= window.innerHeight - 50) {
        renderAttraction(keyword);
        return;
    }
});
