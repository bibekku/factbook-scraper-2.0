const { geography } = require("./geography");
const { introduction } = require("./introduction");

function transmuteCountry(country) {
    return {
        "name": country.name,
        "data": {
            "introduction": introduction(country.categories[0]),
            "geography": geography(country.categories[1])
        }
    };
}

module.exports.transmuteCountry = transmuteCountry;