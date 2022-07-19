const { communications } = require("./communications");
const { energy } = require("./energy");
const { environment } = require("./environment");
const { geography } = require("./geography");
const { introduction } = require("./introduction");
const { military_and_security } = require("./military-and-security");

function transmuteCountry(country) {
    return {
        "name": country.name,
        "data": {
            "introduction": introduction(country.categories[0]),
            "geography": geography(country.categories[1]),
            "environment": environment(country.categories[3]),
            "energy": energy(country.categories[6]),
            "communications": communications(country.categories[7]),
            "military_and_security": military_and_security(country.categories[9]),
        }
    };
}

module.exports.transmuteCountry = transmuteCountry;