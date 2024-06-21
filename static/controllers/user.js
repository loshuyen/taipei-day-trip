import userModel from "../models/user.js";
import userView from "../views/user.js";

let signinBox = document.querySelector("#signin-box");
let signupBox = document.querySelector("#signup-box");
let mask = document.querySelector(".fullScreenMask");

export function closeSignBox() {
    document.querySelector("#signup-message").innerHTML = "";
    document.querySelector("#signin-message").innerHTML = "";
    document.querySelectorAll(".sign__input").forEach((element) => {
        element.value = "";
    });
    let signs = document.querySelectorAll(".sign");
    for(let sign of signs) {
        sign.style.display = "none";
    }
    mask.style.display = "none";
    document.body.style.overflow = '';
}

export function openSigninBox() {
    document.querySelector("#signup-message").innerHTML = "";
    document.querySelector("#signin-message").innerHTML = "";
    signinBox.style.display = "block";
    signupBox.style.display = "none";
    mask.style.display = "block";
    document.body.style.overflow = 'hidden';
}

function openSignupBox() {
    document.querySelector("#signup-message").innerHTML = "";
    document.querySelector("#signin-message").innerHTML = "";
    signinBox.style.display = "none";
    signupBox.style.display = "block";
    mask.style.display = "block";
    document.body.style.overflow = 'hidden';
}

export async function updateSignLink() {
    let user = await userModel.fetchAuthUser();
    if (user) {
        document.querySelector("#signin-link").style.display = "none";
        document.querySelector("#signout-link").style.display = "block";
    } else {
        document.querySelector("#signin-link").style.display = "block";
        document.querySelector("#signout-link").style.display = "none";
    }
}

export async function signIn() {
    let email = document.querySelector("input[name='email'].sign__input").value;
    let password = document.querySelector("input[name='password'].sign__input").value;
    let requestBody = {email: email, password: password};
    if (!email || !password) {
        userView.renderMessage("請輸入Email和密碼", "signin-message");
        return;
    }
    let response = await userModel.fetchToken(requestBody);
    let data = await response.json();
    if (response.status === 200) {
        localStorage.setItem("token", data.token);
        window.location.reload();
    } else if (response.status === 422) {
        userView.renderMessage("Email格式錯誤", "signin-message");
    } else {
        userView.renderMessage(data.message, "signin-message");
    }
}

export async function signUp() {
    let name = document.querySelector("input[name='signup-name'].sign__input").value;
    let email = document.querySelector("input[name='signup-email'].sign__input").value;
    let password = document.querySelector("input[name='signup-password'].sign__input").value;
    let requestBody = {name: name, email: email, password: password};
    if (!email || !password || !name) {
        userView.renderMessage("請輸入姓名、Email和密碼", "signup-message");
        return;
    }
    let response = await userModel.fetchSignUp(requestBody);
    let data = await response.json();
    if (response.status === 200) {
        userView.renderMessage("註冊成功", "signup-message", false);
        document.querySelectorAll(".sign__input").forEach((element) => {
            element.value = "";
        });
    } else if (response.status === 422) {
        userView.renderMessage("Email格式錯誤", "signup-message");
    } else {
        userView.renderMessage(data.message, "signup-message");
    }
}

export function signOut() {
    localStorage.clear();
    window.location.reload();
}

document.querySelectorAll("#signin-link").forEach((element) => {
    element.addEventListener("click", openSigninBox)
});
document.querySelector("#signup-link").addEventListener("click", openSignupBox);
document.querySelector("#signin-btn").addEventListener("click", signIn);
document.querySelector("#signout-link").addEventListener("click", signOut);
document.querySelector("#signup-btn").addEventListener("click", signUp);
document.querySelectorAll(".sign__close-btn").forEach((element) => {
    element.addEventListener("click", closeSignBox);
});
document.querySelector(".fullScreenMask").addEventListener("click", closeSignBox);

