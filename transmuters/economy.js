const { toSnakeCase } = require("../formatter");
const { findFieldById, transmuteHtmlToPlain, getNoteIfExists, findSubfieldByName, transmuteValueUnitDateField } = require("../transmuter");


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
        'credit_ratings': credit_ratings(category),
        'agricultural_products': agricultural_products(category),
        'industries': industries(category),
        'industrial_production_growth_rate': industrial_production_growth_rate(category),
        'labor_force': {
            'total_size': labor_force_total_size(category),
            'by_occupation': labor_force_by_occupation(category),
        },
        'unemployment_rate': {
            'overall': unemployment_rate_overall(category),
            'in_youth_ages_15_to_24': unemployment_rate_in_youth_ages_15_to_24(category),
        },
        'population_below_poverty_line': population_below_poverty_line(category),
        'gini_index_coefficient': gini_index_coefficient(category),
        'household_income_by_percentage_share': household_income_by_percentage_share(category),
        'budget': budget(category),
        'taxes_and_other_revenues': taxes_and_other_revenues(category),
        'budget_surplus_or_deficit': budget_surplus_or_deficit(category),
        'public_debt': public_debt(category),
        'fiscal_year': fiscal_year(category),
        'inflation_rate': inflation_rate(category),
        'current_account_balance': current_account_balance(category),
        'exports': {
            'total_value': exports_total_value(category),
            'commodities': exports_commodities(category),
            'partners': exports_partners(category),
        },
        'imports': {
            'total_value': imports_total_value(category),
            'commodities': imports_commodities(category),
            'partners': imports_partners(category),
        },
        'reserves_of_foreign_exchange_and_gold': reserves_of_foreign_exchange_and_gold(category),
        'external_debt': external_debt(category),
        'exchange_rates': exchange_rates(category),
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

    // Ian's JSON presents only one date for the entire field
    // Even though the dates may exist separately and independently
    const datedSubfield = field.subfields.find(subfield => subfield.info_date);

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
        'estimated': datedSubfield && datedSubfield.estimated,
        'date': datedSubfield && datedSubfield.info_date,
        ...getNoteIfExists(field)
    };
}


function gdp_composition_by_sector_of_origin(category) {
    const field = findFieldById(category, 214);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    // Ian's JSON presents only one date for the entire field
    // Even though the dates may exist separately and independently
    const datedSubfield = field.subfields.find(subfield => subfield.info_date);

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
        'estimated': datedSubfield && datedSubfield.estimated,
        'date': datedSubfield && datedSubfield.info_date,
        ...getNoteIfExists(field)
    };
}


