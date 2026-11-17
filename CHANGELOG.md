# Changelog – comand-component-library

All notable changes are documented here, newest first. Versioning follows `package.json`.

## [Unreleased]

_Add every new change here before it is released._

### Added
- `src/utils/template.js`, exported from the library: `applyTemplate(name)`, `setTemplateUrls(urls)`, `TEMPLATES`, `TEMPLATE_LINK_ID`. One shared loader for the four templates (blank, material-web, neumorphic, tailwind). Template CSS stays in `comand-frontend-framework` and is never bundled into the library; the application passes the URLs (see `docs/README.md`).
- Quality rules documented (`docs/README.md`, workspace `CLAUDE.md`).

### Changed
- Demo app (`ComponentLibrary.vue`, `main.js`): templates now come from the installed `comand-frontend-framework` instead of the jsDelivr CDN (which could be a different framework version). Only the previously added template link is replaced.
- `CmdFakeSelect.vue`: country flag next to its visible country name is now decorative (`alt=""`) so screen readers don't read the name twice.

### Fixed (Prop-Migration: alte Prop-Namen auf die neue API umgestellt)
- `CmdBasicForm`: reichte `submitButton` an `CmdForm` weiter, das nur noch `cmdLinkSubmitButton` kennt => jetzt `:cmdLinkSubmitButton`.
- `CmdTextImageBlock`: Edit-Mode arbeitet jetzt mit `cmdParagraph.content` (Computed `htmlContent` liest daraus, Update schreibt `props.cmdParagraph`), vorher las er die nicht mehr existierende Prop `htmlContent`.
- `CmdUploadForm`, `CmdGoogleMaps`, `ComponentLibrary.vue`: `:iconClose="{show:false}"` => `:allowUserToCloseMessage="false"` (`CmdSystemMessage`).
- `ComponentLibrary.vue`: `CmdForm`-Beispiele nutzen `cmdLinkSubmitButton`/`cmdLinkCancelButton`.
- `componentSettingsDataAndControls.vue`: Einträge zu nicht mehr existierenden Props entfernt (`messageHeadlineLevel`, `htmlContent`, `paragraphTextAlign` samt Controls).
- `assets/data/component-structure.json`: `htmlContent` => `cmdParagraph.content`.

### Fixed (HTML validity / accessibility; found by `tools/check-matrix.mjs`)
- `CmdIcon`: class was applied twice (duplicate class on every icon with a class); icons with `tooltip` now have `role="img"` + `aria-label`, icons without tooltip are `aria-hidden="true"` (decorative). Gives icon-only links/buttons an accessible name when a tooltip is set.
- `CmdHeadline`: new prop `withoutWrapper` (renders the heading without `div.cmd-headline`). `CmdAccordion` uses it, because `<summary>` may not contain a `<div>`.
- `CmdTooltip`: root element is a `<span>` (was `<div>`), because tooltips are rendered inside `<label>`/`<span>` where a `<div>` is not allowed.
- `CmdLink`: empty `target` is no longer rendered as `target=""` (invalid value).
- `CmdBasicForm`: phone field uses `type="tel"` (was the invalid `type="phone"`); `CmdFormElement` delete-icon also supports `tel`.
- `CmdFormElement`: hidden labels (`showLabel=false`) use `.visually-hidden` instead of `.hidden` (was `display:none` => input without accessible name). **Requires the framework version that contains `.visually-hidden`.**

- White text on primary/secondary/tertiary backgrounds replaced by the framework contrast tokens in `CmdBox`, `CmdMultistepFormProgressBar`, `CmdTag`, `CmdList`, `CmdTable`, demo page (`ComponentLibrary.vue`, `public/styles/demopage-only.css`). **Requires the framework version with `--*-color-contrast-text` tokens.**
- Result (demo page, 4 templates x light/dark x 3 widths): color-contrast violations 2212 -> 357; `type="phone"`/`<div>` in `<summary>`/`target=""` findings gone.

### Removed / Changed (cleanup)
- `gulpfile.js` removed (dead code, `gulp` is no longer a dependency).
- `index.html` (demo): the CDN import of `demopage-only.css` (an older published version) is removed; `src/main.js` imports the one of the installed/local framework.

### Added (exports)
- `src/index.js` now exports `CmdListOfRequirements`, `CmdMailTool`, `CmdTag`, `CmdToast` (public components, documented). Internal components are listed in `docs/README.md`.

