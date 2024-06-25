let userModel = {
    fetchAuthUser: async function() {
        let token = localStorage.getItem("token");
        let user = await fetch("/api/user/auth",{
            headers: {"Authorization": `Bearer ${token}`}
        })
        .then(response => response.json())
        .then(data => data.data);
        return user;
    },
    fetchToken: async function(requestBody) {
        let response = await fetch("/api/user/auth", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(requestBody)
          });
        return response;
    },
    fetchSignUp: async function(requestBody) {
        let response = await fetch("/api/user", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(requestBody)
          });
          return response;
    },
};

export default userModel;