function credit_ratings(category) {
    const field = findFieldById(category, 237);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const sfFitchRating = findSubfieldByName(field, 'Fitch rating');
    const sfMoodysRating = findSubfieldByName(field, "Moody's rating");
    const sfSAndPRating = findSubfieldByName(field, 'Standard & Poors rating');

    return {
        ...sfFitchRating && {
            'fitch_rating': {
                'rating': sfFitchRating.value,
                'date': sfFitchRating.info_date
            }
        },
        ...sfMoodysRating && {
            'moodys_rating': {
                'rating': sfMoodysRating.value,
                'date': sfMoodysRating.info_date
            }
        },
        ...sfSAndPRating && {
            'standard_and_poor_rating': {
                'rating': sfSAndPRating.value,
                'date': sfSAndPRating.info_date
            }
        },
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


function labor_force_total_size(category) {
    const field = findFieldById(category, 218);

    if (!field) return null;

    return {
        'total_people': parseFloat(field.value),
        'estimated': field.estimated,
        'date': field.info_date,
        ...getNoteIfExists(field)
    }
}


function labor_force_by_occupation(category) {
    const field = findFieldById(category, 219);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    // Ian's JSON presents only one date for the entire field
    // Even though the dates may exist separately and independently
    const datedSubfield = field.subfields.find(subfield => subfield.info_date);

    const occupation = Object.fromEntries(
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
        'occupation': occupation,
        'estimated': datedSubfield && datedSubfield.estimated,
        'date': datedSubfield && datedSubfield.info_date,
        ...getNoteIfExists(field)
    };
}


function unemployment_rate_overall(category) {
    const field = findFieldById(category, 220);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    return {
        'annual_values': field.subfields.map(subfield => subfieldForOneYear(subfield)),
        ...getNoteIfExists(field)
    };

}


function unemployment_rate_in_youth_ages_15_to_24(category) {
    const field = findFieldById(category, 373);

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
        'sections': sections,
        'estimated': datedSubfield && datedSubfield.estimated,
        'date': datedSubfield && datedSubfield.info_date,
        ...getNoteIfExists(field)
    };
}


function population_below_poverty_line(category) {
    const field = findFieldById(category, 221);

    if (!field) return null;
    return transmuteValueUnitDateField(field);
}


function gini_index_coefficient(category) {
    const field = findFieldById(category, 223);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    return {
        'annual_values': field.subfields.map(subfield => subfieldForOneYear(subfield)),
        ...getNoteIfExists(field)
    };
}


function household_income_by_percentage_share(category) {
    const field = findFieldById(category, 222);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    // Ian's JSON presents only one date for the entire field
    // Even though the dates may exist separately and independently
    const datedSubfield = field.subfields.find(subfield => subfield.info_date);

    const sections = Object.fromEntries(
        field.subfields
             .map(subfield => {
                const k = toSnakeCase(subfield.name.replace('10%', 'ten percent'));
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


function budget(category) {
    const field = findFieldById(category, 224);

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
                    'units': subfield.suffix || 'USD'
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


function taxes_and_other_revenues(category) {
    const field = findFieldById(category, 225);

    if (!field) return null;
    
    return {
        'percent_of_gdp': parseFloat(field.value),
        'estimated': field.estimated,
        'date': field.info_date,
        ...getNoteIfExists(field)
    };
}


function budget_surplus_or_deficit(category) {
    const field = findFieldById(category, 226);

    if (!field) return null;

    return {
        'percent_of_gdp': parseFloat(field.value),
        'estimated': field.estimated,
        'date': field.info_date,
        ...getNoteIfExists(field)
    };
}


function public_debt(category) {
    const field = findFieldById(category, 227);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    return {
        'annual_values': field.subfields.map(subfield => subfieldForOneYear(subfield)),
        ...getNoteIfExists(field)
    };
}


function fiscal_year(category) {
    const field = findFieldById(category, 228);

    if (!field) return null;
    
    const fromToRegex = /^(?<fromDate>\d+ \w+)\s+\-\s+(?<toDate>\d+ \w+)$/;
    const calendarYearStr = 'calendar year';

    if (field.value.toLowerCase() === calendarYearStr) {
        return {
            'start': '1 January',
            'end': '31 December'
        };
    }

    if (fromToRegex.test(field.value)) {
        const match = fromToRegex.exec(field.value);
        return {
            'start': match.groups.fromDate,
            'end': match.groups.toDate
        };
    }

    return transmuteHtmlToPlain(field.content);
}


function inflation_rate(category) {
    const field = findFieldById(category, 229);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    return {
        'annual_values': field.subfields.map(subfield => subfieldForOneYear(subfield)),
        ...getNoteIfExists(field)
    };
}


function current_account_balance(category) {
    const field = findFieldById(category, 238);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    return {
        'annual_values': field.subfields.map(subfield => subfieldForOneYear(subfield)),
        ...getNoteIfExists(field)
    };
}


function exports_total_value(category) {
    const field = findFieldById(category, 239);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);
    
    return {
        'annual_values': field.subfields.map(subfield => subfieldForOneYear(subfield)),
        ...getNoteIfExists(field)
    };
}


function exports_commodities(category) {
    const field = findFieldById(category, 240);

    if (!field) return null;

    const splitRegex = /[,;] /;
    
    return {
        'by_commodity': transmuteHtmlToPlain(field.value).split(splitRegex),
        ...getNoteIfExists(field)
    };
}


function exports_partners(category) {
    const field = findFieldById(category, 241);

    if (!field) return null;

    const splitRegex = /[,;] /;
    const singleCountryRegex = /^(?<countryName>.+)( )(?<percentageShare>[\d\.]+)%$/

    return {
        'by_country': transmuteHtmlToPlain(field.value)
                        .split(splitRegex)
                        .map(singleCountryEntry => {
                            const match = singleCountryRegex.exec(singleCountryEntry);
                            return {
                                'name': match.groups.countryName,
                                'percent': parseFloat(match.groups.percentageShare)
                            }
                        }),
        'date': field.info_date
    };
}


function imports_total_value(category) {
    const field = findFieldById(category, 242);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);
    
    return {
        'annual_values': field.subfields.map(subfield => subfieldForOneYear(subfield)),
        ...getNoteIfExists(field)
    };
}


function imports_commodities(category) {
    const field = findFieldById(category, 243);

    if (!field) return null;

    const splitRegex = /[,;] /;
    
    return {
        'by_commodity': transmuteHtmlToPlain(field.value).split(splitRegex),
        ...getNoteIfExists(field)
    };
}


function imports_partners(category) {
    const field = findFieldById(category, 403);

    if (!field) return null;

    const splitRegex = /[,;] /;
    const singleCountryRegex = /^(?<countryName>.+)( )(?<percentageShare>[\d\.]+)%$/

    return {
        'by_country': transmuteHtmlToPlain(field.value)
                        .split(splitRegex)
                        .map(singleCountryEntry => {
                            const match = singleCountryRegex.exec(singleCountryEntry);
                            return {
                                'name': match.groups.countryName,
                                'percent': parseFloat(match.groups.percentageShare)
                            }
                        }),
        'date': field.info_date
    };
}


function reserves_of_foreign_exchange_and_gold(category) {
    const field = findFieldById(category, 245);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);
    
    return {
        'annual_values': field.subfields.map(subfield => subfieldForOneYear(subfield)),
        ...getNoteIfExists(field)
    };
}


function external_debt(category) {
    const field = findFieldById(category, 246);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const regex = /^Debt - external (?<capturedDate>.+)$/;

    return {
        'annual_values': field.subfields.map(subfield => {
            const match = regex.exec(subfield.name);
            return {
                'value': parseFloat(subfield.value),
                'units': 'USD',
                'estimated': subfield.estimated,
                'date': match.groups.capturedDate
            }
        })
    };
}


function exchange_rates(category) {
    const field = findFieldById(category, 249);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const sfCurrency = findSubfieldByName(field, 'currency');

    if (!sfCurrency) return transmuteHtmlToPlain(field.content);

    return {
        'annual_values': field.subfields.filter(subfield => subfield !== sfCurrency).map(subfield => subfieldForOneYear(subfield)),
        'units': sfCurrency.value.replace(/\s\-$/, ''),
        ...getNoteIfExists(field)
    };
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