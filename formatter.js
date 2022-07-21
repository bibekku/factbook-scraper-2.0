function toKebabCase(string) {
    string = string.replace(/[,\(\)'"]/g, '');
    const regex = /\w+/g;
    return string.match(regex).join('-').toLowerCase();
}


function toSnakeCase(string) {
    string = string.replace(/[,\(\)'"]/g, '');
    const regex = /\w+/g;
    return string.match(regex).join('_').toLowerCase();
}


module.exports.toKebabCase = toKebabCase;
module.exports.toSnakeCase = toSnakeCase;
