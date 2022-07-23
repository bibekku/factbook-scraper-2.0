const { toSnakeCase } = require("../formatter");
const { findFieldById, transmuteHtmlToPlain, getNoteIfExists, findSubfieldByName, transmuteGeographicCoordinates } = require("../transmuter");


const ID = 'government';

function government(category) {
    return {
        'country_name': country_name(category),
        'government_type': government_type(category),
        'capital': capital(category),
        'administrative_divisions': administrative_divisions(category),
        'constitution': constitution(category),
        'legal_system': legal_system(category),
        'international_law_organization_participation': international_law_organization_participation(category),
        'citizenship': citizenship(category),
        'suffrage': suffrage(category),
        'executive_branch': executive_branch(category),
        'legislative_branch': legislative_branch(category),
        'judicial_branch': judicial_branch(category),
        'international_organization_participation': international_organization_participation(category),
        'diplomatic_representation': {
            'in_united_states': diplomatic_representation_in_united_states(category),
            'from_united_states': diplomatic_representation_from_united_states(category),
        },
        'flag_description': flag_description(category),
        'national_symbol': national_symbol(category),
        'national_anthem': national_anthem(category),
        'national_heritage': national_heritage(category),
    }
}


function country_name(category) {
    const field = findFieldById(category, 296);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name);
                const v = transmuteHtmlToPlain(subfield.value);
                return [k, v];
             })
    );

    return {
        ...sections,
        ...getNoteIfExists(field)
    };
}


function government_type(category) {
    const field = findFieldById(category, 299);
    
    if (!field) return null;

    return transmuteHtmlToPlain(field.value);
}


function capital(category) {
    const field = findFieldById(category, 301);

    if (!field) return null;

    const sfName = findSubfieldByName(field, 'name');
    const sfCoordinates = findSubfieldByName(field, 'geographic coordinates');
    const sfTimeDifference = findSubfieldByName(field, 'time difference');
    const sfDst = findSubfieldByName(field, 'daylight saving time');
    const sfTimeZoneNote = findSubfieldByName(field, 'time zone note');
    const sfEtymology = findSubfieldByName(field, 'etymology');

    return {
        ...sfName && {
            'name': sfName.value
        },
        ...sfCoordinates && {
            'geographic_coordinates': transmuteGeographicCoordinates(sfCoordinates.value)
        },
        ...sfTimeDifference && parseTimeZoneString(sfTimeDifference.value),
        ...sfDst && {
            'daylight_saving_time': transmuteHtmlToPlain(sfDst.value)
        },
        ...sfTimeZoneNote && {
            'time_zone_note': transmuteHtmlToPlain(sfTimeZoneNote.value)
        },
        ...sfEtymology && {
            'etymology': transmuteHtmlToPlain(sfEtymology.value)
        },
    }

}


function parseTimeZoneString(string) {
    const timeDifferenceRegex = /^UTC(?<polarity>[+\-\s])(?<hours>[\d\.]+)( \((?<note>.+)\))?$/;

    const match = timeDifferenceRegex.exec(string);
    let hours = parseFloat(match.groups?.hours);

    if (match.groups?.polarity === '-') hours *= -1;

    return {
        'time_difference': {
            'timezone': hours,
            'note': match.groups?.note,
        }
    };
}


function administrative_divisions(category) {
    const field = findFieldById(category, 302);
    
    if (!field) return null;

    return transmuteHtmlToPlain(field.value);
}

//TODO: independence and national holidays


function constitution(category) {
    const field = findFieldById(category, 307);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name);
                const v = transmuteHtmlToPlain(subfield.value);
                return [k, v];
             })
    );

    return {
        ...sections,
        ...getNoteIfExists(field)
    };
}


function legal_system(category) {
    const field = findFieldById(category, 308);
    
    if (!field) return null;

    return transmuteHtmlToPlain(field.value);
}


function international_law_organization_participation(category) {
    const field = findFieldById(category, 309);

    if (!field) return null;

    return transmuteHtmlToPlain(field.value).split('; ');
}


function citizenship(category) {
    const field = findFieldById(category, 310);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name);
                const v = transmuteHtmlToPlain(subfield.value);
                return [k, v];
             })
    );

    return {
        ...sections,
        ...getNoteIfExists(field)
    };
}


