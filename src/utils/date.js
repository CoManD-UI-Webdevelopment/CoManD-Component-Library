function currentDate(returnTime = false) {
    return returnTime ? new Date().toISOString() : new Date().toISOString().split('T')[0];
}

function formatDate(inputDate, format = "dmy", separator=".") {
    // Ensure the input is a valid date object or string
    const date = new Date(inputDate);

    if (isNaN(date)) {
        console.error("function formatDate received an invalid date as parameter. Provide date in format YYYY-MM-DD");
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    let dateFormated = ""

    switch (format) {
        case 'dmy':
            dateFormated = `${day}${separator}${month}${separator}${year}` // DD-MM-YYYY
            break
        case 'mdy':
            dateFormated = `${month}${separator}${day}${separator}${year}` // MM-DD-YYYY
            break
        default:
            dateFormated = `${year}${separator}${month}${separator}${day}` // YYYY-MM-DD
    }

    return dateFormated
}

export {currentDate, formatDate}