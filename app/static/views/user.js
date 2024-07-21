let userView = {
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