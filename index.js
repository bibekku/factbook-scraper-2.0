const { fileExists, read, write } = require('./file');
const { fetchCountryDataPage } = require('./fetcher');

const got = require('got');

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
            const parsed = JSON.parse(data);
            console.log(parsed.result.data.country.json);
        })
}

main();
