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

function fullName(firstName, middleName = null, lastName) {
    let fullName = ""
    fullName += firstName + " "

    if(middleName) {
        fullName += middleName + " "
    }

    fullName += lastName
    return fullName
}

export {capitalizeFirstLetter, lowercaseFirstLetter, fullName}