const { findFieldById, transmuteHtmlToPlain, getNoteIfExists } = require("../transmuter");


const ID = "military_and_security";

function military_and_security(category) {
    return {
        'military_and_security_forces': military_and_security_forces(category),
        'expenditures': expenditures(category),
        'personnel_strengths': personnel_strengths(category),
        'equipment_inventories_and_acquisitions': equipment_inventories_and_acquisitions(category),
        'service_age_and_obligation': service_age_and_obligation(category),
        'note': military_note(category),
    }
}


function military_and_security_forces(category) {
    const field = findFieldById(category, 331);

    if (!field) return null;

    return {
        'forces': transmuteHtmlToPlain(field.value),
        'date': field.info_date,
        ...getNoteIfExists(field)
    }
}


function expenditures(category) {
    const field = findFieldById(category, 330);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

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
        ...getNoteIfExists(field)
    };
    
}


function equipment_inventories_and_acquisitions(category) {
    const field = findFieldById(category, 411);

    if (!field) return null;

    return {
        'equipment_inventories_and_acquisitions': transmuteHtmlToPlain(field.value),
        'date': field.info_date,
        ...getNoteIfExists(field)
    }

}


function service_age_and_obligation(category) {
    const field = findFieldById(category, 333);

    if (!field) return null;

    return {
        'service_age_and_obligation': transmuteHtmlToPlain(field.value),
        'date': field.info_date,
        ...getNoteIfExists(field)
    }
}


function military_note(category) {
    const field = findFieldById(category, 332);

    if (!field) return null;

    return transmuteHtmlToPlain(field.value);
}


module.exports.military_and_security = military_and_security;