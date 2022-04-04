const fs = require('fs').promises;

const fsSync = require('fs');

function fileExists(uri) {
    return fsSync.existsSync(uri);
}

async function write(data, uri) {
    return fs.writeFile(uri, data, { encoding: 'utf-8' });
}

async function read(uri) {
    return fs.readFile(uri, { encoding: 'utf-8' });
}

module.exports.write = write;
module.exports.read = read;
module.exports.fileExists = fileExists;