let attractionModel = {
    fetchAllAttractions: async function (nextPage, keyword) {
        let result = await fetch(`/api/attractions?page=${nextPage}&keyword=${keyword}`).then(
            response => response.json()
        ).then(
            data => data
        );
        return result;
    },
    fetchAttractionById: async function(attractionId) {
        let response = await fetch(`/api/attraction/${attractionId}`);
        let result = await response.json();
        if (response.status === 200) {
            return result.data;
        }
        window.location.href = "/";
    }
};

export default attractionModel;