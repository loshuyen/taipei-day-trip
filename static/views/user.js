let userView = {
    createSignElement: function() {
        return `<div class="fullScreenMask">
        </div>
        <div class="sign" id="signin-box">
            <div class="sign__header"></div>
            <div class="sign__title">
                登入會員帳號
            </div>
            <button class="sign__close-btn">
                <img src="../static/images/icon/icon_close.svg">
            </button>
            <div class="sign__input-container">
                <input type="text" name="email" class="sign__input" id="sign__input-email" placeholder="輸入電子信箱">
                <img src="../static/images/icon/icon_checked.svg" id ="sign__input-email-check" class="sign__input__check--ok">
            </div>
            <div class="sign__input-container">
                <input type="password" name="password" id="sign__input-password" class="sign__input" placeholder="輸入密碼">
                <img src="../static/images/icon/icon_checked.svg" id ="sign__input-password-check" class="sign__input__check--ok">
            </div>
            <button class="sign__submit-btn" id="signin-btn">登入帳戶</button>
            <div id="signin-message"></div>
            <div class="sign__description">
                還沒有帳戶？<span id="signup-link">點此註冊</span>
            </div>
        </div>
        <div class="sign" id="signup-box">
            <div class="sign__header"></div>
            <div class="sign__title">
                註冊會員帳號
            </div>
            <button class="sign__close-btn">
                <img src="../static/images/icon/icon_close.svg">
            </button>
            <div class="sign__input-container">
                <input type="text" name="signup-name" id="signup-name" class="sign__input" placeholder="輸入姓名">
                <img src="../static/images/icon/icon_checked.svg" id ="signup-name-check" class="sign__input__check--ok">
            </div>
            <div class="sign__input-container">
                <input type="text" name="signup-email" id="signup-email" class="sign__input" placeholder="輸入電子信箱">
                <img src="../static/images/icon/icon_checked.svg" id ="signup-email-check" class="sign__input__check--ok">
            </div>
            <div class="sign__input-container">
                <input type="password" name="signup-password" id="signup-password" class="sign__input" placeholder="輸入密碼">
                <img src="../static/images/icon/icon_checked.svg" id ="signup-password-check" class="sign__input__check--ok">
            </div>
            <button class="sign__submit-btn" id="signup-btn">註冊新帳戶</button>
            <div id="signup-message"></div>
            <div class="sign__description">
                已經有帳戶了？<span id="signin-link">點此登入</span>
            </div>
        </div>`;
    },
    renderMessage: function(message, messageElementId, failed=true) {
        let messageContainer = document.getElementById(messageElementId);
        let messageElement = document.createElement("div");
        messageContainer.innerHTML = "";
        messageElement.className = failed ? "sign__message--red" : "sign__message--default";
        messageElement.textContent = message;
        messageContainer.appendChild(messageElement);
    }
};

export default userView;