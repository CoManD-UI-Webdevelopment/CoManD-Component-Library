<template>
    <!-- begin login-form -->
    <fieldset v-show="!sendLogin" class="cmd-login-form flex-container">
        <legend :class="{hidden : !legendLoginForm.show, 'align-left': legendLoginForm.align === 'left'}">
            {{ legendLoginForm.text }}
        </legend>
        <!-- begin CmdHeadline -->
        <CmdHeadline
            v-if="cmdHeadlineLoginForm"
            v-bind="cmdHeadlineLoginForm"
        />
        <!-- end CmdHeadline -->

        <!-- begin Google-Login-Button -->
        <button v-if="enableLoginWithGoogle" class="gsi-material-button stretch-on-small-devices">
            <div class="gsi-material-button-state"></div>
            <div class="gsi-material-button-content-wrapper">
                <div class="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"
                         xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
                        <path fill="#EA4335"
                              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4"
                              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05"
                              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853"
                              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                </div>
                <span class="gsi-material-button-contents">Sign in with Google</span>
                <span style="display: none;">Sign in with Google</span>
            </div>
        </button>
        <!-- end Google-Login-Button -->

        <!-- begin Facebook-Login-Button -->
        <div v-if="enableLoginWithFacebook"
             class="fb-login-button stretch-on-small-devices"
             data-width="200"
             data-size=""
             data-button-type=""
             data-layout=""
             data-auto-logout-link="false"
             data-use-continue-as="false">
        </div>
        <!-- end Facebook-Login-Button -->

        <button v-if="enableLoginWithGoogle || enableLoginWithFacebook"
                class="button stretch-on-small-devices"
                v-bind="buttonLoginWithYourDataDefaultOptions"
                @click.prevent="showLogin = true">
                <!-- begin CmdIcon -->
                <CmdIcon
                    v-if="buttonLoginWithYourDataDefaultOptions.icon?.iconClass"
                    :iconClass="buttonLoginWithYourDataDefaultOptions.icon.iconClass"
                    :type="buttonLoginWithYourDataDefaultOptions.icon.iconType"
                    :title="buttonLoginWithYourDataDefaultOptions.icon.tooltip"
                />
                <!-- end CmdIcon -->
                <span v-if="buttonLoginWithYourDataDefaultOptions.text">{{ buttonLoginWithYourDataDefaultOptions.text }}</span>
        </button>

        <!-- begin form elements -->
        <div v-show="showLogin" :class="['login-fields flex-container', {'vertical': orientation === 'vertical'}]">
            <!-- begin CmdFormElement -->
            <CmdFormElement
                element="input"
                type="text"
                ref="username"
                v-model="username"
                v-bind="cmdFormElementUsernameOptions"
                @validationStatusChange="checkValidationStatus($event, 'username')"
            />
            <!-- end CmdFormElement -->

            <!-- begin CmdFormElement -->
            <CmdFormElement
                element="input"
                type="password"
                v-model="password"
                v-bind="cmdFormElementPasswordOptions"
                @validationStatusChange="checkValidationStatus($event, 'password')"
            />
            <!-- end CmdFormElement -->
        </div>
        <!-- end form elements -->

        <!-- begin named slot for login-form -->
        <slot name="login"></slot>
        <!-- end named slot for login-form -->

        <div class="option-wrapper flex-container">
            <div class="flex-container reset-flex no-wrap-on-small-devices justify-content-space-around" v-if="linkForgotPassword || linkCreateAccount">
                <!-- begin link for 'forgot password' -->
                <a v-if="linkForgotPassword" href="#" @click.prevent="toggleSendLoginView">
                    <!-- begin CmdIcon -->
                    <CmdIcon
                        v-if="linkForgotPassword.icon?.show && linkForgotPassword.icon?.iconClass"
                        :iconClass="linkForgotPassword.icon.iconClass"
                        :type="linkForgotPassword.icon.iconType"
                        :title="linkForgotPassword.icon.tooltip"
                    />
                    <!-- end CmdIcon -->
                    <span v-if="linkForgotPassword.text">{{ linkForgotPassword.text }}</span>
                </a>
                <!-- end link for 'forgot password' -->

                <!-- begin link for 'create account' -->
                <template v-if="linkCreateAccount">
                    <!-- begin CmdLink -->
                    <CmdLink
                        :linkType="linkCreateAccount.linkType"
                        :path="linkCreateAccount.path"
                        :text="linkCreateAccount.text"
                        :icon="{
                            iconClass: linkCreateAccount.icon?.iconClass,
                            tooltip: linkCreateAccount.icon?.tooltip,
                            position: linkCreateAccount.icon?.position
                        }"
                    />
                    <!-- end CmdLink -->
                </template>
                <!-- end link for 'create account' -->
            </div>

            <!-- begin link-type 'button' -->
            <button
                v-if="buttonLoginDefaultOptions.linkType === 'button'"
                :type="buttonLoginDefaultOptions.type === 'submit' ? 'submit' : 'button'"
                v-bind="buttonLoginOptions"
                :class="['button stretch-on-small-devices', { primary: buttonLoginDefaultOptions.primary }]"
                @click="onClick"
                :disabled="buttonLoginDisabled"
            >
                <!-- begin CmdIcon -->
                <CmdIcon
                    v-if="buttonLoginDefaultOptions.icon.iconClass"
                    :iconClass="buttonLoginDefaultOptions.icon.iconClass"
                    :type="buttonLoginDefaultOptions.icon.iconType"
                    :title="buttonLoginDefaultOptions.icon.tooltip"
                />
                <!-- end CmdIcon -->
                <span v-if="buttonLoginDefaultOptions.text">{{ buttonLoginDefaultOptions.text }}</span>
            </button>
            <!-- begin link-type 'button' -->
        </div>
    </fieldset>
    <!-- end login-form -->

    <!-- begin send-login-form -->
    <fieldset v-show="sendLogin" class="cmd-login-form flex-container">
        <legend :class="{hidden : !legendForgotLoginForm.show, 'align-left': legendForgotLoginForm.align === 'left'}">
            {{ legendForgotLoginForm.text }}
        </legend>
        <!-- begin CmdHeadline -->
        <CmdHeadline
            v-if="cmdHeadlineSendLoginForm"
            v-bind="cmdHeadlineSendLoginForm"
        />
        <!-- end CmdHeadline -->

        <!-- begin CmdFormElement -->
        <CmdFormElement
            ref="sendPassword"
            element="input"
            type="email"
            @validationStatusChange="checkValidationStatus($event, 'email')"
            v-model="sendLoginMail"
            v-bind="cmdFormElementSendLoginOptions"
        />
        <!-- end CmdFormElement -->

        <!-- begin slot for send-login-form -->
        <slot name="send-login"></slot>
        <!-- end slot for send-login-form -->

        <div class="option-wrapper flex-container">
            <a href="#" @click.prevent="toggleSendLoginView">
                <!-- begin CmdIcon -->
                <CmdIcon
                    v-if="linkBackToLogin.icon && linkBackToLogin.icon.show && linkBackToLogin.icon.iconClass"
                    :iconClass="linkBackToLogin.icon.iconClass"
                    :type="linkBackToLogin.icon.iconType"
                    :title="linkBackToLogin.icon.tooltip"
                />
                <!-- end CmdIcon -->

                <span>
                    {{ linkBackToLogin.text }}
                </span>
            </a>

            <!-- begin link-type 'button' -->
            <button
                v-if="buttonSendLoginOptions.linkType === 'button'"
                v-bind="buttonSendLoginOptions"
                :type="buttonSendLoginOptions.type === 'submit' ? 'submit' : 'button'"
                :class="['button stretch-on-small-devices', { primary: buttonSendLoginOptions.primary }]"
                :disabled="buttonSendLoginDisabled"
            >
                <!-- begin CmdIcon -->
                <CmdIcon
                    v-if="buttonSendLoginOptions.icon?.iconClass"
                    :iconClass="buttonSendLoginOptions.icon?.iconClass"
                    :title="buttonSendLoginOptions.icon?.tooltip"
                />
                <!-- end CmdIcon -->
                <span v-if="buttonSendLoginOptions.text">{{ buttonSendLoginOptions.text }}</span>
            </button>
            <!-- end link-type 'button' -->
        </div>
    </fieldset>
    <!-- end send-login-form -->
