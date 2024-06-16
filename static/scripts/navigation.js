
const signinBox = document.querySelector("#signin-box");
const registerBox = document.querySelector("#register-box");
const mask = document.querySelector(".fullScreenMask");

function closeSignBox() {
    const signs = document.querySelectorAll(".sign");
    for(let sign of signs) {
        sign.style.display = "none";
    }
    mask.style.display = "none";
    document.body.style.overflow = '';
}

function openSigninBox() {
    signinBox.style.display = "block";
    registerBox.style.display = "none";
    mask.style.display = "block";
    document.body.style.overflow = 'hidden';
}

function openRegisterBox() {
    signinBox.style.display = "none";
    registerBox.style.display = "block";
    mask.style.display = "block";
    document.body.style.overflow = 'hidden';
}

document.querySelector("#signin-link").addEventListener("click", openSigninBox);
