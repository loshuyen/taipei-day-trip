let orderModel = {
    fetchCreateOrder: async function(order) {
        let token = localStorage.getItem("token");
        let response = await fetch(
            "/api/orders",
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(order)
            }
        );
        let result = await response.json();
        if (response.status === 200) {
            return await result.data;
        }
        console.log(result.message);
    },
    fetchOrderByNumber: async function(orderNumber) {
        let token = localStorage.getItem("token");
        let response = await fetch(
            `/api/order?number=${orderNumber}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            }
        );
        let result = await response.json();
        if (response.status === 200) {
            return await result.data;
        }
        console.log(result.message);
    },
    fetchAllOrders: async function(userId) {
        let token = localStorage.getItem("token");
        let response = await fetch(
            "/api/orders/all",
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            return await response.json();
        }
        console.log(result.message);
    },
};

export default orderModel;