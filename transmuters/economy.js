const { toSnakeCase } = require("../formatter");
const { findFieldById, transmuteHtmlToPlain, getNoteIfExists, findSubfieldByName } = require("../transmuter");


const ID = "economy";

function economy(category) {
    return {
        'overview': overview(category),
        'gdp': {
            'purchasing_power_parity': gdp_purchasing_power_parity(category),
            'official_exchange_rate': gdp_official_exchange_rate(category),
            'real_growth_rate': gdp_real_growth_rate(category),
            'per_capita_purchasing_power_parity': gdp_per_capita_purchasing_power_parity(category),
            'composition': {
                'by_end_use': gdp_composition_by_end_use(category),
                'by_sector_of_origin': gdp_composition_by_sector_of_origin(category),
            },
        },
        'agricultural_products': agricultural_products(category),
        'industries': industries(category),
        'industrial_production_growth_rate': industrial_production_growth_rate(category),
    };
}


function overview(category) {
    const field = findFieldById(category, 207);

    if (!field) return null;

    return transmuteHtmlToPlain(field.value);
}


function gdp_purchasing_power_parity(category) {
    const field = findFieldById(category, 208);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    return {
        'annual_values': field.subfields.map(subfield => subfieldForOneYear(subfield)),
        ...getNoteIfExists(field)
    };
}


function gdp_real_growth_rate(category) {
    const field = findFieldById(category, 210);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    return {
        'annual_values': field.subfields.map(subfield => subfieldForOneYear(subfield)),
        ...getNoteIfExists(field)
    };
}


function gdp_per_capita_purchasing_power_parity(category) {
    const field = findFieldById(category, 211);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    return {
        'annual_values': field.subfields.map(subfield => subfieldForOneYear(subfield)),
        ...getNoteIfExists(field)
    };
}


function gdp_official_exchange_rate(category) {
    const field = findFieldById(category, 209);

    if (!field) return null;

    return {
        'USD': parseFloat(field.value),
        'estimated': field.estimated,
        'date': field.info_date,
        ...getNoteIfExists(field)
    };
}


function gdp_composition_by_end_use(category) {
    const field = findFieldById(category, 213);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const endUses = Object.fromEntries(
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
        'end_uses': endUses,
        'estimated': field.subfields[0].estimated,
        'date': field.subfields[0].info_date,
        ...getNoteIfExists(field)
    };
}


function gdp_composition_by_sector_of_origin(category) {
    const field = findFieldById(category, 214);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const sectors = Object.fromEntries(
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
        'sectors': sectors,
        'estimated': field.subfields[0].estimated,
        'date': field.subfields[0].info_date,
        ...getNoteIfExists(field)
    };
}


function agricultural_products(category) {
    const field = findFieldById(category, 215);

    if (!field) return null;

    const splitRegex = /[,;] /;
    return {
        'products': transmuteHtmlToPlain(field.value).split(splitRegex),
        ...getNoteIfExists(field)
    };
}


function industries(category) {
    const field = findFieldById(category, 216);

    if (!field) return null;

    const splitRegex = /[,;] /;
    return {
        'industries': transmuteHtmlToPlain(field.value).split(splitRegex),
        ...getNoteIfExists(field)
    };
}


function industrial_production_growth_rate(category) {
    const field = findFieldById(category, 217);

    if (!field) return null;
    if (!field.value) return transmuteHtmlToPlain(field.content);

    return {
        'annual_percentage_increase': parseFloat(field.value),
        'estimated': field.estimated,
        'date': field.info_date
    }
}


function subfieldForOneYear(subfieldForYear) {
    const regex = /^.+ (?<year>\d\d\d\d)$/;
    const date = regex.exec(subfieldForYear.name).groups.year;

    return {
        'value': parseFloat(subfieldForYear.value),
        'units': subfieldForYear.suffix || subfieldForYear.prefix,
        'estimated': subfieldForYear.estimated,
        'date': date,
        ...subfieldForYear.subfield_note && {
            'note': subfieldForYear.subfield_note
        }
    };
}

module.exports.economy = economy;