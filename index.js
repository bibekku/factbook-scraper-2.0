const { fileExists, read, write } = require('./file');
const { fetchCountryDataPage } = require('./fetcher');
const { parseMainPage, parseCountry } = require('./parser');

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
    getCountryJson('afghanistan')
        .then((data) => {});

    read('./cache/afghanistan.json')
        .then((data) => {
            return parseMainPage(data);
        })
        .then((data) => {
            return parseCountry(data);
        })
        .then((data) => {
            write(JSON.stringify(data), './cache/out.json')
        });
}

main();
