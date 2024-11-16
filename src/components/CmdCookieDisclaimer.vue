<template>
    <transition name="fade">
        <div class="cmd-cookie-disclaimer flex-container vertical">
            <!-- begin slot -->
            <template v-if="useSlot">
                <slot></slot>
            </template>
            <!-- end slot -->

            <div v-else>
                <!-- begin CmdHeadline -->
                <CmdHeadline
                    v-if="cmdHeadlineCookieDisclaimer?.show && cmdHeadlineCookieDisclaimer?.headlineText && cmdHeadlineCookieDisclaimer?.headlineLevel"
                    :headlineText="cmdHeadlineCookieDisclaimer.headlineText"
                    :headlineLevel="cmdHeadlineCookieDisclaimer.headlineLevel"
                />
                <!-- end CmdHeadline -->

                <!-- begin slot for cookie-options -->
                <slot name="cookie-options">
                    <!-- begin required cookies -->
                    <div v-if="cookieOptions?.required" class="flex-container vertical">
                        <!-- begin CmdHeadline -->
                        <CmdHeadline
                            v-if="cmdBoxRequiredCookies?.showHeadline"
                            :headline-text="cmdBoxRequiredCookies?.headlineText"
                            :headline-level="cmdBoxRequiredCookies?.headlineLevel "
                        />
                        <!-- end CmdHeadline -->

                        <div v-for="(cookie, index) in cookieOptions.required.cookies || []"
                             :key="index" class="collapsible-box">
                            <header>
                                <!-- begin CmdFormElement -->
                                <CmdFormElement
                                    element="input"
                                    type="checkbox"
                                    v-model="acceptedCookies"
                                    :inputValue="cookie.value"
                                    :labelText="cookie.labelText"
                                    :disabled="cookie.disabled"
                                    :id="cookie.id"
                                    :toggleSwitch="true"
                                    :title="getMessage('cookie_disclaimer.title.cookie_cannot_be_disabled')"
                                />
                                <!-- end CmdFormElement -->

                                <!-- begin icon to toggle box-body -->
                                <a href="#" @click.prevent="toggleBoxBody(cookie.id)" :title="getMessage('cookie_disclaimer.title.toggle_box_content')">
                                    <span :class="boxIsOpen(cookie.id) ? iconClassBoxExpanded : iconClassBoxCollapsed"></span>
                                </a>
                                <!-- end icon to toggle box-body -->
                            </header>
                            <div v-show="boxIsOpen(cookie.id)" class="collapsible-box-body">
                                <p v-if="cookie.description">{{ cookie.description }}</p>
                                <p v-if="cookie.linkDataPrivacy">
                                    {{ cookie.linkDataPrivacy.label }}
                                    <a @click="openDataPrivacy"
                                       :href="cookie.linkDataPrivacy.link"
                                       :target="cookie.linkDataPrivacy.target">
                                        {{ cookie.linkDataPrivacy.linkText }}
                                    </a>
                                </p>
                                <div v-if="dataPrivacyContent" v-html="dataPrivacyContent"></div>
                            </div>
                        </div>
                        <!-- end CmdBox -->
                    </div>
                    <!-- end required cookies -->

                    <hr/>

                    <!-- begin optional cookies -->
                    <div v-if="cookieOptions?.optional" class="flex-container vertical">
                        <!-- begin CmdHeadline -->
                        <CmdHeadline
                            v-if="cmdBoxOptionalCookies?.showHeadline"
                            :headline-text="cmdBoxOptionalCookies?.headlineText"
                            :headline-level="cmdBoxOptionalCookies?.headlineLevel
                    "/>
                        <!-- end CmdHeadline -->

                        <div v-for="(cookie, index) in cookieOptions.optional.cookies || []"
                             :key="index" class="collapsible-box">
                            <header>
                                <!-- begin CmdFormElement -->
                                <CmdFormElement
                                    element="input"
                                    type="checkbox"
                                    v-model="acceptedCookies"
                                    :inputValue="cookie.value"
                                    :labelText="cookie.labelText"
                                    :disabled="cookie.disabled"
                                    :id="cookie.id"
                                    :toggleSwitch="true"
                                    :title="getMessage('cookie_disclaimer.title.toggle_to_accept_cookie')"
                                />
                                <!-- end CmdFormElement -->

                                <!-- begin icon to toggle box-body -->
                                <a href="#" @click.prevent="toggleBoxBody(cookie.id)" :title="getMessage('cookie_disclaimer.title.toggle_box_content')">
                                    <span :class="boxIsOpen(cookie.id) ? iconClassBoxExpanded : iconClassBoxCollapsed"></span>
                                </a>
                                <!-- end icon to toggle box-body -->
                            </header>
                            <div v-show="boxIsOpen(cookie.id)" class="collapsible-box-body">
                                <p v-if="cookie.description">{{ cookie.description }}</p>
                                <p v-if="cookie.linkDataPrivacy">
                                    {{ cookie.linkDataPrivacy.label }}
                                    <a @click="openDataPrivacy"
                                       :href="cookie.linkDataPrivacy.link"
                                       :target="cookie.linkDataPrivacy.target">
                                        {{ cookie.linkDataPrivacy.linkText }}
                                    </a>
                                </p>
                                <div v-if="dataPrivacyContent" v-html="dataPrivacyContent"></div>
                            </div>
                        </div>
                    </div>
                    <!-- end optional cookies -->
                </slot>
                <!-- end slot for cookie-options -->

                <!-- begin privacy-text -->
                <div v-if="privacyText" class="privacy-text" v-html="privacyText"></div>
                <!-- end privacy-text-->

                <!-- begin button-wrapper for 'accept'-buttons -->
                <div class="button-wrapper align-center">
                    <button v-if="buttonLabelAcceptCurrentSettings" type="button" @click="acceptCurrentCookies">
                        <span>{{ buttonLabelAcceptCurrentSettings }}</span>
                    </button>
                    <button v-if="buttonLabelAcceptAllCookies" type="button" class="primary" @click="acceptAllCookies">
                        <span>{{ buttonLabelAcceptAllCookies }}</span>
                    </button>
                </div>
                <!-- end button-wrapper for 'accept'-buttons -->
            </div>
        </div>
    </transition>
