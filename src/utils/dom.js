function getOffsetTop(el) {
    if (el.offsetParent) {
        return el.offsetTop + getOffsetTop(el.offsetParent)
    }
    return el.offsetTop
}

function responsiveBodyClasses() {
    // function to detect device width and add appropriate class
    function updateBodyClass() {
        const body = document.body

        // Remove any previous width-based classes
        body.classList.remove('device-width-large', 'device-width-medium', 'device-width-small')

        // Add class based on width
        if (window.innerWidth <= 600) {
            body.classList.add('device-width-small')
        } else if (window.innerWidth <= 1024) {
            body.classList.add('device-width-medium')
        } else {
            body.classList.add('device-width-large')
        }
    }

    // initial class assignment
    updateBodyClass()

    // update the class on window resize
    window.addEventListener('resize', function() {
        updateBodyClass()
    });
}

export {responsiveBodyClasses, getOffsetTop}
