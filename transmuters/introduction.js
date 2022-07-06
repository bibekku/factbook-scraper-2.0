const { transmuteHtmlToPlain } = require("../transmuter");

const ID = "introduction";

function introduction(introductionCategory) {    
    return {
        'background': background(introductionCategory)
    };
}

function background(introductionCategory) {
    // field_id = 325
    const backgroundField = introductionCategory.fields.find(field => field.field_id == 325);
    
    if (!backgroundField) {
        return null;
    }

    return transmuteHtmlToPlain(backgroundField.value);
}

module.exports.introduction = introduction;