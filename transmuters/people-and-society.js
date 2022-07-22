const { toSnakeCase } = require("../formatter");
const { findFieldById, transmuteValueUnitDateField, findSubfieldByName, getNoteIfExists, transmuteHtmlToPlain } = require("../transmuter");


const ID = "people";

function people(category) {
    return {
        'population': population(category),
        'nationality': nationality(category),
        'demographic_profile': demographic_profile(category),
        'age_structure': age_structure(category),
    };
}


function population(category) {
    const field = findFieldById(category, 335);

    return transmuteValueUnitDateField(field);
}


function nationality(category) {
    const field = findFieldById(category, 336);

    const sfNoun = findSubfieldByName(field, 'noun');
    const sfAdjective = findSubfieldByName(field, 'adjective');

    return {
        ...sfNoun && {
            'name': sfNoun.value
        },
        ...sfAdjective && {
            'adjective': sfAdjective.value
        },
        ...getNoteIfExists(field)
    };
}

// TODO: ethnic_groups, languages, religions


function demographic_profile(category) {
    const field = findFieldById(category, 340);

    if (!field) return null;

    return transmuteHtmlToPlain(field.value);
}


function age_structure(category) {
    const field = findFieldById(category, 341);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    // Ian's JSON presents only one date for the entire field
    // Even though the dates may exist separately and independently
    const datedSubfield = field.subfields.find(subfield => subfield.info_date);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const name = subfield.name;
                name.replace('years', '');
                name.replace('-', ' to ');

                const k = toSnakeCase(name);

                if (!subfield.value) return [k, 'NA'];

                const subfieldNoteRegex = /^\(male (?<maleCount>[0-9,]+)\/female (?<femaleCount>[0-9,]+)\)$/;
                const match = subfieldNoteRegex.exec(subfield.subfield_note);

                const v = {
                    'percent': parseFloat(subfield.value),
                    'males': parseFloat(match.groups?.maleCount.replaceAll(',', '')),
                    'females': parseFloat(match.groups?.femaleCount.replaceAll(',', ''))
                };
                return [k, v];
             })
    );

    return {
        ...sections,
        'estimated': datedSubfield && datedSubfield.estimated,
        'date': datedSubfield && datedSubfield.info_date,
        ...getNoteIfExists(field)
    };
}


module.exports.people = people;