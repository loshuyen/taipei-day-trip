let mrtModel = {
    fetchAllMRT: async function() {
        let mrtList = await fetch("/api/mrts").then(
            response => response.json()
        ).then(
            data => data.data
        );
        return mrtList;
    },
};

export default mrtModel;