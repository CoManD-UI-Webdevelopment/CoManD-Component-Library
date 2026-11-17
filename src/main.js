// import all required css
import "./css.js"

import { createApp } from "vue"

import ComponentLibrary from "./ComponentLibrary.vue"

/* begin import directives ---------------------------------------------------------------------------------------- */
// directive to format telephone- and fax-number
import directiveTelephone from "./directives/telephone"

// directive to set focus on specific form-elements
import directiveFocus from "./directives/focus"

// directive to set focus on specific form-elements
import directiveFancybox from "./directives/fancybox"
/* end import directives ---------------------------------------------------------------------------------------- */

/* import css for prism-library (for styling syntax) */
import "prismjs/themes/prism.css"

/* import css for demopage only */
import 'comand-frontend-framework/demopage-only.css'
/* end imports css from comand-component-library ---------------------------------------------------------------------------------------- */

import router from "./router"

/* tell the library where the template-css of the installed comand-frontend-framework is */
import { setTemplateUrls } from "@/utils/template"
setTemplateUrls(import.meta.glob("/node_modules/comand-frontend-framework/dist/templates/*.css", {query: "?url", import: "default", eager: true}))

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes: [
//     {
//       path: '/:pathMatch(.*)*',
//       name: 'somename',
//       component: App
//     }
//   ]
// })

// createApp(App).use(router).directive('telephone', directiveTelephone).directive('focus', directiveFocus).mount('#app')
createApp(ComponentLibrary)
    .use(router)
    .directive('telephone', directiveTelephone)
    .directive('focus', directiveFocus)
    .directive('fancybox', directiveFancybox)
    .mount('#app')