</template>

<script>
// import mixins
import I18n from "../mixins/I18n"
import DefaultMessageProperties from "../mixins/CmdCookieDisclaimer/DefaultMessageProperties"

export default {
    name: "CmdCookieDisclaimer",
    mixins: [I18n, DefaultMessageProperties],
    data() {
        return {
            showCookieDisclaimer: true,
            dataPrivacyContent: "",
            openBoxes: []
        }
    },
    props: {
        /**
         * define icon-class for collapsed box
         */
        iconClassBoxCollapsed: {
            type: String,
            default: "icon-chevron-one-stripe-down"
        },
        /**
         * define icon-class for expanded box
         */
        iconClassBoxExpanded: {
            type: String,
            default: "icon-chevron-one-stripe-up"
        },
        /**
         * activate if you want to use slot instead for given structure
         */
        useSlot: {
            type: Boolean,
            default: false
        },
        /**
         * set default v-model (must be named modelValue in Vue3)
         */
        modelValue: {
            type: Array,
            required: false
        },
        /**
         * properties for CmdHeadline-component at top of cookie disclaimer
         */
        cmdHeadlineCookieDisclaimer: {
            type: Object,
            default() {
                return {
                    show: true,
                    headlineText: "Cookie disclaimer",
                    headlineLevel: 2
                }
            }
        },
        /**
         * property for CmdBox-component surrounding the required cookies
         */
        cmdBoxRequiredCookies: {
            type: Object,
            default() {
                return {
                    collapsible: true,
                    showHeadline: true,
                    headlineText: "Required cookies",
                    headlineLevel: 3
                }
            }
        },
        /**
         * property for CmdBox-component surrounding the optional cookies
         */
        cmdBoxOptionalCookies: {
            type: Object,
            default() {
                return {
                    collapsible: true,
                    showHeadline: true,
                    headlineText: "Optional cookies",
                    headlineLevel: 3
                }
            }
        },
        /**
         * list of cookie-options
         */
        cookieOptions: {
            type: Object,
            required: false
        },
        /**
         * optional privacy-text shown at bottom of cookie-disclaimer
         */
        privacyText: {
            type: String,
            required: false
        },
        /**
         * label for button to accepting all cookies
         */
        buttonLabelAcceptAllCookies: {
            type: String,
            default: "Accept all cookies!"
        },
        /**
         * label for button for accepting current settings
         */
        buttonLabelAcceptCurrentSettings: {
            type: String,
            default: "Proceed with current settings!"
        }
    },
    computed: {
        acceptedCookies: {
            get() {
                const cookies = this.modelValue ? [...this.modelValue] : []
                const requiredCookies = this.cookieOptions?.required?.cookies || []
                for (let i = 0; i < requiredCookies.length; i++) {
                    if (!cookies.includes(requiredCookies[i].value)) {
                        cookies.push(requiredCookies[i].value)
                    }
                }
                return cookies
            },
            set(value) {
                this.$emit("update:modelValue", value)
            }
        }
    },
    methods: {
        boxIsOpen(cookieId) {
            return this.openBoxes.includes(cookieId)
        },
        toggleBoxBody(cookieId) {
            const index = this.openBoxes.indexOf(cookieId);

            if (index === -1) {
                // cookieId does not exist in the array, so add it
                this.openBoxes.push(cookieId);
            } else {
                // cookieId already exists in the array, so remove it
                this.openBoxes.splice(index, 1);
            }
        },
        acceptCurrentCookies() {
            this.$emit("close-cookie-disclaimer", this.acceptedCookies)
        },
        acceptAllCookies() {
            const allCookies = []

            // push all required cookies to array
            const requiredCookies = this.cookieOptions?.required?.cookies

            if (requiredCookies) {
                for (let i = 0; i < requiredCookies.length; i++) {
                    allCookies.push(requiredCookies[i].value)
                }
            }

            // push all optional cookies to array
            const optionalCookies = this.cookieOptions?.optional?.cookies

            if (optionalCookies) {
                for (let i = 0; i < optionalCookies.length; i++) {
                    allCookies.push(optionalCookies[i].value)
                }
            }

            this.$emit("close-cookie-disclaimer", allCookies)
        },
        openDataPrivacy(event) {
            /* first 'target' = clicked-element, second 'target' = target-attribute */
            if (!event.target.target) {
                event.preventDefault()
                fetch(event.target.href).then((response) =>
                    response.text()
                ).then((content) => { /* use arrow function to get access to dataPrivacy by 'this' = vue-instance (otherwise 'this' wouldn't be vue-instance in this fetch-method) */
                    this.dataPrivacyContent = content
                })
            }
        }
    }
}
</script>

