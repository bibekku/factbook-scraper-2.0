const { findFieldById, transmuteHtmlToPlain, findSubfieldByName } = require("../transmuter");


const ID = "environment";

function environment(category) {
    return {
        'current_issues': current_issues(category),
        'international_agreements': international_agreements(category),
        'air_pollutants': air_pollutants(category),
        'urbanization': urbanization(category),
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

    const sbUrbanPopulation = findSubfieldByName(field, 'urban population');
    const sbRateOfUrbanization = findSubfieldByName(field, 'rate of urbanization');

    return {
        ...sbUrbanPopulation && {
            'urban_population': {
                'value': parseFloat(sbUrbanPopulation.value),
                'units': sbUrbanPopulation.suffix,
                'date': sbUrbanPopulation.subfield_note,
            }
        },
        ...sbRateOfUrbanization && {
            'rate_of_urbanization': {
                'value': parseFloat(sbRateOfUrbanization.value),
                'units': sbRateOfUrbanization.suffix,
                'date': sbRateOfUrbanization.subfield_note
            }
        },
        ...field.field_note && {
            'note': transmuteHtmlToPlain(field.field_note)
        }
    };
}

































module.exports.environment = environment;