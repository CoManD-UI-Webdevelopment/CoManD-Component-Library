function fullName(firstName, middleName = null, lastName) {
    let fullName = ""
    fullName += firstName + " "

    if(middleName) {
        fullName += middleName + " "
    }

    fullName += lastName
    return fullName
}

export {fullName}