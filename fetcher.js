const got = require('got');

//TODO: use /geos/ format 
async function fetchCountryDataPage(countryName) {
    const URL_FORMAT = `https://www.cia.gov/the-world-factbook/page-data/countries/${countryName}/page-data.json`
    
    try {
        const { body } = await got(URL_FORMAT);
        return body;
    } catch (error) {
        return error;
    }
}

module.exports.fetchCountryDataPage = fetchCountryDataPage;