### Fixed (HTML validity / accessibility, round 2; verified with `tools/check-matrix.mjs`)
- `CmdTooltip`: renders as `<div>` and is teleported to `<body>` (popover/top-layer). Block content (headline, requirement list, close button) is no longer nested in `<span>`/`<label>` (fixes ~290x `element-permitted-content` and the close button being a second control in the `<label>`). Attributes are forwarded with `v-bind="$attrs"` (`inheritAttrs: false`). The `validationStatus` class is no longer duplicated by `CmdFormElement`/`CmdFakeSelect`/`CmdInputGroup`.
- `CmdFormElement`: the status icon is a `<span role="button" tabindex="0">` (Enter/Space/click toggles the tooltip via `togglePopover()`) instead of a `<button>` inside the `<label>` (fixes ~230x `multiple-labeled-controls`); inputs get an explicit `type="text"` default; hidden label texts use `visually-hidden` (stay available to screen readers).
- `CmdForm`: the `<legend>` is rendered outside the default slot, so a fieldset always starts with a legend; hidden legends (`CmdForm`, `CmdLoginForm`, `CmdNewsletterSubscription`, `CmdSiteSearch`, `CmdUploadForm`) use `visually-hidden` instead of `hidden`.
- `CmdSiteWrapper`: new prop `nestedInPage` (no `<main>` and no `#anchor-back-to-top` when embedded in another page); asides get `aria-label`. `CmdSiteHeader`: removed the redundant `role="banner"` on the wrapper div.
- `CmdMainNavigation`: `<nav>` has an `aria-label` (new prop `ariaLabel`, default "Main navigation"); off-canvas button/close ids are unique per instance (`toggle-offcanvas-<uid>`; the framework CSS matches `[id^="toggle-offcanvas-"]` too); focus handling via `$refs`; hidden button text is `visually-hidden`.
- `CmdWidthLimitationWrapper`: no empty `id=""`. `CmdImage`: no `<img>` without `src`; default `alt=""`.
- `CmdAddressData`/`CmdAddressDataItem`: telephone numbers are rendered with non-breaking spaces.
- `CmdMultistepFormProgressBar`: own state class is `step-active` (was `active`, duplicated the router-link class). `CmdUploadForm`: no duplicated `disabled` class.
- `CmdTabs`: `role="tab"` on the link, `role="presentation"` on the `<li>` (no nested interactive controls), `aria-selected`. `CmdTable`: invalid `aria-expanded` removed from `tbody`/`tfoot`. `CmdFakeSelect`: root is `role="group"`, the inner `<ul>` is the labelled `listbox`. `CmdCodeOutput` (`<pre>`) and `CmdFlexibleScrollContainer` (`.scroll-wrapper`) are keyboard-focusable. `CmdPagination`: icon-only links have an `aria-label`.
- Demo page: unique ids (`form-component-slot`, `inputfield-number-inline`, `form-elements-checkbox-id-N`, `search-subject-<boxType>`), `<div id="content">` instead of a second `<main>`, distinct navigation labels, range slider label.

### Fixed (Demo-Seite)
- `public/styles/demopage-only.css`: the demo content is placed next to the (position: fixed) settings sidebar instead of below it (at 1280px wide viewports the left 300px of every section, including accordion headlines and login form, were hidden behind the sidebar).
- Hover backgrounds that were hard `--color-white` while the text uses `--hyperlink-color` (light blue in dark mode) are scheme-aware (`CmdBox`, `CmdCookieDisclaimer`, `CmdFakeSelect`, `CmdSlideshow`, `CmdTabs`, `CmdFormFilters`).

### Fixed (CmdBreadcrumbs)
- Crumbs with `type: ""`/other non-link types are rendered as plain text; only `undefined`/`href`/`router` render a `CmdLink` (an empty type produced an invalid `linkType` and an empty list item).

### Fixed (web-ui findings)
- `CmdParagraph`: renders a `<div>` instead of `<p>` when the content contains block elements (stray `</p>`, "p implicitly closed").
- `CmdHeadline`: an empty headline is not rendered outside edit mode (empty `<h2>`); the edit-mode wrapper is only rendered in edit mode (`v-else-if="editModeContext"`).
- `--default-background` usages (fixed light gray) replaced by the scheme-aware framework token `--color-scheme-background-subtle` (`CmdBox`, `CmdSmartSearch`, `CmdUploadForm`, global styles).

### Fixed (Kontrast, Runde 2)
- Status colors for labels, messages, borders and requirement lists (`CmdForm`, `CmdFormElement`, `CmdFakeSelect`, `CmdInputGroup`, `CmdListOfRequirements`, `CmdTooltip`, `CmdUploadForm`, `CmdMultistepFormProgressBar`, global styles) use the new framework tokens `--error|warning|success|info-color-text`.
- Hover/active texts on `--hyperlink-color` backgrounds (`CmdFakeSelect`, `CmdSmartSearch`, `CmdTabs`) use `--hyperlink-color-contrast-text`; `CmdSlideshow` caption uses `--primary-color-contrast-text`. `CmdMailToolFilter` background is scheme-aware.
- Known remaining: white summary text on the secondary/tertiary accordions (design decision), `.disabled` demo elements (axe false positive, class instead of attribute).

