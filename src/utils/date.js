function currentDate(returnTime = false) {
    return returnTime ? new Date().toISOString() : new Date().toISOString().split('T')[0];
}

function getDate(inputDate, operator = "+", days = 1) {
    const date = new Date(inputDate)

    if (operator === "+") {
        date.setDate(date.getDate() + days);
    } else if (operator === '-') {
        date.setDate(date.getDate() - days);
    } else {
        throw new Error("function 'getDate' received invalid operator as parameter. Use '+' to add or '-' to subtract days.")
    }

    return date
}

function formatDate(inputDate, format = "dmy", separator= ".") {
    // Ensure the input is a valid date object or string
    const date = new Date(inputDate);

    if (isNaN(date)) {
        console.error("function 'formatDate' received an invalid date as parameter. Provide date in format YYYY-MM-DD");
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are zero-based
    const day = String(date.getDate()).padStart(2, '0'); // days are zero-based
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

function formatTime(timeString, format = '24') {
    const [hourString, minute] = timeString.split(':');
    let hour = parseInt(hourString, 10);

    if (format === '12') {
        const ampm = hour >= 12 ? 'pm' : 'am';
        hour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
        return `${hour}:${minute} ${ampm}`;
    } else if (format === '24') {
        const paddedHour = hour.toString().padStart(2, '0');
        return `${paddedHour}:${minute}`;
    } else {
        throw new Error("invalid format for function 'formatTime' specified. Use '12' or '24'.");
    }
}

export {currentDate, formatDate, formatTime}