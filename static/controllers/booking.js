document.querySelector("#booking-card-number").addEventListener("keypress", (event) => {
    event.target.value = event.target.value.replace(/[^0-9]/gi, '').replace(/(.{4})/g, '$1 ').trim();
});