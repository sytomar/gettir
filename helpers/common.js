const getCreatedAtDate = async (timestamp) => {
    let date = new Date(timestamp * 1000);
    return date;
};

module.exports = {
    getCreatedAtDate
};