</template>

<script>
// import utilities
import {getRoute} from "../utilities.js"

export default {
    name: "CmdLoginForm",
    data() {
        return {
            usernameValidationStatus: false,
            passwordValidationStatus: false,
            emailValidationStatus: false,
            sendLoginMail: "",
            sendLogin: false,
            showLogin: true
        }
    },
    props: {
        /**
         * activate if login with google should be enabled
         */
        enableLoginWithGoogle:
            {
                type: Boolean,
                default: true
            },
        /**
         * activate if login with facebook should be enabled
         */
        enableLoginWithFacebook: {
            type: Boolean,
            default: false
        },
        /**
         * value for v-model (modelValue is default name in vue 3)
         */
        modelValue: {
            type: Object,
            default
                () {
                return {
                    username: "",
                    password: ""
                }
            }
        }
        ,
        /**
         * orientation for inputfields
         *
         * @allowedValues 'vertical', 'horizontal'
         */
        orientation: {
            type: String,
            default:
                null,
            validator(event) {
                return event === "vertical" || event === "horizontal"
            }
        }
        ,
        /**
         * options for legend for login-fieldset
         *
         * @requiredForAccessibility: true
         */
        legendLoginForm: {
            type: Object,
            default
                () {
                return {
                    show: true,
                    align: "right",
                    text: "Login form"
                }
            }
        }
        ,
        /**
         * legend for forgot-login-fieldset
         *
         * @requiredForAccessibility: true
         */
        legendForgotLoginForm: {
            type: Object,
            default
                () {
                return {
                    show: true,
                    align: "right",
                    text: "Forgot login form"
                }
            }
        }
        ,
        /**
         * properties for CmdHeadline-component for login-form
         */
        cmdHeadlineLoginForm: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdHeadline-component for send-login-form
         */
        cmdHeadlineSendLoginForm: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdFormElement-component for username-field
         *
         * @requiredForAccessibility: partial
         */
        cmdFormElementUsername: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdFormElement-component for password-field
         *
         * @requiredForAccessibility: partial
         */
        cmdFormElementPassword: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdFormElement-component for email-address-field (to send login-data)
         *
         * @requiredForAccessibility: partial
         */
        cmdFormElementSendLogin: {
            type: Object,
            required: false
        },
        /**
         * options to display
         *
         * forgotPassword: toggles form to send password by email
         * createAccount: creates a link (href/router) which could lead to a register-form
         */
        linkForgotPassword: {
            type: Object,
            default
                () {
                return {
                    icon: {
                        show: true,
                        iconClass: "icon-questionmark-circle",
                        tooltip: ""
                    },
                    text: "Forgot password"
                }
            }
        },
        /**
         * define link to create an account (that is linked to a register-form i.e.)
         */
        linkCreateAccount: {
            type: Object,
            default() {
                return {
                    linkType: "href",
                    path: "#",
                    icon: {
                        show: true,
                        iconClass: "icon-register",
                        tooltip: ""
                    },
                    text: "Create account"
                }
            }
        },
        /**
         * define link from "forgot-login-form"-view back to the default login-form
         */
        linkBackToLogin: {
            type: Object,
            default
                () {
                return {
                    icon: {
                        show: true,
                        iconClass: "icon-chevron-one-stripe-left",
                        tooltip: ""
                    },
                    text: "Back to login"
                }
            }
        },
        /**
         * button to show login if multiple login possibilities (i.e. google, facebook) are enabled
         *
         * @requiredForAccessibility: partial
         */
        buttonLoginWithYourData: {
            type: Object,
            required: false
        },
        /**
         * button to login
         *
         * @requiredForAccessibility: partial
         */
        buttonLogin: {
            type: Object,
            required: false
        },
        /**
         * button to send-login-data
         *
         * @requiredForAccessibility: partial
         */
        buttonSendLogin: {
            type: Object,
            required: false
        }
    },
    computed: {
        cmdFormElementUsernameOptions() {
            return {
                labelText: "Username:",
                placeholder: "Type in username",
                fieldIconClass: "icon-user-profile",
                name: "login-username",
                id: "login-username",
                required: true,
                ...this.cmdFormElementUsername
            }
        },
        cmdFormElementPasswordOptions() {
            return {
                labelText: "Password:",
                placeholder: "Type in password",
                fieldIconClass: "icon-security-settings",
                name: "login-password",
                id: "login-password",
                required: true,
                ...this.cmdFormElementPassword
            }
        },
        cmdFormElementSendLoginOptions() {
            return {
                labelText: "Email-address:",
                placeholder: "Type in email-address you are registered with",
                fieldIconClass: "icon-mail",
                name: "login-send-login",
                id: "login-send-login",
                required: true,
                ...this.cmdFormElementSendLogin
            }
        },
        buttonLoginWithYourDataDefaultOptions() {
            return {
                linkType: "button", /* href, router, button */
                type: "button", /* submit, button */
                path: "",
                text: "Login with your data",
                primary: false,
                ...this.buttonLoginWithYourData
            }
        },
        buttonLoginDefaultOptions() {
            return {
                linkType: "button", /* href, router, button */
                type: "submit", /* submit, button */
                path: "",
                text: "Login",
                primary: true,
                icon: {
                    show: true,
                    iconClass: "icon-logon",
                    tooltip: ""
                },
                ...this.buttonLogin
            }
        },
        buttonLoginOptions() {
            return {
                type: "submit",
                ...this.buttonLogin
            }
        },
        buttonSendLoginOptions() {
            return {
                linkType: "button", /* href, router, button */
                type: "submit", /* submit, button */
                path: "",
                text: "Send login",
                primary: true,
                icon: {
                    show: true,
                    iconClass: "icon-mail",
                    tooltip: ""
                },
                ...this.buttonSendLogin
            }
        },
        buttonLoginDisabled() {
            return !(this.usernameValidationStatus && this.passwordValidationStatus)
        },
        buttonSendLoginDisabled() {
            return !this.emailValidationStatus
        },
        username: {
            get() {
                return this.modelValue.username
            },
            set(value) {
                this.$emit("update:modelValue", {username: value, password: this.password})
            }
        },
        password: {
            get() {
                return this.modelValue.password
            },
            set(value) {
                this.$emit("update:modelValue", {username: this.username, password: value})
            }
        }
    },
    methods: {
        toggleSendLoginView() {
            this.sendLogin = !this.sendLogin

            this.$nextTick(() => {
                if (this.sendLogin) {
                    this.$refs.sendPassword.setFocus()
                } else {
                    this.$refs.username.setFocus()
                }
            })
        },
        modelChange() {
            this.$emit("update:modelValue", {"username": this.username, "password": this.password})
        },
        onClick(event) {
            this.$emit("click", event)
        },
        getRoute(language) {
            return getRoute(language)
        },
        checkValidationStatus(event, fieldType) {
            if (event == null) {
                return
            }

            if (fieldType === "username") {
                this.usernameValidationStatus = event === "success";
            } else if (fieldType === "password") {
                this.passwordValidationStatus = event === "success";
            } else {
                this.emailValidationStatus = event === "success";
            }
        }
    },
    watch: {
        username() {
            this.modelChange()
        },
        password() {
            this.modelChange()
        },
        enableLoginWithGoogle: {
            handler() {
                this.showLogin = false
            },
            immediate: true
        },
        enableLoginWithFacebook: {
            handler() {
                this.showLogin = false
            },
            immediate: true
        }
    }
}
</script>

