const got = require('got');

//TODO: use /geos/ format 
async function fetchCountryDataPage(countryCode) {
    const URL_FORMAT = `https://www.cia.gov/the-world-factbook/geos/${countryCode}.json`;

    try {
        const { body } = await got(URL_FORMAT);
        return body;
    } catch (error) {
        return error;
    }
}

module.exports.fetchCountryDataPage = fetchCountryDataPage;
