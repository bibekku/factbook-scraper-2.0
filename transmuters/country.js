const { introduction } = require("./introduction");

function transmuteCountry(country) {
    return {
        "name": country.name,
        "data": {
            "introduction": introduction(country.categories[0])
        }
    };
}

module.exports.transmuteCountry = transmuteCountry;