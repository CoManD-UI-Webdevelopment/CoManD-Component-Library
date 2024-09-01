<template>
    <!-- begin login-form -->
    <fieldset v-show="!sendLogin" class="cmd-login-form flex-container">
        <legend :class="{hidden : !legendLoginForm.show, 'align-left': legendLoginForm.align === 'left'}">{{ legendLoginForm.text }}</legend>
        <!-- begin CmdHeadline -->
        <CmdHeadline
            v-if="cmdHeadlineLoginForm"
            v-bind="cmdHeadlineLoginForm"
        />
        <!-- end CmdHeadline -->

        <!-- begin form elements -->
        <div :class="['login-fields flex-container', {'vertical': orientation === 'vertical'}]">
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
            <template v-if="options.forgotPassword || options.createAccount">
                <!-- begin link for 'forgot password' -->
                <a v-if="options.forgotPassword" href="#" @click.prevent="toggleSendLoginView">
                    <!-- begin CmdIcon -->
                    <CmdIcon v-if="options.forgotPassword.icon?.show && options.forgotPassword.icon?.iconClass"
                          :iconClass="options.forgotPassword.icon.iconClass"
                          :type="options.forgotPassword.icon.iconType"
                          :title="options.forgotPassword.icon.tooltip"
                    />
                    <!-- end CmdIcon -->
                    <span v-if="options.forgotPassword.text">{{ options.forgotPassword.text }}</span>
                </a>
                <!-- end link for 'forgot password' -->

                <!-- begin link for 'create account' -->
                <template v-if="options.createAccount">
                    <!-- begin CmdLink -->
                    <CmdLink
                        :linkType="options.createAccount.linkType"
                        :path="options.createAccount.path"
                        :text="options.createAccount.text"
                        :icon="{
                            iconClass: options.createAccount.icon?.iconClass,
                            tooltip: options.createAccount.icon?.tooltip,
                            position: options.createAccount.icon?.position
                        }"
                    />
                    <!-- end CmdLink -->
                </template>
                <!-- end link for 'create account' -->
            </template>

            <!-- begin link-type 'button' -->
            <button
                v-if="buttonLoginOptions.linkType === 'button'"
                :type="buttonLoginOptions.type === 'submit' ? 'submit' : 'button'"
                :class="['button', { primary: buttonLoginOptions.primary }]"
                @click="onClick"
                :disabled="buttonLoginDisabled"
            >
                <!-- begin CmdIcon -->
                <CmdIcon
                    v-if="buttonLoginOptions.icon.iconClass"
                    :iconClass="buttonLoginOptions.icon.iconClass"
                    :type="buttonLoginOptions.icon.iconType"
                    :title="buttonLoginOptions.icon.tooltip"
                />
                <!-- end CmdIcon -->
                <span v-if="buttonLoginOptions.text">{{ buttonLoginOptions.text }}</span>
            </button>
            <!-- begin link-type 'button' -->
        </div>
    </fieldset>
    <!-- end login-form -->

    <!-- begin send-login-form -->
    <fieldset v-show="sendLogin" class="cmd-login-form flex-container">
        <legend :class="{hidden : !legendForgotLoginForm.show, 'align-left': legendForgotLoginForm.align === 'left'}">{{ legendForgotLoginForm .text }}</legend>
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
            <a v-if="options.backToLoginForm" href="#" @click.prevent="toggleSendLoginView">
                <!-- begin CmdIcon -->
                <CmdIcon
                    v-if="options.backToLoginForm && options.backToLoginForm.icon && options.backToLoginForm.icon.show && options.backToLoginForm.icon.iconClass"
                    :iconClass="options.backToLoginForm.icon.iconClass"
                    :type="options.backToLoginForm.icon.iconType"
                    :title="options.backToLoginForm.icon.tooltip"
                />
                <!-- end CmdIcon -->
                <span v-if="options.backToLoginForm.text">
                  {{ options.backToLoginForm.text }}
                </span>
            </a>

            <!-- begin link-type 'button' -->
            <button
                v-if="buttonSendLoginOptions.linkType === 'button'"
                :type="buttonSendLoginOptions.type === 'submit' ? 'submit' : 'button'"
                :class="['button', { primary: buttonSendLoginOptions.primary }]"
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
            sendLogin: false
        }
    },
    props: {
        /**
         * value for v-model (modelValue is default name in vue 3)
         */
        modelValue: {
            type: Object,
            default() {
                return {
                    username: "",
                    password: ""
                }
            }
        },
        /**
         * orientation for inputfields
         *
         * @allowedValues 'vertical', 'horizontal'
         */
        orientation: {
            type: String,
            default: null,
            validator(event) {
                return event === "vertical" || event === "horizontal"
            }
        },
        /**
         * options for legend for login-fieldset
         *
         * @requiredForAccessibility: true
         */
        legendLoginForm: {
            type: Object,
            default() {
                return {
                    show: true,
                    align: "right",
                    text: "Login form"
                }
            }
        },
        /**
         * toggle legend visibility
         */
        showLegend: {
            type: Boolean,
            default: true
        },
        /**
         * legend for forgot-login-fieldset
         *
         * @requiredForAccessibility: true
        */
        legendForgotLoginForm: {
            type: Object,
            default() {
                return {
                    show: true,
                    align: 'right"',
                    text: 'Forgot login form'
                }
            }
        },
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
        options: {
            type: Object,
            default() {
                return {
                    forgotPassword: {
                        icon: {
                            show: true,
                            iconClass: "icon-questionmark-circle",
                            tooltip: ""
                        },
                        text: "Forgot password"
                    },
                    createAccount: {
                        linkType: "href",
                        path: "#",
                        icon: {
                            show: true,
                            iconClass: "icon-register",
                            tooltip: ""
                        },
                        text: "Create new account"
                    },
                    backToLoginForm: {
                        icon: {
                            show: true,
                            iconClass: "icon-chevron-one-stripe-left",
                            tooltip: ""
                        },
                        text: "Back to login form"
                    }
                }
            }
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
        buttonLoginOptions() {
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
                if(this.sendLogin) {
                    this.$refs.sendPassword.setFocus()
                } else {
                    this.$refs.username.setFocus()
                }
            })
        },
        modelChange() {
            this.$emit("update:modelValue", { "username": this.username, "password": this.password })
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
            align-items: center;
            text-decoration: none;
            flex: none;
        }

        > .button {
            margin-left: auto;
        }
    }
}
/* end cmd-login-form ---------------------------------------------------------------------------------------- */
</style>
