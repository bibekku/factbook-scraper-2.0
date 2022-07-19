const { findFieldById, findSubfieldByName, getNoteIfExists, transmuteHtmlToPlain } = require("../transmuter");


const ID = "communications";

function communications(category) {
    return {
        "telephones": {
            "fixed_lines": telephones_fixed_lines(category),
            "mobile_cellular": telephones_mobile_cellular(category),
        },
        "telecommunication_systems": telecommunication_systems(category),
        "broadcast_media": broadcast_media(category),
        "internet": {
            "country_code": country_code(category),
            "users": internet_users(category)
        },
        "broadband": {
            "fixed_subscriptions": broadband_fixed_subscriptions(category)
        }
    };
}


function telephones_fixed_lines(category) {
    const field = findFieldById(category, 196);

    if (!field) return null;

    const sfTotal = findSubfieldByName(field, 'total subscriptions');
    const sfPer100 = findSubfieldByName(field, 'subscriptions per 100 inhabitants');

    return {
        ...sfTotal && {
            'total_subscriptions': parseFloat(sfTotal.value),
        },
        ...sfPer100 && {
            'subscriptions_per_one_hundred_inhabitants': parseFloat(sfPer100.value),
            'estimated': sfPer100.estimated,
            'date': sfPer100.info_date
        },
        ...getNoteIfExists(field)
    };
}


function telephones_mobile_cellular(category) {
    const field = findFieldById(category, 197);

    if (!field) return null;

    const sfTotal = findSubfieldByName(field, 'total subscriptions');
    const sfPer100 = findSubfieldByName(field, 'subscriptions per 100 inhabitants');

    return {
        ...sfTotal && {
            'total_subscriptions': parseFloat(sfTotal.value),
        },
        ...sfPer100 && {
            'subscriptions_per_one_hundred_inhabitants': parseFloat(sfPer100.value),
            'estimated': sfPer100.estimated,
            'date': sfPer100.info_date
        },
        ...getNoteIfExists(field)
    };
}


function telecommunication_systems(category) {
    const field = findFieldById(category, 198);

    if (!field) return null;

    const sfGeneralAssessment = findSubfieldByName(field, 'general assessment');
    const sfDomestic = findSubfieldByName(field, 'domestic');
    const sfInternational = findSubfieldByName(field, 'international');

    return {
        ...sfGeneralAssessment && {
            'general_assessment': transmuteHtmlToPlain(sfGeneralAssessment.content),
        },
        ...sfDomestic && {
            'domestic': transmuteHtmlToPlain(sfDomestic.content),
        },
        ...sfInternational && {
            'international': transmuteHtmlToPlain(sfInternational.content)
        },
        ...getNoteIfExists(field)
    };
}


function broadcast_media(category) {
    const field = findFieldById(category, 199);

    if (!field) return null;

    return {
        'description': transmuteHtmlToPlain(field.value),
        'date': field.info_date,
        ...getNoteIfExists(field)
    };
}


function country_code(category) {
    const field = findFieldById(category, 202);

    if (!field) return null;

    return field.value;
}


function internet_users(category) {
    const field = findFieldById(category, 204);

    if (!field) return null;

    const sfTotal = findSubfieldByName(field, 'total');
    const sfPercentOfPopulation = findSubfieldByName(field, 'percent of population');

    return {
        ...sfTotal && {
            'total': parseFloat(sfTotal.value),
        },
        ...sfPercentOfPopulation && {
            'percent_of_population': parseFloat(sfPercentOfPopulation.value),
            'estimated': sfPercentOfPopulation.estimated,
            'date': sfPercentOfPopulation.info_date
        },
        ...getNoteIfExists(field)
    };

}


function broadband_fixed_subscriptions(category) {
    const field = findFieldById(category, 206);

    if (!field) return null;

    const sfTotal = findSubfieldByName(field, 'total');
    const sfPer100 = findSubfieldByName(field, 'subscriptions per 100 inhabitants');

    return {
        ...sfTotal && {
            'total_subscriptions': parseFloat(sfTotal.value),
        },
        ...sfPer100 && {
            'subscriptions_per_one_hundred_inhabitants': parseFloat(sfPer100.value),
            'estimated': sfPer100.estimated,
            'date': sfPer100.info_date
        },
        ...getNoteIfExists(field)
    };
}

module.exports.communications = communications;