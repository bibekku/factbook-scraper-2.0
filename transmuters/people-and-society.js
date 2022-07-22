const { toSnakeCase } = require("../formatter");
const { findFieldById, transmuteValueUnitDateField, findSubfieldByName, getNoteIfExists, transmuteHtmlToPlain, extractFieldAndTransmute } = require("../transmuter");


const ID = "people";

function people(category) {
    return {
        'population': population(category),
        'nationality': nationality(category),
        'demographic_profile': demographic_profile(category),
        'age_structure': age_structure(category),
        'dependency_ratios': dependency_ratios(category),
        'median_age': median_age(category),
        'population_growth_rate': extractFieldAndTransmute(category, 344, 'growth_rate'),
        'birth_rate': extractFieldAndTransmute(category, 345, 'births_per_1000_population'),
        'death_rate': extractFieldAndTransmute(category, 346, 'deaths_per_1000_population'),
        'net_migration_rate': extractFieldAndTransmute(category, 347, 'migrants_per_1000_population'),
        'population_distribution': population_distribution(category),
        'urbanization': urbanization(category),
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


function dependency_ratios(category) {
    const field = findFieldById(category, 342);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    // Ian's JSON presents only one date for the entire field
    // Even though the dates may exist separately and independently
    const datedSubfield = field.subfields.find(subfield => subfield.info_date);

    const ratios = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name);
                const v = {
                    'value': parseFloat(subfield.value),
                    'units': subfield.suffix || '%'
                };
                return [k, v];
             })
    );

    return {
        'ratios': ratios,
        'estimated': datedSubfield && datedSubfield.estimated,
        'date': datedSubfield && datedSubfield.info_date,
        ...getNoteIfExists(field)
    };
}


function median_age(category) {
    const field = findFieldById(category, 343);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    // Ian's JSON presents only one date for the entire field
    // Even though the dates may exist separately and independently
    const datedSubfield = field.subfields.find(subfield => subfield.info_date);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name);
                const v = {
                    'value': parseFloat(subfield.value),
                    'units': subfield.suffix
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


function population_distribution(category) {
    const field = findFieldById(category, 348);

    if (!field) return null;

    return transmuteHtmlToPlain(field.content);
}


function urbanization(category) {
    const field = findFieldById(category, 349);

    if (!field) return null;

    const sfUrbanPopulation = findSubfieldByName(field, 'urban population');
    const sfRateOfUrbanization = findSubfieldByName(field, 'rate of urbanization');

    return {
        ...sfUrbanPopulation && {
            'urban_population': {
                'value': parseFloat(sfUrbanPopulation.value),
                'units': sfUrbanPopulation.suffix,
                'date': sfUrbanPopulation.subfield_note,
            }
        },
        ...sfRateOfUrbanization && {
            'rate_of_urbanization': {
                'value': parseFloat(sfRateOfUrbanization.value),
                'units': sfRateOfUrbanization.suffix,
                'date': sfRateOfUrbanization.subfield_note
            }
        },
        ...getNoteIfExists(field)
    };
}


module.exports.people = people;