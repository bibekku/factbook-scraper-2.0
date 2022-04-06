/**
 * This file contains transmutations that we want to perform on field content.
 * 
 * In general, these functions will take in a field object, as seen in the page-data json.
 * They'll then return the data transmuted to the appropriate form.
 */

const cheerio = require('cheerio');
const { toKebabCase } = require('./formatter');


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


module.exports.transmuteGeographicCoordinates = transmuteGeographicCoordinates;
module.exports.transmuteArea = transmuteArea;