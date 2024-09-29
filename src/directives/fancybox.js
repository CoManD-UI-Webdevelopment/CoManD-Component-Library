import {openFancyBox} from "comand-component-library"

function addClickHandlerToFancyboxLinks(fancyboxLinks) {
    for(let i = 0; i < fancyboxLinks.length; i++) {
        if (!fancyboxLinks[i].dataset.cmdFancyBoxHandlerRegistered) {
            fancyboxLinks[i].addEventListener("click", (event) => {
                event.preventDefault()
                openFancyBox({url: fancyboxLinks[i].href})
            })
            fancyboxLinks[i].dataset.cmdFancyBoxHandlerRegistered = "true"
        }
    }
}

const observer = new MutationObserver(onDomChange)

function onDomChange(mutationList) {
    const targetElements = []
    for(let i = 0; i < mutationList.length; i++) {
        if (mutationList[i].type === "attributes") {
            if(mutationList[i].target.classList.contains("fancybox")) {
                targetElements.push(mutationList[i].target)
            }
        } else if (mutationList[i].type === "childList") {
            let childNodes = Array.from(mutationList[i].addedNodes).filter((node) => {
                if(node.classList) {
                    return node.classList.contains("fancybox")
                }
                return false
            });
            if(childNodes.length) {
                targetElements.push(...childNodes)
            }
        }
    }
    if (targetElements.length > 0) {
        addClickHandlerToFancyboxLinks(targetElements)
    }
}

export default el => {
    // get initially loaded elements
    const fancyboxLinks = el.querySelectorAll(".fancybox")
    addClickHandlerToFancyboxLinks(fancyboxLinks)

    observer?.disconnect()
    observer.observe(el, {
        subtree: true, // observe nested elements
        childList: true,
        attributes: true,
        attributeFilter: ["class"], // set filter
        characterData: false
    })
}