<style>
/* begin cmd-login-form ---------------------------------------------------------------------------------------- */
.cmd-login-form {
    .cmd-headline {
        flex: none;
        margin: 0;
    }

    legend.align-left {
        left: 0;
        right: auto;
    }

    .login-fields {
        &.vertical {
            .cmd-form-element {
                width: 100%;
            }
        }
    }

    .option-wrapper {
        flex: none;
        align-items: center;

        > a:not(.button) {
            display: flex;
            text-decoration: none;
        }

        > .button {
            margin-left: auto;
        }
    }

    /* begin google-login-button */
    .gsi-material-button {
        border: var(--button-border);
        border-color: #747775;
        color: #1f1f1f;
        font-family: 'Roboto', arial, sans-serif;
        letter-spacing: 0.25px;
        transition: background-color .218s, border-color .218s, box-shadow .218s;
        white-space: nowrap;

        border-radius: var(--button-border-radius);;
        background-color: var(--color-white);
        height: var(--input-height);
        padding: var(--button-padding);

        .gsi-material-button-icon {
            height: 2rem;
            aspect-ratio: 1/1;
            margin-right: calc(var(--default-margin) / 2);
        }

        .gsi-material-button-content-wrapper {
            align-items: center;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            height: 100%;
            justify-content: space-between;
            position: relative;
            width: 100%;
        }

        .gsi-material-button-contents {
            flex-grow: 1;
            font-family: 'Roboto', arial, sans-serif;
            font-weight: 500;
            text-overflow: ellipsis;
            vertical-align: top;
        }

        .gsi-material-button-state {
            transition: opacity .218s;
            bottom: 0;
            left: 0;
            opacity: 0;
            position: absolute;
            right: 0;
            top: 0;
        }

        .gsi-material-button:disabled {
            background-color: #ffffff61;
            border-color: #1f1f1f1f;

            .gsi-material-button-contents, .gsi-material-button-icon {
                opacity: 38%;
            }

            &:not(:disabled):is(:active, :focus) .gsi-material-button-state {
                background-color: #303030;
                opacity: 12%;
            }

            &:not(:disabled):hover {
                box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);

                .gsi-material-button-state {
                    background-color: #303030;
                    opacity: 8%;
                }
            }
        }
    }

    /* end google-login-button */
}

/* end cmd-login-form ---------------------------------------------------------------------------------------- */
</style>
