const { findFieldById, transmuteHtmlToPlain } = require("../transmuter");


const ID = "military_and_security";

function military_and_security(category) {
    return {
        'military_and_security_forces': military_and_security_forces(category),
        'expenditures': expenditures(category),
        'personnel_strengths': personnel_strengths(category),
    }
}


function military_and_security_forces(category) {
    const field = findFieldById(category, 331);

    if (!field) return null;

    return {
        'forces': transmuteHtmlToPlain(field.value),
        'date': field.info_date,
        ...field.field_note && {
            'note': transmuteHtmlToPlain(field.field_note)
        }
    }
}


function expenditures(category) {
    const field = findFieldById(category, 330);

    if (!field) return null;

    return {
        'annual_values': field.subfields.map(subfield => expenditureForOneYear(subfield))
    };
}


function expenditureForOneYear(subfieldForYear) {
    const dateRegex = /^Military Expenditures (?<year>\d\d\d\d)$/;
    const date = dateRegex.exec(subfieldForYear.name).groups.year;

    return {
        'value': parseFloat(subfieldForYear.value),
        'units': 'percent_of_gdp',
        'estimated': subfieldForYear.estimated,
        'date': date,
        ...subfieldForYear.subfield_note && {
            'note': subfieldForYear.subfield_note
        }
    }
}


function personnel_strengths(category) {
    const field = findFieldById(category, 410);

    if (!field) return null;

    return {
        'strengths': transmuteHtmlToPlain(field.value),
        'date': field.info_date,
        ...field.field_note && {
            'note': field.field_note
        }
    };
    
}


module.exports.military_and_security = military_and_security;