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
        'sex_ratio': sex_ratio(category),
        'mothers_mean_age_at_first_birth': extractFieldAndTransmute(category, 352, 'age'),
        'maternal_mortality_rate': extractFieldAndTransmute(category, 353, 'deaths_per_100k_live_births'),
        'infant_mortality_rate': infant_mortality_rate(category),
        'life_expectancy_at_birth': life_expectancy_at_birth(category),
        'total_fertility_rate': extractFieldAndTransmute(category, 356, 'children_born_per_woman'),
        'contraceptive_prevalence_rate': contraceptive_prevalence_rate(category),
        'physicians_density': extractFieldAndTransmute(category, 359, 'physicians_per_1000_population'),
        'hospital_bed_density': extractFieldAndTransmute(category, 360, 'beds_per_1000_population'),
        'current_health_expenditure': extractFieldAndTransmute(category, 409, 'percent_of_gdp'),
        'drinking_water_source': drinking_water_source(category),
        'sanitation_facility_access': sanitation_facility_access(category),
        'hiv_aids': {
            'adult_prevalence_rate': extractFieldAndTransmute(category, 363, 'percent_of_adults'),
            'people_living_with_hiv_aids': extractFieldAndTransmute(category, 364, 'total'),
            'deaths': extractFieldAndTransmute(category, 365, 'total'),
        },
        'major_infectious_diseases': major_infectious_diseases(category),
        'adult_obesity': extractFieldAndTransmute(category, 367, 'percent_of_adults'),
        'underweight_children': extractFieldAndTransmute(category, 368, 'percent_of_children_under_the_age_of_five'),
        'education_expenditures': extractFieldAndTransmute(category, 369, 'percent_of_gdp'),
        'literacy': literacy(category),
        'school_life_expectancy': school_life_expectancy(category),
        'youth_unemployment': youth_unemployment(category),
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
                let name = subfield.name;
                name = name.replace('years', '');
                name = name.replace('-', ' to ');

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


// TODO: major urban areas


function sex_ratio(category) {
    const field = findFieldById(category, 351);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    // Ian's JSON presents only one date for the entire field
    // Even though the dates may exist separately and independently
    const datedSubfield = field.subfields.find(subfield => subfield.info_date);

    const sfTotalPopulation = findSubfieldByName(field, 'total population');

    const byAge = Object.fromEntries(
        field.subfields
             .filter(subfield => subfield.name !== 'total population')
             .map(subfield => {
                let name = subfield.name;
                name = name.replace('-', ' to ');
                
                const k = toSnakeCase(name);

                if (!subfield.value) return [k, 'NA'];

                const v = {
                    'value': parseFloat(subfield.value),
                    'units': subfield.suffix,
                };
                return [k, v];
             })
    );

    return {
        'by_age': byAge,
        ...sfTotalPopulation && {
            'total_population': {
                'value': parseFloat(sfTotalPopulation.value),
                'units': sfTotalPopulation.suffix
            }
        },
        'estimated': datedSubfield && datedSubfield.estimated,
        'date': datedSubfield && datedSubfield.info_date,
        ...getNoteIfExists(field)
    };
}


