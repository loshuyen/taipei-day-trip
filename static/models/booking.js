let bookingModel = {
    fetchCreateBooking: async function(bookingInfo) {
        let token = localStorage.getItem("token");
        let response = await fetch(
            "/api/booking",
            {
                method: "POST",
                body: JSON.stringify(bookingInfo),
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        if (response.status === 200) {
            return true;
        }
        let errorMessage = await response.json();
        console.log(errorMessage.message);
        return false;
    },
    fetchUnpaidBooking: async function() {
        let token = localStorage.getItem("token");
        let response = await fetch(
            "/api/booking",
            {
                headers: {Authorization: `Bearer ${token}`}
            }
        );
        let result = await response.json();
        if (response.status === 200) {
            return await result.data;
        }
        console.log(result.message);
    },
    fetchDeleteUnpaidBooking: async function() {
        let token = localStorage.getItem("token");
        let response = await fetch(
            "/api/booking",
            {
                method: "DELETE",
                headers: {Authorization: `Bearer ${token}`}
            }
        );
        if (response.status === 200) {
            return await response.json();
        }
    },
    fetchAllBookings: async function() {
        let token = localStorage.getItem("token");
        let response = await fetch(
            "/api/booking/all",
            {
                headers: {Authorization: `Bearer ${token}`}
            }
        );
        if (response.status === 200) {
            return await response.json();
        }
    }
}

export default bookingModel;