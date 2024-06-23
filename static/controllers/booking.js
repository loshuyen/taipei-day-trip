document.querySelector("#booking-card-number").addEventListener("input", function(event) {
    let input = event.target.value.replace(/\D/g, "").substring(0,16);
    let formattedInput = input.match(/.{1,4}/g);
    if (formattedInput) {
        event.target.value = formattedInput.join(" ");
    }
});

document.querySelector("#booking-card-exp-date").addEventListener("input", function(event) {
    let input = event.target.value.replace(/\D/g, "").substring(0,4);
    let formattedInput = input.match(/.{1,2}/g);
    if (formattedInput) {
        event.target.value = formattedInput.join("/");
    }
});