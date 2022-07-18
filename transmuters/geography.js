const { transmuteHtmlToPlain, findFieldById, transmuteGeographicCoordinates, findSubfieldByName, getNoteIfExists } = require("../transmuter");

const ID = "geography";

function geography(category) {
    return {
        'location': location(category),
        'geographic_coordinates': geographic_coordinates(category),
        'map_references': map_references(category),
        'area': area(category),
        'coastline': coastline(category),
        'climate': climate(category),
        'land_use': land_use(category)
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

// TODO: 283

// function maritime_claims(category) {
//     const field = findFieldById(category, 283);

//     if (!field) return null;

//     if (field.value) return field.value;

//     const territorialSeaSubfield = findSubfieldByName(field, "territorial sea");
//     const contiguousZoneSubfield = findSubfieldByName(field, "contiguous zone");
//     const exclusiveEconomicZoneSubfield = findSubfieldByName(field, "exclusive economic zone");
//     const continentalShelfSubfield = findSubfieldByName(field, "continental shelf");
//     const exclusiveFishingZoneSubfield = findSubfieldByName(field, "exclusive fishing zone");

//     return {
//         ...territorialSeaSubfield && {
//             // field note
//             // subfield note
//         }
//     }
// }


function climate(category) {
    const field = findFieldById(category, 284);

    if (!field) return null;

    return transmuteHtmlToPlain(field.value).split('; ');
}


function land_use(category) {
    const field = findFieldById(category, 288);

    if (!field) return null;

    const sfAgriculturalLand = findSubfieldByName(field, 'agricultural land');
    const sfArableLand = findSubfieldByName(field, 'agricultural land: arable land');
    const sfPermanentCrops = findSubfieldByName(field, 'agricultural land: permanent crops');
    const sfPermanentPasture = findSubfieldByName(field, 'agricultural land: permanent pasture');
    const sfForest = findSubfieldByName(field, 'forest');
    const sfOther = findSubfieldByName(field, 'other');

    return {
        'by_sector': {
            ...sfAgriculturalLand && {
                'agricultural_land_total': {
                    'value': parseFloat(sfAgriculturalLand.value),
                    'units': sfAgriculturalLand.suffix,
                    'estimated': sfAgriculturalLand.estimated,
                    'date': sfAgriculturalLand.info_date
                }
            },
            ...sfArableLand && {
                'arable_land': {
                    'value': parseFloat(sfArableLand.value),
                    'units': sfArableLand.suffix,
                    'estimated': sfArableLand.estimated,
                    'date': sfArableLand.info_date
                }
            },
            ...sfPermanentCrops && {
                'permanent_crops': {
                    'value': parseFloat(sfPermanentCrops.value),
                    'units': sfPermanentCrops.suffix,
                    'estimated': sfPermanentCrops.estimated,
                    'date': sfPermanentCrops.info_date
                }
            },
            ...sfPermanentPasture && {  
                'permanent_pasture': {
                    'value': parseFloat(sfPermanentPasture.value),
                    'units': sfPermanentPasture.suffix,
                    'estimated': sfPermanentPasture.estimated,
                    'date': sfPermanentPasture.info_date
                }
            },
            ...sfForest && {
                'forest': {
                    'value': parseFloat(sfForest.value),
                    'units': sfForest.suffix,
                    'estimated': sfForest.estimated,
                    'date': sfForest.info_date
                }
            },
            ...sfOther && {
                'other': {
                    'value': parseFloat(sfOther.value),
                    'units': sfOther.suffix,
                    'estimated': sfOther.estimated,
                    'date': sfOther.info_date
                }
            }   
        },
        ...getNoteIfExists(field)
    };
}


// TODO: rest of geography.

module.exports.geography = geography;