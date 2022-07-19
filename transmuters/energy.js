const { findFieldById, findSubfieldByName, transmuteValueUnitDateSubfield, getNoteIfExists } = require("../transmuter");


const ID = "energy";

function energy(category) {
    return {
        'electricity': {
            'access': electricity_access(category),
            'production': extractFieldAndTransmute(category, 252, 'kWh'),
            'consumption': extractFieldAndTransmute(category, 253, 'kWh'),
            'exports': extractFieldAndTransmute(category, 254, 'kWh'),
            'imports': extractFieldAndTransmute(category, 255, 'kWh'),
            'installed_generating_capacity': extractFieldAndTransmute(category, 256, 'kW'),
            'by_source': {
                'fossil_fuels': extractFieldAndTransmute(category, 257, 'percent'),
                'nuclear_fuels': extractFieldAndTransmute(category, 258, 'percent'),
                'hydroelectric_plants': extractFieldAndTransmute(category, 259, 'percent'),
                'other_renewable_sources': extractFieldAndTransmute(category, 260, 'percent'),
            }
        },
        'crude_oil': {
            'production': extractFieldAndTransmute(category, 261, 'bbl_per_day'),
            'exports': extractFieldAndTransmute(category, 262, 'bbl_per_day'),
            'imports': extractFieldAndTransmute(category, 263, 'bbl_per_day'),
            'proved_reserves': extractFieldAndTransmute(category, 264, 'bbl'),
        },
        'refined_petroleum_products': {
            'production': extractFieldAndTransmute(category, 265, 'bbl_per_day'),
            'consumption': extractFieldAndTransmute(category, 266, 'bbl_per_day'),
            'exports': extractFieldAndTransmute(category, 267, 'bbl_per_day'),
            'imports': extractFieldAndTransmute(category, 268, 'bbl_per_day'),
        },
        'natural_gas': {
            'production': extractFieldAndTransmute(category, 269, 'cubic_metres'),
            'consumption': extractFieldAndTransmute(category, 270, 'cubic_metres'),
            'exports': extractFieldAndTransmute(category, 271, 'cubic_metres'),
            'imports': extractFieldAndTransmute(category, 272, 'cubic_metres'),
            'proved_reserves': extractFieldAndTransmute(category, 273, 'cubic_metres'),
        }
    };
}


function extractFieldAndTransmute(category, fieldId, units) {
    const field = findFieldById(category, fieldId);
    
    if (!field) return null;

    return {
        [units]: parseFloat(field.value),
        'estimated': field.estimated,
        'date': field.info_date,

        ...getNoteIfExists(field)
    };
}


function electricity_access(category) {
    const field = findFieldById(category, 251);

    if (!field) return null;

    const sfPopulationWithoutElectricity = findSubfieldByName(field, 'population without electricity');
    const sfTotalElectrification = findSubfieldByName(field, 'electrification - total population');
    const sfUrbanElectrification = findSubfieldByName(field, 'electrification - urban areas');
    const sfRuralElectrification = findSubfieldByName(field, 'electrification - rural areas');

    return {
        ...transmuteValueUnitDateSubfield(sfPopulationWithoutElectricity, 'population_without_electricity'),
        ...transmuteValueUnitDateSubfield(sfTotalElectrification, 'total_electrification'),
        ...transmuteValueUnitDateSubfield(sfUrbanElectrification, 'urban_electrification'),
        ...transmuteValueUnitDateSubfield(sfRuralElectrification, 'rural_electrification'),

        ...getNoteIfExists(field)
    };
}


module.exports.energy = energy;