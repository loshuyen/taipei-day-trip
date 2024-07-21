let profileView = {
    renderPhoto: function(img_element, image_blob) {
        if (!image_blob) {
            img_element.src = "../static/images/icon/user.svg";
        } else {
            img_element.src = URL.createObjectURL(image_blob);
        }
    }
};

export default profileView;