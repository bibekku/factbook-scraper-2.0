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


function removeCommasBetweenNumerals(string) {
    const regex = /(?<=\d)(,\s?)(?=\d)/g;
    return string.replaceAll(regex, '');
}


// https://stackoverflow.com/a/25060605/8161267
function splitNoParen(s) {
    var left= 0, right= 0, A= [], M= s.match(/([^()]+)|([()])/g), L= M.length, next, str= '';
    for(var i= 0; i<L; i++){
        next= M[i];
        if(next=== '(')++left;
        else if(next=== ')')++right;
        if(left!== 0){
            str+= next;
            if(left=== right){
                A[A.length-1]+=str;
                left= right= 0;
                str= '';
            }
        }
        else A=A.concat(next.match(/([^,]+)/g));
    }
    return A;
}


module.exports.toKebabCase = toKebabCase;
module.exports.toSnakeCase = toSnakeCase;
module.exports.removeCommasBetweenNumerals = removeCommasBetweenNumerals;
module.exports.splitNoParen = splitNoParen;
