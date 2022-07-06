const { transmuteHtmlToPlain, findFieldById, transmuteGeographicCoordinates } = require("../transmuter");

const ID = "geography";

function geography(category) {
    return {
        'location': location(category),
        'geographic_coordinates': geographic_coordinates(category),
        'map_references': map_references(category)
    }
}


function location(category) {
    const field = findFieldById(category, 276);

    if (!field) return null;

    return transmuteHtmlToPlain(field.value);
}


function geographic_coordinates(category) {
    const field = findFieldById(category, 277);

    if (!field) return null;

    return transmuteGeographicCoordinates(field.value);
}

function map_references(category) {
    const field = findFieldById(category, 278);

    if (!field) return null;

    return field.value;
}



module.exports.geography = geography;