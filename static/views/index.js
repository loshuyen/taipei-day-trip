let indexView = {
    renderAllAttractions: function(attractionData, toAttractionPage) {
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
            item.id = "attraction-" + data.id;
            item.className = "attraction__item";
            imgDiv.className = "attraction__img";
            img.src = data.images[0] || "../../static/images/default_img.png";
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
            item.onclick = toAttractionPage;
        }
    },
    renderAllMRT: function(mrts, handleClick) {
        const mrtListElement = document.querySelector(".mrt-bar__list");
        for (let mrt of mrts) {
            const item = document.createElement("div");
            item.className = "mrt-bar__item";
            item.textContent = mrt;
            item.addEventListener("click", (e) => {
                const mrtName = e.target.textContent;
                document.querySelector("#keyword").value = mrtName;
                handleClick();
            })
            mrtListElement.appendChild(item);
        }
    },
};

export default indexView;