// TODO: write regexes for this
function suffrage(category) {
    const field = findFieldById(category, 311);

    if (!field) return null;
    return transmuteHtmlToPlain(field.value).split('; ');
}


function executive_branch(category) {
    const field = findFieldById(category, 312);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name);
                const v = transmuteHtmlToPlain(subfield.value);
                return [k, v];
             })
    );

    return {
        ...sections,
        ...getNoteIfExists(field)
    };
}


function legislative_branch(category) {
    const field = findFieldById(category, 313);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name);
                const v = transmuteHtmlToPlain(subfield.value);
                return [k, v];
             })
    );

    return {
        ...sections,
        ...getNoteIfExists(field)
    };
}


function judicial_branch(category) {
    const field = findFieldById(category, 314);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name);
                const v = transmuteHtmlToPlain(subfield.value);
                return [k, v];
             })
    );

    return {
        ...sections,
        ...getNoteIfExists(field)
    };
}


// TODO: political parties and leaders


function international_organization_participation(category) {
    const field = findFieldById(category, 317);

    if (!field) return null;
    let value = field.value;
    let note;

    // Special for Afghanistan
    if (value.includes(': ')) {
        [ note, value ] = value.split(': ');
    }

    const regex = /^(?<org>.+?)( \((?<note>.+)\))?$/;

    return value.split(', ')
                .filter(Boolean)
                .map(orgString => {
                    const match = regex.exec(orgString);
                    return {
                        'organization': match.groups?.org || orgString,
                        'note': match.groups?.note,
                    }
                });
}


function diplomatic_representation_in_united_states(category) {
    const field = findFieldById(category, 318);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name);
                const v = transmuteHtmlToPlain(subfield.value);
                if (k === 'email_address_and_website') {
                    return [k, transmuteEmailAndWebsite(v)];
                }
                return [k, v];
             })
    );

    return {
        ...sections,
        ...getNoteIfExists(field)
    };
}


function diplomatic_representation_from_united_states(category) {
    const field = findFieldById(category, 319);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name);
                const v = transmuteHtmlToPlain(subfield.value);
                if (k === 'email_address_and_website') {
                    return [k, transmuteEmailAndWebsite(v)];
                }
                return [k, v];
             })
    );

    return {
        ...sections,
        ...getNoteIfExists(field)
    };
}


function transmuteEmailAndWebsite(string) {
    string = string.replace(';', '\n');

    const emails = string.split('\n')
                    .filter(Boolean)
                    .map(line => line.trim())
                    .filter(line => line.includes('@'));

    const websites = string.split('\n')
                    .filter(Boolean)
                    .map(line => line.trim())
                    .filter(line => line.includes('http'));

    return {
        ...emails && {
            'emails': emails
        },
        ...websites && {
            'websites': websites
        }
    };
}


function flag_description(category) {
    const field = findFieldById(category, 320);

    if (!field) return null;

    return {
        'description': transmuteHtmlToPlain(field.value),
        ...getNoteIfExists(field)
    }
}


function national_symbol(category) {
    const field = findFieldById(category, 321);

    if (!field) return null;
    if (!field.value) return transmuteHtmlToPlain(field.content);

    const lines = field.value.split('; ');
    const colorLine = lines.find(line => line.toLowerCase().startsWith('national color'));

    const colors = colorLine?.split(': ')[1].split(', ');

    const symbols = lines.filter(line => !line.toLowerCase().startsWith('national color'));

    return {
        ...symbols && {
            'symbols': symbols
        },
        ...colors && {
            'colors': colors
        }
    };
}


function national_anthem(category) {
    const field = findFieldById(category, 322);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name);
                const v = transmuteHtmlToPlain(subfield.value);
                return [k, v];
             })
    );

    return {
        ...sections,
        ...getNoteIfExists(field)
    };
}


function national_heritage(category) {
    const field = findFieldById(category, 426);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name);
                const v = transmuteHtmlToPlain(subfield.value);
                return [k, v];
             })
    );

    return {
        ...sections,
        ...getNoteIfExists(field)
    };
}


module.exports.government = government;