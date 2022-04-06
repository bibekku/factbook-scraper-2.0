const { toKebabCase } = require('./formatter');

function parseMainPage(jsonString) {
    return JSON.parse(
        JSON.parse(jsonString)
            .result
            .data
            .country
            .json
    );
}

function parseCountry(parsedJson) {
    return {
        [toKebabCase(parsedJson.name)] : parseCategoryArray(parsedJson.categories), 
    }
}


function parseCategoryArray(categoryArray) {
    let categories = new Object();
    for (let category of categoryArray) {
        categories[toKebabCase(category.title)] = parseFieldArray(category.fields);
    }
    return categories;
}


function parseFieldArray(fieldArray) {
    let fields = new Object();
    for (let field of fieldArray) {
        fields[field.id] = field.content;
    }
    return fields;
}

module.exports.parseMainPage = parseMainPage;
module.exports.parseCountry = parseCountry;