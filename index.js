const { fileExists, read, write } = require('./file');
const { fetchCountryDataPage } = require('./fetcher');
const { parseMainPage, parseCountry } = require('./parser');
const { transmuteGeographicCoordinates, transmuteArea, transmuteBorders } = require('./transmuter');
const { countries } = require('./constants/countries');

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const DEFAULT_SLEEP = 500; // ms

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

async function loopWithSleep(countries) {
    let country;
    let response;

    let backoffTime = 8000;
    for (let i = 0; i < countries.length; ++i) {
        country = countries[i];
        try {
            response = await getCountryJson(country);
            await sleep(DEFAULT_SLEEP);
        } catch(error) {
            // If CIA website throttles, wait for errorTimeout
            // then retry the same entry.
            // Exponential backoff to avoid getting flagged.
            await sleep(DEFAULT_SLEEP);
            backoffTime *= 2;
            --i;
            continue;
        }
    }
}


function main() {

    loopWithSleep(countries);

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

    // console.log(transmuteGeographicCoordinates('10 00 N, 49 00 E'));
    // console.log(transmuteGeographicCoordinates('60 00 S, 90 00 E (nominally), but the Southern Ocean has the unique distinction of being a '));
    // console.log(transmuteGeographicCoordinates('54 30 S, 37 00 W'));

    // console.log();
    // console.log(transmuteArea('28,748 sq km'));
    // console.log(transmuteArea('2,381,740 sq km'));
    // console.log(transmuteArea('14.2 million sq km'));
    // console.log(transmuteArea('134.2 million sq km (note: this is temporary)'));

    // console.log();
    // console.log(transmuteBorders('China 91 km; Iran 921 km; Pakistan 2,670 km; Tajikistan 1,357 km; Turkmenistan 804 km; Uzbekistan 144 km'));

}

main();