function infant_mortality_rate(category) {
    const field = findFieldById(category, 354);

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
                    'units': 'deaths_per_1000_live_births'
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


function life_expectancy_at_birth(category) {
    const field = findFieldById(category, 355);

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


function contraceptive_prevalence_rate(category) {
    const field = findFieldById(category, 357);

    if (!field) return null;

    return transmuteValueUnitDateField(field);
}


function drinking_water_source(category) {
    const field = findFieldById(category, 361);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const sfUrbanImproved = findSubfieldByName(field, 'improved: urban');
    const sfRuralImproved = findSubfieldByName(field, 'improved: rural');
    const sfTotalImproved = findSubfieldByName(field, 'improved: total');

    const sfUrbanUnimproved = findSubfieldByName(field, 'unimproved: urban');
    const sfRuralUnimproved = findSubfieldByName(field, 'unimproved: rural');
    const sfTotalUnimproved = findSubfieldByName(field, 'unimproved: total');

    const datedSubfield = field.subfields.find(subfield => subfield.info_date);

    return {
        'improved': {
            ...sfUrbanImproved && {
                'urban': {
                    'value': parseFloat(sfUrbanImproved.value),
                    'units': sfUrbanImproved.suffix,
                    'subfield_note': sfUrbanImproved.subfield_note,
                }
            },
            ...sfRuralImproved && {
                'rural': {
                    'value': parseFloat(sfRuralImproved.value),
                    'units': sfRuralImproved.suffix,
                    'subfield_note': sfRuralImproved.subfield_note,
                }
            },
            ...sfTotalImproved && {
                'total': {
                    'value': parseFloat(sfTotalImproved.value),
                    'units': sfTotalImproved.suffix,
                    'subfield_note': sfTotalImproved.subfield_note,
                }
            },
        },
        'unimproved': {
            ...sfUrbanUnimproved && {
                'urban': {
                    'value': parseFloat(sfUrbanUnimproved.value),
                    'units': sfUrbanUnimproved.suffix,
                    'subfield_note': sfUrbanUnimproved.subfield_note,
                }
            },
            ...sfRuralUnimproved && {
                'rural': {
                    'value': parseFloat(sfRuralUnimproved.value),
                    'units': sfRuralUnimproved.suffix,
                    'subfield_note': sfRuralUnimproved.subfield_note,
                }
            },
            ...sfTotalUnimproved && {
                'total': {
                    'value': parseFloat(sfTotalUnimproved.value),
                    'units': sfTotalUnimproved.suffix,
                    'subfield_note': sfTotalUnimproved.subfield_note,
                }
            },
        },
        'estimated': datedSubfield && datedSubfield.estimated,
        'date': datedSubfield && datedSubfield.info_date,
        ...getNoteIfExists(field)
    };
}


function sanitation_facility_access(category) {
    const field = findFieldById(category, 398);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const sfUrbanImproved = findSubfieldByName(field, 'improved: urban');
    const sfRuralImproved = findSubfieldByName(field, 'improved: rural');
    const sfTotalImproved = findSubfieldByName(field, 'improved: total');

    const sfUrbanUnimproved = findSubfieldByName(field, 'unimproved: urban');
    const sfRuralUnimproved = findSubfieldByName(field, 'unimproved: rural');
    const sfTotalUnimproved = findSubfieldByName(field, 'unimproved: total');

    const datedSubfield = field.subfields.find(subfield => subfield.info_date);

    return {
        'improved': {
            ...sfUrbanImproved && {
                'urban': {
                    'value': parseFloat(sfUrbanImproved.value),
                    'units': sfUrbanImproved.suffix,
                    'subfield_note': sfUrbanImproved.subfield_note,
                }
            },
            ...sfRuralImproved && {
                'rural': {
                    'value': parseFloat(sfRuralImproved.value),
                    'units': sfRuralImproved.suffix,
                    'subfield_note': sfRuralImproved.subfield_note,
                }
            },
            ...sfTotalImproved && {
                'total': {
                    'value': parseFloat(sfTotalImproved.value),
                    'units': sfTotalImproved.suffix,
                    'subfield_note': sfTotalImproved.subfield_note,
                }
            },
        },
        'unimproved': {
            ...sfUrbanUnimproved && {
                'urban': {
                    'value': parseFloat(sfUrbanUnimproved.value),
                    'units': sfUrbanUnimproved.suffix,
                    'subfield_note': sfUrbanUnimproved.subfield_note,
                }
            },
            ...sfRuralUnimproved && {
                'rural': {
                    'value': parseFloat(sfRuralUnimproved.value),
                    'units': sfRuralUnimproved.suffix,
                    'subfield_note': sfRuralUnimproved.subfield_note,
                }
            },
            ...sfTotalUnimproved && {
                'total': {
                    'value': parseFloat(sfTotalUnimproved.value),
                    'units': sfTotalUnimproved.suffix,
                    'subfield_note': sfTotalUnimproved.subfield_note,
                }
            },
        },
        'estimated': datedSubfield && datedSubfield.estimated,
        'date': datedSubfield && datedSubfield.info_date,
        ...getNoteIfExists(field)
    };
}


function major_infectious_diseases(category) {
    const field = findFieldById(category, 366);

    if (!field) return null;

    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    const sfDegreeOfRisk = findSubfieldByName(field, 'degree of risk');
    const sfFoodWaterborne = findSubfieldByName(field, 'food or waterborne diseases');
    const sfVectorborne = findSubfieldByName(field, 'vectorborne diseases');
    const sfWaterContact = findSubfieldByName(field, 'water contact diseases');
    const sfAerosolizedDust = findSubfieldByName(field, 'aerosolized dust or soil contact diseases');
    const sfRespiratory = findSubfieldByName(field, 'respiratory diseases');
    const sfAnimalContact = findSubfieldByName(field, 'animal contact diseases');

    return {
        ...sfDegreeOfRisk && {
            'degree_of_risk': sfDegreeOfRisk.value
        },
        ...sfFoodWaterborne && {
            'food_or_waterborne_diseases': sfFoodWaterborne.value
        },
        ...sfVectorborne && {
            'vectorborne_diseases': sfVectorborne.value
        },
        ...sfWaterContact && {
            'water_contact_diseases': sfWaterContact.value
        },
        ...sfAerosolizedDust && {
            'aerosolized_dust_or_soil_contact_diseases': sfAerosolizedDust.value
        },
        ...sfRespiratory && {
            'respiratory_diseases': sfRespiratory.value
        },
        ...sfAnimalContact && {
            'animal_contact_diseases': sfAnimalContact.value
        },
        ...getNoteIfExists(field)
    };
}


function literacy(category) {
    const field = findFieldById(category, 370);

    if (!field) return null;
    if (!field.subfields) return transmuteHtmlToPlain(field.content);

    // Ian's JSON presents only one date for the entire field
    // Even though the dates may exist separately and independently
    const datedSubfield = field.subfields.find(subfield => subfield.info_date);

    const sfDefinition = findSubfieldByName(field, 'definition');

    const sections = Object.fromEntries(
        field.subfields
             .filter(subfield => subfield.name !== 'definition')
             .map(subfield => {
                const k = toSnakeCase(subfield.name);

                if (!subfield.value) return [k, 'NA'];

                const v = {
                    'value': parseFloat(subfield.value),
                    'units': subfield.suffix,
                };
                return [k, v];
             })
    );

    return {
        'definition': sfDefinition && sfDefinition.value,
        ...sections,
        'estimated': datedSubfield && datedSubfield.estimated,
        'date': datedSubfield && datedSubfield.info_date,
        ...getNoteIfExists(field)
    };
}


function school_life_expectancy(category) {
    const field = findFieldById(category, 371);

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


function youth_unemployment(category) {
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
        ...sections,
        'estimated': datedSubfield && datedSubfield.estimated,
        'date': datedSubfield && datedSubfield.info_date,
        ...getNoteIfExists(field)
    };
}

module.exports.people = people;