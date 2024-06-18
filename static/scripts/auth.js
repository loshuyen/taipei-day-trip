
const signinBox = document.querySelector("#signin-box");
const signupBox = document.querySelector("#signup-box");
const mask = document.querySelector(".fullScreenMask");

function closeSignBox() {
    document.querySelector("#signup-message").innerHTML = "";
    document.querySelector("#signin-message").innerHTML = "";
    document.querySelectorAll(".sign__input").forEach((element) => {
        element.value = "";
    });
    const signs = document.querySelectorAll(".sign");
    for(let sign of signs) {
        sign.style.display = "none";
    }
    mask.style.display = "none";
    document.body.style.overflow = '';
}

function openSigninBox() {
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

async function signIn() {
    const messageContainer = document.querySelector("#signin-message");
    const email = document.querySelector("input[name='email'].sign__input").value;
    const password = document.querySelector("input[name='password'].sign__input").value;
    const messageElement = document.createElement("div");
    const requsestBody = {email: email, password: password};
    if (!email || !password) {
        messageContainer.innerHTML = "";
        messageElement.className = "sign__message--red";
        messageElement.textContent = "請輸入Email和密碼";
        messageContainer.appendChild(messageElement);
        return;
    }
    const response = await fetch("/api/user/auth", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(requsestBody)
      });
    if (response.status === 200) {
        data = await response.json();
        localStorage.setItem("token", data.token);
        window.location.reload();
    } else if (response.status === 422) {
        messageContainer.innerHTML = "";
        messageElement.className = "sign__message--red";
        messageElement.textContent = "Email格式錯誤";
        messageContainer.appendChild(messageElement);
    } else {
        data = await response.json();
        messageContainer.innerHTML = "";
        messageElement.className = "sign__message--red";
        messageElement.textContent = data.message;
        messageContainer.appendChild(messageElement);
    }
}

async function signUp() {
    const messageContainer = document.querySelector("#signup-message");
    const name = document.querySelector("input[name='signup-name'].sign__input").value;
    const email = document.querySelector("input[name='signup-email'].sign__input").value;
    const password = document.querySelector("input[name='signup-password'].sign__input").value;
    const messageElement = document.createElement("div");
    const requsestBody = {name: name, email: email, password: password};
    if (!email || !password || !name) {
        messageContainer.innerHTML = "";
        messageElement.className = "sign__message--red";
        messageElement.textContent = "請輸入姓名、Email和密碼";
        messageContainer.appendChild(messageElement);
        return;
    }
    const response = await fetch("/api/user", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(requsestBody)
      });
    if (response.status === 200) {
        messageContainer.innerHTML = "";
        messageElement.className = "sign__message--default";
        messageElement.textContent = "註冊成功";
        messageContainer.appendChild(messageElement);
        updateSignLink();
        document.querySelectorAll(".sign__input").forEach((element) => {
            element.value = "";
        });
    } else if (response.status === 422) {
        messageContainer.innerHTML = "";
        messageElement.className = "sign__message--red";
        messageElement.textContent = "Email格式錯誤";
        messageContainer.appendChild(messageElement);
    } else {
        data = await response.json();
        messageContainer.innerHTML = "";
        messageElement.className = "sign__message--red";
        messageElement.textContent = data.message;
        messageContainer.appendChild(messageElement);
    }
}

function signOut() {
    localStorage.clear();
    window.location.reload();
}

document.querySelector("#signin-link").addEventListener("click", openSigninBox);
document.querySelector("#signin-btn").addEventListener("click", signIn);
document.querySelector("#signout-link").addEventListener("click", signOut);
document.querySelector("#signup-btn").addEventListener("click", signUp);

