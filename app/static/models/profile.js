let profileModel = {
    fetchUserPhoto: async function(user_id) {
        let token = localStorage.getItem("token");
        let photo_blob = await fetch("/api/user/photo",{
            headers: {"Authorization": `Bearer ${token}`}
        })
        .then(response => response.blob());
        return photo_blob;
    },
    
};

export default profileModel;