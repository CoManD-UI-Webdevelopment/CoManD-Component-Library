function formatAddress(address, format) {
    let formatedAddress = ""

    if (format === "eu") {
        formatedAddress += address.street  + " " + address.number + "\n"
        formatedAddress += address.zip + " " + address.city + "\n"
    } else {
        formatedAddress += address.number  + " " + address.street + "\n"
        formatedAddress += address.city + ", "

        if(address.country) {
            formatedAddress += address.state + " "
        }

        formatedAddress += address.zip + "\n"
    }

    if(address.country) {
        formatedAddress += address.country + "\n"
    }

    if(address.misc) {
        formatedAddress += address.misc
    }

    return formatedAddress
}

export {formatAddress}