### Fixed (Accordion-Headlines fehlten)
- `CmdHeadline`: `withoutWrapper` nutzte `Fragment` als dynamische Komponente - das verwirft den Slot-Inhalt, die Ueberschrift in `CmdAccordion`-Summaries (und `CmdAccordionsWrapper`) wurde gar nicht gerendert. Jetzt ueber eine kleine funktionale Wrapper-Komponente (`HeadlineWrapper`).
- `vite.config.js`: Dev-Server nutzt standardmaessig das lokale `../comand-frontend-framework/dist` (Opt-out `CMD_LOCAL_SIBLINGS=0`). Mit dem aelteren installierten Framework fehlten die neuen Tokens (`--*-color-contrast-text`, ...) => schwarze Headlines/Icons in Boxen und Akkordeons.

### Fixed (Verhalten, CSS-Variablen, Daten)
- `CmdFakeSelect`: Dropdown schliesst bei Klick ausserhalb wieder (Ersatz fuer das entfernte Paket `clickout-event`; Listener am `document`, Pruefung ueber `$refs`/`composedPath`). Test: `tools/test-fakeselect.mjs`.
- `CmdToggleDarkMode`: Anfangszustand aus `localStorage`/`prefers-color-scheme` in `data()` (vorher kurzzeitig/dauerhaft falsch).
- Nicht mehr existierende CSS-Variablen in `CmdFakeSelect`, `CmdMultistepFormProgressBar`, `EditComponentWrapper` durch Framework-Tokens ersetzt (`--default-border-color`, `--gap-small`, `--default-icon-size`, `--color-white/-black/-dark-gray`); es sind keine undefinierten `var(--...)` mehr uebrig.
- `package.json`: `prismjs` als devDependency (wird nur von der Demo-Seite `src/main.js` genutzt).
- `assets/data/social-networks-page-by-json.json`: Schluessel `cmdFormElement` => `cmdFormElementDataPrivacy`.
- Demo-Console-Fehler `formatDate()` (invalid date) stammt aus den Demodaten; vom Check als erwartete Ausnahme gefuehrt.

### Added (tooling)
- `vite.config.js`: optional `CMD_LOCAL_SIBLINGS=1` (resolve the framework from the local repo; used by `E:\CoManD-UI	ools`). Normal builds unchanged.

