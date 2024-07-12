import userModel from "../models/user.js";
import userView from "../views/user.js";

const signinBox = document.querySelector("#signin-box");
const signupBox = document.querySelector("#signup-box");
const mask = document.querySelector(".fullScreenMask");
const signUpMessage = document.querySelector("#signup-message");
const signInMessage = document.querySelector("#signin-message");
const signInput = document.querySelectorAll(".sign__input");
const signPasswordCheck = document.querySelector("#sign__input-password-check");
const signEmailCheck = document.querySelector("#sign__input-email-check");
const signUpNameCheck = document.querySelector("#signup-name-check");
const signUpEmailCheck = document.querySelector("#signup-email-check");
const signUpPasswordCheck = document.querySelector("#signup-password-check");
const signInLink = document.querySelector("#signin-link");
const signOutLink = document.querySelector("#signout-link");
const signInBtn = document.querySelector("#signin-btn");
const signUpBtn = document.querySelector("#signup-btn");
const memberLink = document.querySelector(".nav__member");
const memberMenu = document.querySelector(".nav__menu");

function closeSignBox() {
    signUpMessage.innerHTML = "";
    signInMessage.innerHTML = "";
    signInput.forEach((element) => {
        element.value = "";
    });
    let signs = document.querySelectorAll(".sign");
    for(let sign of signs) {
        sign.style.display = "none";
    }
    mask.style.display = "none";
    document.body.style.overflow = '';
    signPasswordCheck.style.display = "none";
    signEmailCheck.style.display = "none";
    signUpNameCheck.style.display = "none";
    signUpEmailCheck.style.display = "none";
    signUpPasswordCheck.style.display = "none";
}

function openSigninBox() {
    signUpMessage.innerHTML = "";
    signInMessage.innerHTML = "";
    signinBox.style.display = "block";
    signupBox.style.display = "none";
    mask.style.display = "block";
    document.body.style.overflow = 'hidden';
}

function openSignupBox() {
    signUpMessage.innerHTML = "";
    signInMessage.innerHTML = "";
    signinBox.style.display = "none";
    signupBox.style.display = "block";
    mask.style.display = "block";
    document.body.style.overflow = 'hidden';
}

export async function updateSignLink() {
    let user = await userModel.fetchAuthUser();
    if (user) {
        signInLink.style.display = "none";
        memberLink.style.display = "block";
    } else {
        signInLink.style.display = "block";
        memberLink.style.display = "none";
    }
    return user;
}

async function signIn() {
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
        // window.location.reload();
    } else if (response.status === 422) {
        userView.renderMessage("Email格式錯誤", "signin-message");
    } else {
        userView.renderMessage(data.message, "signin-message");
    }
    if (lookupBookingBtnPressed) {
        lookupBookingBtnPressed = false;
        window.location.href = "/booking";
    } else {
        window.location.reload();
    }
}

async function signUp() {
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
        signInput.forEach((element) => {
            element.value = "";
        });
    } else if (response.status === 422) {
        userView.renderMessage("Email格式錯誤", "signup-message");
    } else {
        userView.renderMessage(data.message, "signup-message");
    }
}

function signOut() {
    localStorage.clear();
    window.location.reload();
}

function toggleMenu(event) {
    const menuDisplay = memberMenu.style.display;
    if (menuDisplay === "none" || menuDisplay === "") {
        triggerEvent(document, "open-menu", menuDisplay);
    } else {
        triggerEvent(document, "close-menu", menuDisplay);
    }
    event.stopPropagation();

}

function triggerEvent(element, eventType, eventDetail) {
    const event = new CustomEvent(eventType, {detail: eventDetail});
    element.dispatchEvent(event);
}

let lookupBookingBtnPressed = false;

export function addSignEvents() {
    document.querySelectorAll("#signin-link").forEach((element) => {
        element.addEventListener("click", openSigninBox)
    });
    
    document.querySelector("#signup-link").addEventListener("click", openSignupBox);
    
    signInBtn.addEventListener("click", signIn);
    
    signOutLink.addEventListener("click", signOut);
    
    signUpBtn.addEventListener("click", signUp);

    memberLink.addEventListener("click", toggleMenu);

    document.querySelectorAll(".sign__close-btn").forEach((element) => {
        element.addEventListener("click", closeSignBox);
    });
    
    mask.addEventListener("click", closeSignBox);
    
    document.querySelector(".sign__input[name='email']").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            signInBtn.click();
        }
    });
    
    document.querySelector(".sign__input[name='password']").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            signInBtn.click();
        }
    });
    
    document.querySelector(".sign__input[name='signup-name']").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            signUpBtn.click();
        }
    });
    
    document.querySelector(".sign__input[name='signup-email']").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            signUpBtn.click();
        }
    });
    
    document.querySelector(".sign__input[name='signup-password']").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            signUpBtn.click();
        }
    });
    
    document.querySelector("#nav-booking-btn").addEventListener("click", async function() {
        let user = await userModel.fetchAuthUser();
        lookupBookingBtnPressed = lookupBookingBtnPressed ? false : true;
        if (!user) {
            signInLink.click();
            return;
        }
        window.location.href = "/booking";
    });

    document.querySelector(".nav__title").addEventListener("click", function() {
        window.location.href = "/";
    });

    document.querySelector("#sign__input-email").addEventListener("input", function(event) {
        let input = event.currentTarget.value;
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
            signEmailCheck.style.display = "block";
        } else {
            signEmailCheck.style.display = "none";
        }
    });

    document.querySelector("#sign__input-password").addEventListener("input", function(event) {
        let input = event.currentTarget.value;
        if (input !== "") {
            signPasswordCheck.style.display = "block";
        } else {
            signPasswordCheck.style.display = "none";
        }
    });

    document.querySelector("#signup-name").addEventListener("input", function(event) {
        let input = event.currentTarget.value;
        if (input !== "") {
            signUpNameCheck.style.display = "block";
        } else {
            signUpNameCheck.style.display = "none";
        }
    });

    document.querySelector("#signup-email").addEventListener("input", function(event) {
        let input = event.currentTarget.value;
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
            signUpEmailCheck.style.display = "block";
        } else {
            signUpEmailCheck.style.display = "none";
        }
    });

    document.querySelector("#signup-password").addEventListener("input", function(event) {
        let input = event.currentTarget.value;
        if (input !== "") {
            signUpPasswordCheck.style.display = "block";
        } else {
            signUpPasswordCheck.style.display = "none";
        }
    });

    document.addEventListener("open-menu", function() {
        memberMenu.style.display = "block";
    });

    document.addEventListener("close-menu", function() {
        memberMenu.style.display = "none";
    });

    document.addEventListener("click", function(event) {
        event.stopPropagation();
        const menuDisplay = memberMenu.style.display;
        if (menuDisplay === "block") {
            triggerEvent(document, "close-menu", menuDisplay);
        }
    });

    document.querySelector("#member-record").addEventListener("click", function() {
        window.location.href = "/record";
    });

    document.querySelector("#member-profile").addEventListener("click", function() {
        window.location.href = "/profile";
    });
}
