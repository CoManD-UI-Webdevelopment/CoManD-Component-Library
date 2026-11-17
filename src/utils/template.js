/*
template.js - activates the template-css (look and feel) of comand-frontend-framework

The template-css files are NEVER copied or bundled into this library. They stay in comand-frontend-framework
(dist/templates/*.css). The application (which can resolve its installed framework) tells the library where they are:

    // in the app (Vite): URLs of the installed framework-templates
    import { setTemplateUrls } from "comand-component-library"
    setTemplateUrls(import.meta.glob("/node_modules/comand-frontend-framework/dist/templates/*.css", {query: "?url", import: "default", eager: true}))

Without setTemplateUrls() the templates are expected at "/templates/<name>.css" (i.e. copied to the public-folder by the app).
"blank" means: no template-stylesheet. Templates are looks only (they override framework-tokens) - nothing may depend on a specific template.
*/

export const TEMPLATE_LINK_ID = "cmd-template-stylesheet"

/** supported templates ("blank" = no template-stylesheet) */
export const TEMPLATES = ["blank", "material-web", "neumorphic", "tailwind"]

let templateUrls = {}

/**
 * set the URLs of the template-stylesheets
 *
 * @param {Object} urls either {templateName: url} or the result of import.meta.glob (keys are file-paths, name is taken from the filename)
 */
export function setTemplateUrls(urls = {}) {
    templateUrls = {}

    Object.entries(urls).forEach(([key, value]) => {
        const name = key.split("/").pop().replace(/\.css$/, "")
        templateUrls[name] = typeof value === "string" ? value : value?.default
    })
}

/**
 * activate a template: removes the previously activated template-stylesheet (only the one added by this function) and appends the new one
 *
 * @param {string} templateName "blank", "material-web", "neumorphic" or "tailwind"
 * @returns {HTMLLinkElement|null} the added link-element or null (for "blank" and unknown names)
 */
export function applyTemplate(templateName) {
    document.getElementById(TEMPLATE_LINK_ID)?.remove()

    if (!TEMPLATES.includes(templateName) || templateName === "blank") {
        return null
    }

    const link = document.createElement("link")
    link.id = TEMPLATE_LINK_ID
    link.rel = "stylesheet"
    link.href = templateUrls[templateName] || "/templates/" + templateName + ".css"
    link.dataset.template = templateName
    document.head.appendChild(link)

    return link
}
