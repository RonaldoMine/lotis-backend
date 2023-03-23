const isset = (value) => {
    const typeValue = typeof value;
    let checkValue = value !== undefined;
    if (checkValue) {
        switch (typeValue) {
            case "string":
                checkValue = value !== ""
                break;
            case "number":
                checkValue = value > 0
                break;
            case "object":
                checkValue = value.length > 0
                break;
            default:
                checkValue = value !== null
        }
    }
    return checkValue;
}
module.exports = isset