### Known open issues (state 2026-11-17, `npm run check`: html 0, console 0, axe only 1 rule)
- `color-contrast` in the demo: white summary text on the secondary/tertiary `CmdAccordion` (maintainer decision, white on #3cbcc3/#6bc8fa etc. is < 4.5:1). Everything else of the former ~2200 contrast findings is fixed.
- Demo page: `console.error` "function 'formatDate()' received an invalid date" (2x, from `CmdMailToolEntry`; intended demo data, listed as expected message in `tools/check-matrix.mjs`).
- Visible `<legend>` of `CmdLoginForm`/`CmdForm` demos is placed at the top right of the fieldset (framework `legend { position: absolute }`) and overlaps content in some templates (pre-existing layout, not a validity problem).

### Removed
- `src/assets/styles/template.css` (empty placeholder) and its import in `src/main.js`.

### Notes
- The web-ui release that uses `applyTemplate` needs this library version (bump the dependency range in `comand-web-ui`).

### Baseline: bereits vorhandene, nicht committete Änderungen (gesichtet 2026-11-17)
Stand HEAD `51b335b` (2026-02-26, package.json dort 4.3.20). Ohne Whitespace/CRLF: 68 Dateien (+2091/−1613 ohne `package-lock.json`, das Lockfile wurde komplett neu erzeugt: ~6500 Zeilen).

**package.json (4.3.20 → 4.3.28):** `gulp` und `gulpfile.js`-Schritt entfernt (`build-lib` = nur noch `vite build`; `gulpfile.js` ist jetzt toter Code), Dependencies entfernt: `clickout-event`, `core-js`, `prismjs`, `vuex`; `unplugin-vue-components` 0.24 → 31; Framework-Range `^4.5.4`, Iconfonts `^1.0.21`.
**Neu:** `CmdSiteWrapper.vue` + `assets/data/site-wrapper.json` (untracked, wird in `index.js` exportiert). **Gelöscht:** `public/styles/templates/casual.css`.
**Große Refactorings** (CSS auf Framework-Tokens/`--hyperlink-color`/`--gap-small` umgestellt, Utility-Klassen `vertical` → `flex-direction-column`, Props → `*Properties`-Computeds mit `show`-Flag): u.a. `CmdUploadForm`, `CmdLoginForm`, `CmdForm`, `CmdSystemMessage`, `CmdFancyBox`, `CmdAccordion(sWrapper)`, `CmdInputGroup`, `CmdAddressData`, `ComponentLibrary.vue`.

**Breaking Prop-Änderungen (Umbenennungen/Entfernungen) gegenüber HEAD:**
- `CmdLoginForm`: `buttonLogin` → `cmdLinkLogin`, `buttonLoginWithYourData` → `cmdLinkLoginWithYourData`, `buttonSendLogin` → `cmdLinkSendLogin`, `linkForgotPassword` → `cmdLinkForgotPassword`, `linkCreateAccount` → `cmdLinkCreateAccount`, `linkBackToLogin` → `cmdLinkBackToLogin` (`cmdHeadlineLoginForm` bleibt unverändert); neu `enableLoginWithGoogle`
- `CmdForm`: `cancelButton` → `cmdLinkCancelButton`, `submitButton` → `cmdLinkSubmitButton`, neu `mandatoryText` (`CmdBasicForm` behält seine Prop `submitButton` und reicht sie als `cmdLinkSubmitButton` weiter)
- `CmdUploadForm`: alle `icon*`-Props und `cmdHeadlineFieldset`, `cmdHeadlineSelectAdditionalFiles`, `cmdHeadlineSelectNewFile` entfernt; neu `cmdHeadlineSelectFiles`, `cmdLinkSelectFiles`, `cmdLinkRemoveFilesFromList`, `cmdLinkToggleListOfFileExtensions`
- `CmdSystemMessage`: `iconClose` (`{show:false}`) => `allowUserToCloseMessage=false` bzw. `cmdLinkCloseIcon`; `iconMessage`, `messageHeadlineLevel` => `cmdHeadline`; neu `transition`
- `CmdTooltip`: `iconClose` → `cmdLinkCloseButton`; `CmdToast`: `cmdIcon` → `cmdLinkCloseIcon`; `CmdTable`: `iconToggleWidth` → `cmdLinkToggleWidth`
- `CmdTextImageBlock`: `htmlContent` und `paragraphTextAlign` entfernt => `cmdParagraph: {content, textAlign}` (Props von `CmdParagraph`)
- `CmdSiteHeader`: `closeOffcanvas` entfernt (wird weiterhin an `CmdMainNavigation` übergeben, dort gültig); `CmdPageFooter`: `buttonPrintView` entfernt; `CmdSocialNetworks`: `cmdFormElement` entfernt; `CmdAddressData`/`CmdBankAccountData`: `useSlot` (und `cmdIcon`) entfernt
- Neu u.a.: `CmdTag` (`highlightLevel`, `tagText`, `userCanRemoveTagByClick`, `cmdLinkRemoveTag`), `CmdAddressData` (`contentOrientation`, `styleAsBox`), `CmdContainer` (`innerClasses`, `styleAsBox`), `CmdImage` (`orientation`), `CmdAccordionsWrapper` (`fullWidth`, `summaryWritingMode`)

**Inkonsistenzen, die durch diese Umstellung entstanden sind (offen):**
- ~~Die alten Prop-Namen werden noch benutzt~~ => **behoben, siehe `### Fixed (Prop-Migration)`**.
- `main.js` importiert `prismjs/themes/prism.css`, aber `prismjs` ist nicht mehr in den Dependencies (läuft nur, solange es noch in `node_modules` liegt; nach frischem `npm install` bricht `npm run dev`).
- `main.js` importiert `clickout-event` nicht mehr und die Dependency ist entfernt, `CmdFakeSelect` nutzt aber `@clickout="closeOptions"` => das Dropdown schließt nicht mehr per Klick außerhalb (bereits in HEAD hat nur die Demo-`main.js` das Event aktiviert, Apps wie das Web-UI nicht).
- Nicht definierte CSS-Variablen: `--border-color` (`CmdFakeSelect`, `CmdMultistepFormProgressBar`), `--default-gap-third`, `--icon-font-size` (`EditComponentWrapper`).
- `gulpfile.js` wird nicht mehr benutzt.

## [4.3.28] – current `package.json` version
- Depends on `comand-frontend-framework ^4.5.4`, `vue ^3.5.25`, build with `vite ^7`.
- Components added in recent history: `CmdMultistepFormWrapper`, `CmdMultistepFormProgressBar` (improved), `CmdCodeOutput`, `CmdTag` (from git log) and further new components ("add new components"; not itemized).
- Refactoring of `CmdFormElement`/`CmdInputGroup` validation; refactoring of `CmdBox` and `CmdList`.
- `highlightLevel` property added; `disabled` property added to `CmdLink`.
