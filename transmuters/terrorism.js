const { transmuteHtmlToPlain, findFieldById, getNoteIfExists } = require("../transmuter");

const ID = "terrorism";

function terrorism(category) {    
    return {
        'terrorist_groups': terrorist_groups(category)
    };
}

function terrorist_groups(category) {
    const field = findFieldById(category, 413);
    
    if (!field) return null;

    return {
        'groups': transmuteHtmlToPlain(field.value).split('; '),
        ...getNoteIfExists(field),
    }
}

module.exports.terrorism = terrorism;