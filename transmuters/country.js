const { findCategoryById } = require('../transmuter');
const { communications } = require('./communications');
const { economy } = require('./economy');
const { energy } = require('./energy');
const { environment } = require('./environment');
const { geography } = require('./geography');
const { government } = require('./government');
const { introduction } = require('./introduction');
const { military_and_security } = require('./military-and-security');
const { people } = require('./people-and-society');
const { transportation } = require('./transportation');

function transmuteCountry(country) {
    return {
        'name': country.name,
        'data': {
            'introduction': introduction(findCategoryById(country, 'introduction')),
            'geography': geography(findCategoryById(country, 'geography')),
            'people': people(findCategoryById(country, 'people_and_society')),
            'environment': environment(findCategoryById(country, 'environment')),
            'government': government(findCategoryById(country, 'government')),
            'economy': economy(findCategoryById(country, 'economy')),
            'energy': energy(findCategoryById(country, 'energy')),
            'communications': communications(findCategoryById(country, 'communications')),
            'transportation': transportation(findCategoryById(country, 'transportation')),
            'military_and_security': military_and_security(findCategoryById(country, 'military_and_security')),
        }
    };
}

module.exports.transmuteCountry = transmuteCountry;