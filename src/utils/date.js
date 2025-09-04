function currentDate(returnTime = false) {
    return returnTime ? new Date().toISOString() : new Date().toISOString().split('T')[0];
}

function currentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return hours + ":" + minutes
}
  

function getDate(inputDate, operator = "+", days = 1) {
    const date = new Date(inputDate)

    if (operator === "+") {
        date.setDate(date.getDate() + days)
    } else if (operator === '-') {
        date.setDate(date.getDate() - days)
    } else {
        throw new Error("function 'getDate()' received invalid operator as parameter. Use '+' to add or '-' to subtract days.")
    }

    return date
}

function getWeekday(dateString, format = "short") {
    // Create date object from YYYY-MM-DD string
    const date = new Date(dateString);
  
    // Arrays for codes and full names
    const codes = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const fullNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    // Decide what to return
    if (format === "short") {
      return codes[date.getDay()];
    } else if (format === "long") {
      return fullNames[date.getDay()];
    } else {
      throw new Error("Invalid format. Use 'short' or 'long'.");
    }
}
  

function formatDate(inputDate, format = "dmy", separator= ".") {
    // Ensure the input is a valid date object or string
    const date = new Date(inputDate)

    if (isNaN(date)) {
        console.error("function 'formatDate()' received an invalid date as parameter. Provide date in format 'YYYY-MM-DD'");
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // months are zero-based
    const day = String(date.getDate()).padStart(2, '0') // days are zero-based
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

function formatTime(timeString = "00:00", format = 24, textAfter = "h") {
    const [hourString, minute] = timeString.split(":")
    let hour = parseInt(hourString, 10) // convert hourString to integer in decimal-system
    let time = ""
    format = format.toString() // convert format-parameter to string to allow strings and numbers

    if (format === "12") {
        const ampm = hour >= 12 ? "pm" : "am"
        hour = hour % 12 || 12 // Convert 0 to 12 for 12 AM
        time = `${hour}:${minute} ${ampm}`
        return time
    } else if (format === "24") {
        const paddedHour = hour.toString().padStart(2, "0");
        time = `${paddedHour}:${minute}`

        if (textAfter) {
           time += " " + textAfter
        }

        return time
    } else {
        throw new Error("function 'formatTime()' received invalid format as parameter. Provide format-parameter as 12 or 24.");
    }
}

export {currentDate, currentTime, getDate, getWeekday, formatDate, formatTime}