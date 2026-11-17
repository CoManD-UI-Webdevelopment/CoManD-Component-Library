# CoManD Component Library – Documentation

Package: `comand-component-library` · License: GPL-3.0-only · Version: see `package.json` (4.3.28 at time of writing)

Vue 3 components (Options API, `Cmd*` prefix) that render the HTML/CSS structure of `comand-frontend-framework` and share its tokens. Requires `comand-frontend-framework` and `comand-ui-iconfonts`; peer runtime: `vue` ≥ 3.5, `vue-router` ≥ 4.

## Install & use

```js
// 1. styles (framework + iconfonts + library globals)
import "comand-component-library/css.js"
import "comand-component-library/comand-component-library.css"

// 2. components
import { CmdBox, CmdHeadline, CmdForm } from "comand-component-library"
```

`src/css.js` pulls in, in order: framework `styles.css`, the four iconfonts (base, logos, editmode, medical), `variables.scss`, `component-library-global-styles.scss`, `transitions.css`.

Package exports: `.` (ES module only), `./css.js`, `./comand-component-library.css`, `./variables.scss`, `./export-example-data.js`, and data lists `countries.json`, `currencies.json`, `dial-codes.json`, `us-cities.json`.

## What is exported (`src/index.js`)

**Components (exported)**
- Layout/structure: `CmdSiteWrapper`, `CmdSiteHeader`, `CmdSiteFooter`, `CmdPageHeader`, `CmdPageFooter`, `CmdSection`, `CmdContainer`, `CmdSidebar`, `CmdWidthLimitationWrapper`, `CmdBox`, `CmdBoxWrapper`
- Navigation: `CmdMainNavigation`, `CmdBreadcrumbs`, `CmdPagination`, `CmdLink`, `CmdTabs`, `CmdSwitchLanguage`, `CmdBackToTopButton`, `CmdSiteSearch`, `CmdSmartSearch`
- Forms: `CmdForm`, `CmdBasicForm`, `CmdFormElement`, `CmdFormFilters`, `CmdInputGroup`, `CmdFakeSelect`, `CmdLoginForm`, `CmdUploadForm`, `CmdNewsletterSubscription`, `CmdMultistepFormWrapper`, `CmdMultistepFormProgressBar`
- Content: `CmdHeadline`, `CmdParagraph`, `CmdList`, `CmdImage`, `CmdImageGallery`, `CmdImageZoom`, `CmdFancyBox` (+ `openFancyBox`), `CmdSlideshow`, `CmdSlideButton`, `CmdThumbnailScroller`, `CmdTextImageBlock`, `CmdAccordion`, `CmdAccordionsWrapper`, `CmdFootnote`, `CmdCodeOutput`, `CmdIcon`, `CmdProgressBar`, `CmdTooltip`, `CmdSystemMessage`
- Business data: `CmdAddressData`, `CmdBankAccountData`, `CmdOpeningHours`, `CmdSocialNetworks`, `CmdCompanyLogo`, `CmdCopyrightInformation`, `CmdGoogleMaps`
- Misc: `CmdToggleDarkMode`, `CmdCookieDisclaimer`, `CmdTable`, `CmdTag`, `CmdToast`, `CmdMailTool`, `CmdListOfRequirements`, `EditComponentWrapper`, `ComponentLibrary` (demo/docs page)

> Note: these components are **internal** (used by exported components, not exported from `src/index.js`): `CmdAddressDataItem`, `CmdInnerLink`, `CmdListOfLinksItem`, `CmdMailToolEntry`, `CmdMailToolFilter`, `CmdOpeningHoursItem`, `CmdSocialNetworksItem`, `ComponentSettings`, `RouterComponent`.

**Page components:** `ContactInformation`, `MultipleBoxWrapper`, `MultipleListsOfLinks`
**Directives:** `DirFocus`, `DirTelephone`, `DirFancybox`
**Utils:** `createUuid`, `createHtmlId`, `getFileExtension`, `capitalizeFirstLetter`, `lowercaseFirstLetter`, `fullName`, `responsiveBodyClasses`, cookie helpers, date helpers (`formatDate`, `getWeekday`, …)
**Composables:** `useSequence`, `useScrollspy`
**Mixin:** `I18n`

## Templates

The four templates (`blank` = none, `material-web`, `neumorphic`, `tailwind`) live **only** in `comand-frontend-framework`. The library never bundles them; the application tells it where they are:

```js
import { setTemplateUrls, applyTemplate } from "comand-component-library"

// Vite app: URLs of the installed framework templates
setTemplateUrls(import.meta.glob("/node_modules/comand-frontend-framework/dist/templates/*.css", {query: "?url", import: "default", eager: true}))

applyTemplate("neumorphic")   // replaces only the stylesheet added by applyTemplate (#cmd-template-stylesheet)
applyTemplate("blank")        // removes it
```

