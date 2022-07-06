const { transmuteHtmlToPlain, findFieldById } = require("../transmuter");

const ID = "introduction";

function introduction(category) {    
    return {
        'background': background(category)
    };
}

function background(category) {
    const field = findFieldById(category, 325);
    
    if (!field) {
        return null;
    }

    return transmuteHtmlToPlain(field.value);
}

module.exports.introduction = introduction;