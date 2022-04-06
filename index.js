const { fileExists, read, write } = require('./file');
const { fetchCountryDataPage } = require('./fetcher');
const { parseMainPage, parseCountry } = require('./parser');
const { transmuteGeographicCoordinates } = require('./transmuter');

async function cacheAndReturn(data, uri) {
    await write(data, uri);
    return Promise.resolve(data);
}


async function getCountryJson(countryName) {
    const uri = `./cache/${countryName}.json`;

    if (!fileExists(uri)) {
        return fetchCountryDataPage(countryName)
                .then((data) => cacheAndReturn(data, uri));
    } else {
        return read(uri);
    }
}


function main() {

    // const country = 'afghanistan';

    // getCountryJson(country)
    //     .then((data) => {});

    // read('./cache/afghanistan.json')
    //     .then((data) => {
    //         return parseMainPage(data);
    //     })
    //     .then((data) => {
    //         write(JSON.stringify(data), `./output/mid-${country}.json`)
    //         return data;
    //     })
    //     .then((data) => {
    //         return parseCountry(data);
    //     })
    //     .then((data) => {
    //         write(JSON.stringify(data), `./output/out-${country}.json`)
    //     });

    console.log(transmuteGeographicCoordinates('10 00 N, 49 00 E'));
    console.log(transmuteGeographicCoordinates('60 00 S, 90 00 E (nominally), but the Southern Ocean has the unique distinction of being a '));
    console.log(transmuteGeographicCoordinates('54 30 S, 37 00 W'));

}

main();
