const { transmuteHtmlToPlain, findFieldById, transmuteGeographicCoordinates, findSubfieldByName } = require("../transmuter");

const ID = "geography";

function geography(category) {
    return {
        'location': location(category),
        'geographic_coordinates': geographic_coordinates(category),
        'map_references': map_references(category),
        'area': area(category),
        'coastline': coastline(category),
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


function area(category) {
    const field = findFieldById(category, 279);

    if (!field) return null;

    const totalSubfield = findSubfieldByName(field, "total");
    const landSubfield = findSubfieldByName(field, "land");
    const waterSubfield = findSubfieldByName(field, "water");

    return {
        ...totalSubfield && {
            "total": {
                "value": parseInt(totalSubfield.value),
                "units": totalSubfield.suffix
            }
        },
        ...landSubfield && {
            "land": {
                "value": parseInt(landSubfield.value),
                "units": landSubfield.suffix
            }
        },
        ...waterSubfield && {
            "water": {
                "value": parseInt(waterSubfield.value),
                "units": waterSubfield.suffix
            }
        },
        "comparative": area_comparative(category)
    };
}


function area_comparative(category) {
    const field = findFieldById(category, 280);

    if (!field) return null;

    return field.value;
}

//TODO: 281

function coastline(category) {
    const field = findFieldById(category, 282);

    if (!field) return null;

    return {
        "value": parseInt(field.value),
        "units": field.suffix,
        ...field.subfield_note && { "note": field.subfield_note }
    };
}

module.exports.geography = geography;