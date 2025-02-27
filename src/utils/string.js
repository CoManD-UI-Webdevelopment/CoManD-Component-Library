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
    return names.join(" ")
}

export {capitalizeFirstLetter, lowercaseFirstLetter, fullName}