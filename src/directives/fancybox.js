import {openFancyBox} from "../components/CmdFancyBox.vue"
function addClickHandlerToFancyboxLinks(fancyboxLinks) {
    for(let i = 0; i < fancyboxLinks.length; i++) {
        fancyboxLinks[i].addEventListener("click", (event) => {
            event.preventDefault()
            openFancyBox({url: fancyboxLinks[i].href})
        })
    }
}

export default {
    // el = real dom-element
    mounted(el) {
        // get initially loaded elements
        const fancyboxLinks = el.querySelectorAll(".fancybox")
        addClickHandlerToFancyboxLinks(fancyboxLinks)

        // get elements added later to dom (and watched by mutationObserver)
        const observer = new MutationObserver((mutationList) => {
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
                    })
                    if(childNodes.length) {
                        targetElements.push(...childNodes)
                    }
                }
            }
            addClickHandlerToFancyboxLinks(targetElements)
        })

        observer.observe(el, {
            subtree: true, // observe nested elements
            childList: true,
            attributeFilter: ["class"], // set filter
            characterData: false // observe text changes
        })
    }
}