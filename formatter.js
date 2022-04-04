function toKebabCase(string) {
    string = string.replace(/[,\(\)'"]/g, '');
    const regex = /\w+/g;
    return string.match(regex).join('-').toLowerCase();
}

modules.exports.toKebabCase = toKebabCase;
