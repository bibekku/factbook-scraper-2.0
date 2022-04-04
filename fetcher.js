const got = require('got');

async function fetchCountryDataPage(countryName) {
    const URL_FORMAT = `https://www.cia.gov/the-world-factbook/page-data/countries/${countryName}/page-data.json`
    
    try {
        const { body } = await got(URL_FORMAT);
        console.log(typeof body);
        return body;
    } catch (error) {
        return error;
    }
}

module.exports.fetchCountryDataPage = fetchCountryDataPage;
