import {addSignEvents, updateSignLink} from "./user.js";
import profileView from "../views/profile.js";
import profileModel from "../models/profile.js";

const userPhoto = document.querySelector(".profile__photo-user");

let user;

window.addEventListener("DOMContentLoaded", async function() {
    user = await updateSignLink();
    if (!user) {
        window.location.href = "/";
        return;
    }
    addSignEvents();

    const photo_blob = await profileModel.fetchUserPhoto(user.id);
    profileView.renderPhoto(userPhoto, photo_blob);
    
});
