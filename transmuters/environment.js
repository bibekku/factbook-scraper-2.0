const { findFieldById, transmuteHtmlToPlain, findSubfieldByName } = require("../transmuter");


const ID = "environment";

function environment(category) {
    return {
        'current_issues': current_issues(category),
        'international_agreements': international_agreements(category),
        'air_pollutants': air_pollutants(category),
        'urbanization': urbanization(category),
        'revenue_from_natural_resources': {
            'forest': revenue_from_forest_resources(category),
            'coal': revenue_from_coal(category),
        },
        'major_infectious_diseases': major_infectious_diseases(category),
    };
}


function current_issues(category) {
    const field = findFieldById(category, 293);

    if (!field) return null;

    return transmuteHtmlToPlain(field.value).split('; ');
}


function international_agreements(category) {
    const field = findFieldById(category, 294);

    if (!field) return null;

    const sfPartyTo = findSubfieldByName(field, "party to");
    const sfSignedButNotRatified = findSubfieldByName(field, "signed, but not ratified");

    return {
        ...sfPartyTo && {
            'party_to': transmuteHtmlToPlain(sfPartyTo.value).split(', ')
        }, 
        ...sfSignedButNotRatified && {
            'signed_but_not_ratified': transmuteHtmlToPlain(sfSignedButNotRatified.value).split(', ')
        }
    };
}


function air_pollutants(category) {
    const field = findFieldById(category, 416);

    if (!field) return null;

    const sfParticulateMatter = findSubfieldByName(field, "particulate matter emissions");
    const sfCarbonDioxide = findSubfieldByName(field, "carbon dioxide emissions");
    const sfMethane = findSubfieldByName(field, "methane");

    return {
        ...sfParticulateMatter && {
            'particulate_matter': {
                'value': parseFloat(sfParticulateMatter.value),
                'units': sfParticulateMatter.suffix,
                'estimated': sfParticulateMatter.estimated,
                'date': sfParticulateMatter.info_date
            }
        },
        ...sfCarbonDioxide && {
            'carbon_dioxide': {
                'value': parseFloat(sfCarbonDioxide.value),
                'units': sfCarbonDioxide.suffix,
                'estimated': sfCarbonDioxide.estimated,
                'date': sfCarbonDioxide.info_date
            }
        },
        ...sfMethane && {
            'methane': {
                'value': parseFloat(sfMethane.value),
                'units': sfMethane.suffix,
                'estimated': sfMethane.estimated,
                'date': sfMethane.info_date
            }
        },
        ...field.field_note && {
            'note': transmuteHtmlToPlain(field.field_note)
        }
    };
}

// TODO: move this to people and society
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
        ...field.field_note && {
            'note': transmuteHtmlToPlain(field.field_note)
        }
    };
}


function revenue_from_forest_resources(category) {
    const field = findFieldById(category, 420);

    if (!field) return null;

    const sfForestRevenues = findSubfieldByName(field, 'forest revenues');

    return sfForestRevenues && {
        'value': parseFloat(sfForestRevenues.value),
        'units': 'percent_of_gdp',
        'estimated': sfForestRevenues.estimated,
        'date': sfForestRevenues.info_date
    };
}


function revenue_from_coal(category) {
    const field = findFieldById(category, 421);

    if (!field) return null;

    const sfCoalRevenues = findSubfieldByName(field, 'coal revenues');

    return sfCoalRevenues && {
        'value': parseFloat(sfCoalRevenues.value),
        'units': 'percent_of_gdp',
        'estimated': sfCoalRevenues.estimated,
        'date': sfCoalRevenues.info_date
    };
}


// TODO: move this to people and society
function major_infectious_diseases(category) {
    const field = findFieldById(category, 366);

    if (!field) return null;

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
        ...field.field_note && {
            'note': transmuteHtmlToPlain(field.field_note)
        }
    };
}
























module.exports.environment = environment;