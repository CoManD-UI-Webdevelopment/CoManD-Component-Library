function capitalizeFirstLetter(string) {
    if(string) {
        return string.slice(0, 1).toUpperCase() + string.slice(1)
    }
    return ""
}

function lowercaseFirstLetter(string) {
    if(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    }
    return ""
}

function fullName(...names) {
    return names
    .filter(part => typeof part === 'string') // ignore non-strings like undefined/null
    .map(part => part.trim())                // trim spaces
    .filter(part => part.length > 0)         // skip empty strings
    .join(' ');                              // join with single space
}

export {capitalizeFirstLetter, lowercaseFirstLetter, fullName}