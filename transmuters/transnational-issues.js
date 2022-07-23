const { findFieldById, transmuteHtmlToPlain, findSubfieldByName } = require("../transmuter");


const ID = 'transnational_issues';

function transnational_issues(category) {
    return {
        'disputes': disputes(category),
        'refugees_and_iternally_displaced_persons': refugees_and_iternally_displaced_persons(category),
    };
}


function disputes(category) {
    const field = findFieldById(category, 326);
    
    if (!field) return null;

    return transmuteHtmlToPlain(field.value)
                .replaceAll('\n', ';')
                .split(';')
                .filter(Boolean)
                .map(line => line.trim());
}

//TODO: use splitNoParenSemicolon and write splitters
function refugees_and_iternally_displaced_persons(category) {
    const field = findFieldById(category, 327);

    if (!field) return null;

    const sfRefugees = findSubfieldByName(field, 'refugees (country of origin)');
    const sfIdps = findSubfieldByName(field, 'IDPs');
    const sfStatelessPersons = findSubfieldByName(field, 'stateless persons');

    return {
        ...sfRefugees && {

        }
    };
}


module.exports.transnational_issues = transnational_issues;