Without `setTemplateUrls` the loader expects `/templates/<name>.css`. Exports: `applyTemplate`, `setTemplateUrls`, `TEMPLATES`, `TEMPLATE_LINK_ID`.

## Component conventions

- Props are documented with JSDoc blocks directly above each prop; accessibility-critical props are tagged `@requiredForAccessibility`.
- Nested components are configured through **object props named after the child** (`cmdHeadline`, `cmdLink`, `cmdParagraph`, …) that are `v-bind`-ed into the child, e.g. `CmdToast` takes `cmdHeadline` and `cmdLink`.
- Components use framework classes (`box`, `flex-container`, `button`, …) – styling is overridden via tokens, not by component CSS.
- Edit mode: components `inject` an `editModeContext` (default `null`); when present, they render placeholders/controls so the web-ui editor can edit them (`EditComponentWrapper`, `componentSettingsDataAndControls.vue`).
- i18n via the `I18n` mixin and `GlobalDefaultMessageProperties` mixin.
- Example/demo data for each component lives in `src/assets/data/*.json`; `src/assets/data/listOfComponents.json` and `component-structure.json` describe the component list used by the demo/docs app.

### Accessibility / HTML conventions (checked by `tools/check-matrix.mjs`)

- A `<label>` contains exactly one control: the help/status icon of `CmdFormElement` is a `<span role="button" tabindex="0">` that toggles the tooltip (popover) by click, Enter and Space. `CmdTooltip` is a `<div popover>` teleported to `<body>`; it can be used anywhere without HTML nesting problems.
- Hidden labels, legends and button texts use `.visually-hidden` (never `.hidden`/`display: none`: that removes them for screen readers). `CmdForm` always renders a `<legend>` as first child of its fieldset.
- Landmarks need a unique accessible name when they occur more than once (`CmdMainNavigation` prop `ariaLabel`; asides of `CmdSiteWrapper` are named). `CmdSiteWrapper` has the prop `nestedInPage` for embedding it in another page (no second `<main>`, no duplicate anchor id).
- Ids must be unique per page: components that can occur several times derive them from a uuid (i.e. `CmdMainNavigation`, `CmdFormElement`); demo data must not reuse ids.
- Status colors for text/icons/borders: `--error|warning|success|info-color-text`; text ON primary/secondary/tertiary backgrounds: `--*-color-contrast-text`; text ON hyperlink-color backgrounds: `--hyperlink-color-contrast-text`; subtle backgrounds: `--color-scheme-background-subtle` (never the fixed `--default-background` behind scheme-aware text).

## Project layout

```
src/
  components/       Cmd*.vue
  pages/            page-level compositions
  mixins/           I18n, FieldValidation, GlobalCurrency, per-component mixin folders
  composables/      event, scrollspy, sequence
  directives/       fancybox, focus, telephone
  utils/            common, date, string, cookie, dom, address, file-upload, validation
  assets/
    data/           example data (json)
    lists-of-data/  countries, currencies, dial-codes, us-cities
    styles/         variables.scss, global styles, transitions.css, template.css
  router/ ComponentLibrary.vue main.js   demo/doc app
```

## Build & development

```
npm install
npm run dev        # demo/doc app
npm run build-lib  # lib build -> dist/comand-component-library.js (+ .css), ES format, vue external
```

Vite config: alias `@` → `src`, `unplugin-vue-components` auto-registers `src/components` and `src/pages`.
Release flow: commit → push → `npm publish` → git tag → push. Bump the framework dependency range when releasing against a new framework version.

## Documentation rules for contributors

- New component: add to `src/index.js`, add example data under `src/assets/data/`, register in `listOfComponents.json`, document props with JSDoc.
- Every change goes into `CHANGELOG.md`.

## Quality rules

These rules apply to every change (full text in `E:\CoManD-UI\CLAUDE.md`):

1. Framework, component library and web-ui must build and work at any time (build order: framework → component library → web-ui).
2. HTML-valid, responsive, accessible (WCAG 2.x AA), and working in light and dark mode.
3. Works with all four templates: `blank` (no template file), `material-web`, `neumorphic`, `tailwind` – each in light and dark mode.
4. Templates are looks only: they override tokens; nothing depends on a specific template.
5. Component base CSS lives in the component's `<style>` block and uses framework tokens only (no hard-coded colors except third-party brand colors with a dark-mode variant).
6. Template CSS is inherited from `comand-frontend-framework` only; no template copies elsewhere (a web-ui per-site, token-only override file is the one exception).
7. Every change is recorded in `CHANGELOG.md`.
