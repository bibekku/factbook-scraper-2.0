const { findFieldById, transmuteHtmlToPlain, findSubfieldByName, getNoteIfExists, transmuteValueUnitDateSubfield, transmuteValueUnitDateField } = require("../transmuter");

const ID = "environment";

function environment(category) {
    return {
        'current_issues': current_issues(category),
        'international_agreements': international_agreements(category),
        'air_pollutants': air_pollutants(category),
        'revenue_from_natural_resources': {
            'forest': revenue_from_forest_resources(category),
            'coal': revenue_from_coal(category),
        },
        'food_insecurity': food_insecurity(category),
        'waste_and_recycling': waste_and_recycling(category),
        'total_water_withdrawal': total_water_withdrawal(category),
        'total_renewable_water_resources': total_renewable_water_resources(category),
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
        ...getNoteIfExists(field)
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


function food_insecurity(category) {
    const field = findFieldById(category, 418);

    if (!field) return null;

    // This field, whenever it exists, always contains EXACTLY one subfield
    // https://www.cia.gov/the-world-factbook/field/food-insecurity/

    const subfield = field.subfields[0];

    return {
        'severity': subfield.name,
        'description': transmuteHtmlToPlain(subfield.value),
        'date': subfield.info_date
    };
}


function waste_and_recycling(category) {
    const field = findFieldById(category, 422);

    if (!field) return null;

    const sfGenerated = findSubfieldByName(field, 'municipal solid waste generated annually');
    const sfRecycled = findSubfieldByName(field, 'municipal solid waste recycled annually');
    const sfRecycledPercentage = findSubfieldByName(field, 'percent of municipal solid waste recycled');

    return {
        ...transmuteValueUnitDateSubfield(sfGenerated, 'municipal_solid_waste_generated_annually'),
        ...transmuteValueUnitDateSubfield(sfRecycled, 'municipal_solid_waste_recycled_annually'),
        ...transmuteValueUnitDateSubfield(sfRecycledPercentage, 'percent_of_municipal_solid_waste_recycled'),

        ...getNoteIfExists(field)
    };
}


function total_water_withdrawal(category) {
    const field = findFieldById(category, 417);

    if (!field) return null;

    const sfMunicipal = findSubfieldByName(field, 'municipal');
    const sfIndustrial = findSubfieldByName(field, 'industrial');
    const sfAgricultural = findSubfieldByName(field, 'agricultural');

    return {
        ...transmuteValueUnitDateSubfield(sfMunicipal, 'municipal'),
        ...transmuteValueUnitDateSubfield(sfIndustrial, 'industrial'),
        ...transmuteValueUnitDateSubfield(sfAgricultural, 'agricultural'),

        ...getNoteIfExists(field)
    };

}


function total_renewable_water_resources(category) {
    const field = findFieldById(category, 290);

    if (!field) return null;

    return transmuteValueUnitDateField(field);
}

module.exports.environment = environment;