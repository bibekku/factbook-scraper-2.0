const { communications } = require("./communications");
const { economy } = require("./economy");
const { energy } = require("./energy");
const { environment } = require("./environment");
const { geography } = require("./geography");
const { introduction } = require("./introduction");
const { military_and_security } = require("./military-and-security");
const { people } = require("./people-and-society");

function transmuteCountry(country) {
    return {
        "name": country.name,
        "data": {
            // "introduction": introduction(country.categories[0]),
            // "geography": geography(country.categories[1]),
            "people": people(country.categories[2]),
            // "environment": environment(country.categories[3]),
            // "economy": economy(country.categories[5]),
            // "energy": energy(country.categories[6]),
            // "communications": communications(country.categories[7]),
            // "military_and_security": military_and_security(country.categories[9]),
        }
    };
}

module.exports.transmuteCountry = transmuteCountry;