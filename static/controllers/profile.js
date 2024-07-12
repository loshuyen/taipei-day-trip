import {addSignEvents, updateSignLink} from "./user.js";

let user;

window.addEventListener("DOMContentLoaded", async function() {
    user = await updateSignLink();
    if (!user) {
        window.location.href = "/";
        return;
    }
    addSignEvents();
    
});
