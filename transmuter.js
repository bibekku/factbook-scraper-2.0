/**
 * This file contains transmutations that we want to perform on field content.
 * 
 * In general, these functions will take in a field object, as seen in the page-data json.
 * They'll then return the data transmuted to the appropriate form.
 */

const cheerio = require('cheerio');
const { toKebabCase } = require('./formatter');

function transmuteHtmlToPlain(string) {
    const $ = cheerio.load(string);

    $('br').replaceWith('\n');

    return $.text();
}

function findFieldById(category, fieldId) {
    return category.fields.find(field => field.field_id == fieldId);
}

function findSubfieldByName(field, subfieldName) {
    return field.subfields.find(subfield => subfield.name == subfieldName);
}

function getNoteIfExists(field) {
    return field.field_note && {
        'note': transmuteHtmlToPlain(field.field_note)
    };
}

function transmuteValueUnitDateField(field) {
    return {
        'value': parseFloat(field.value),
        // some values do not have units attached
        ...field.suffix && {
            'units': field.suffix,
        },
        'estimated': field.estimated,
        'date': field.info_date,
        ...getNoteIfExists(field)
    }
}

function transmuteValueUnitDateSubfield(subfield, keyName) {
    return subfield && {
        [keyName]: {
            'value': parseFloat(subfield.value),
            // some values do not have units attached
            ...subfield.suffix && {
                'units': subfield.suffix,
            },
            'estimated': subfield.estimated,
            'date': subfield.info_date,
            ...subfield.subfield_note && {
                'note': subfield.subfield_note
            }
        }
    };
}

function transmuteGeographicCoordinates(string) {
    const regex = /^(?<latDeg>[0-9]+) (?<latMin>[0-9]+) (?<latHem>[NS]), (?<longDeg>[0-9]+) (?<longMin>[0-9]+) (?<longHem>[EW]).*/;
    
    const match = regex.exec(string);
    
    return {
        latitude: {
            degrees: parseInt(match.groups.latDeg, 10),
            minutes: parseInt(match.groups.latMin, 10),
            hemisphere: match.groups.latHem
        }, longitude: {
            degrees: parseInt(match.groups.longDeg, 10),
            minutes: parseInt(match.groups.longMin, 10),
            hemisphere: match.groups.longHem
        }
    }

}

function transmuteArea(string) {
    const regex = /^(?<value>[0-9,.]+) (?<units>[a-zA-Z.-\s]+)(\s+)?(\((?<note>.+)\))?/;
    const match = regex.exec(string);

    let value = parseFloat(match.groups.value.replaceAll(',', ''));
    let units = match.groups.units;
    
    if (units.startsWith("million")) {
        value = value * 1e6;
        units = units.replace("million", "");
        units = units.trim();
    }

    return {
        value: Math.floor(value),
        units: units,
        ...(match.groups.note && {note : match.groups.note})
    };

}

function transmuteBorders(string) {
    const regex = /(?<neighbour>.+?) (?<value>[0-9][0-9,.]+) km(\s+)?(\((?<note>.+)\))?$/

    return string.split('; ')
                .map((neighbourInfo) => {
                    const match = regex.exec(neighbourInfo);
                    return {
                        neighbour: match.groups.neighbour,
                        'border-length': {
                            value: match.groups.value,
                            units: 'km'
                        },
                        ...(match.groups.note && {note : match.groups.note})
                    }
                });
}


module.exports.findFieldById = findFieldById;
module.exports.findSubfieldByName = findSubfieldByName;
module.exports.transmuteGeographicCoordinates = transmuteGeographicCoordinates;
module.exports.transmuteArea = transmuteArea;
module.exports.transmuteBorders = transmuteBorders;
module.exports.transmuteHtmlToPlain = transmuteHtmlToPlain;
module.exports.getNoteIfExists = getNoteIfExists;
module.exports.transmuteValueUnitDateSubfield = transmuteValueUnitDateSubfield;
module.exports.transmuteValueUnitDateField = transmuteValueUnitDateField;