const cookieDisclaimerCookieName = "acceptedCookies"

function setCookieDisclaimerCookie(listOfAcceptedCookies, daysToExpire = 365) {
    const cookie = [...getCookieDisclaimerCookie(), ...listOfAcceptedCookies].join(",")
    let expires = ""
    const date = new Date()
    date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000)
    expires = "; expires=" + date.toUTCString()
    document.cookie = cookieDisclaimerCookieName + "=" + encodeURIComponent(cookie) + expires + "; SameSite=strict; path=/"
}

function getCookieDisclaimerCookie() {
    const cookie = document.cookie.split(";").map((cookie)=> {
        return cookie.trim()
    }).find((cookie) => {
        return cookie.startsWith(cookieDisclaimerCookieName + "=")
    })

    if(cookie) {
        const indexOfEqualSign = cookie.indexOf("=")
        return decodeURIComponent(cookie.slice(indexOfEqualSign + 1)).split(",")
    }

    return []
}

export {setCookieDisclaimerCookie, getCookieDisclaimerCookie}