<style>
/* begin cmd-cookie-disclaimer ---------------------------------------------------------------------------------------- */
.cmd-cookie-disclaimer {
    width: 100%;
    padding: var(--default-padding);
    padding-right: calc(var(--default-padding) * 2);
    z-index: 100; /* bring layer above logo */
    bottom: 0;
    top: auto;

    .collapsible-box {
        border-radius: var(--default-border-radius);

        header {
            display: flex;
            align-items: center;
            border: var(--primary-border);
            justify-content: unset; /* overwrite setting for collapsible boxes */
            background: var(--primary-color);
            border-top-left-radius: inherit;
            border-top-right-radius: inherit;

            &:has(input:checked) {
                background: var(--pure-white);

                span[class*="icon-"] {
                    color: var(--hyperlink-color);
                }

                label {
                    .label-text span {
                        color: var(--hyperlink-color); /* required to set label-text in header to white */
                    }
                }
            }

            &:has(input:disabled) {
                background: var(--disabled-background);

                span[class*="icon-"] {
                    color: var(--hyperlink-color);
                }

                label {
                    .label-text span {
                        color: var(--disabled-color) !important; /* required to set label-text in header to white */
                    }
                }
            }

            &:has(a:is(:hover, :active, :focus)) {
                background: var(--primary-color);

                label .label-text span, span[class*="icon-"] {
                    color: var(--pure-white) !important;
                }
            }

            span[class*="icon-"] {
                color: var(--pure-white);
            }

            label {
                padding: calc(var(--default-padding) / 2) var(--default-padding);

                .label-text span {
                    color: var(--pure-white); /* required to set label-text in header to white */
                }

                &.disabled {
                    .label-text span {
                        color: var(--pure-white) !important; /* required to set label-text in header to white */
                    }
                }

                &:hover, &:active, &:focus {
                    cursor: pointer;
                }

                input {
                    &:hover, &:active, &:focus {
                        cursor: pointer;
                    }
                }
            }

            a {
                text-decoration: none;
                flex: 1;
                display: flex;
                justify-content: flex-end;
                padding: var(--default-padding);
            }
        }

        .collapsible-box-body {
            padding: var(--default-padding);
            border: var(--default-border);
            border-top: 0;
            background: var(--box-background);
            border-bottom-left-radius: inherit;
            border-bottom-right-radius: inherit;

            p:last-child {
                margin: 0;
            }
        }
    }

    > p {
        text-align: center;
        color: var(--color-scheme-text-color); /* must be assigned again, because content is placed by slot */
    }

    p {
        a {
            text-decoration: underline;

            &:hover, &:active, &:focus {
                text-decoration: none;
            }
        }
    }

    .privacy-text, .button-wrapper {
        margin-top: var(--default-gap);
    }
}

/* end cmd-cookie-disclaimer ------------------------------------------------------------------------------------------ */
</style>