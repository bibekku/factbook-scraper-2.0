function toKebabCase(string) {
    string = string.replace(/[,\(\)'"]/g, '');
    const regex = /\w+/g;
    return string.match(regex).join('-').toLowerCase();
}

module.exports.toKebabCase = toKebabCase;
