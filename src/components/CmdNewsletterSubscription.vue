<template>
    <fieldset class="cmd-newsletter-subscription flex-container">
        <!-- begin legend -->
        <legend :class="{hidden : !legend.show, 'align-left': legend.align === 'left'}">{{ legend.text }}</legend>
        <!-- end legend -->

        <!-- begin cmd-input-group -->
        <CmdInputGroup
            inputTypes="radio"
            :labelText="cmdInputGroup.labelText"
            :showLabel="cmdInputGroup.showLabel"
            :inputElements="cmdInputGroup.inputElements"
            v-model="subscription"
        />
        <!-- end cmd-input-group -->

        <!-- begin cmd-form-element -->
        <CmdFormElement
            element="input"
            type="email"
            :placeholder="cmdFormElementEmail.placeholder"
            :labelText="cmdFormElementEmail.labelText"
            id="cmd-email-newsletter-subscription"
            :required="cmdFormElementEmail.required"
            :useCustomTooltip="cmdFormElementEmail.useCustomTooltip"
            v-model="email"
            @validationStatusChange="checkValidationStatus"
        />
        <!-- end cmd-form-element -->

        <div class="button-wrapper">
            <!-- begin cmd-form-element -->
            <CmdFormElement
                element="button"
                :type="buttonType"
                :disabled="buttonDisabled"
                :nativeButton="cmdFormElementSubmitDynamicLabel"
                @click="sendData"
            />
            <!-- end cmd-form-element -->
        </div>
    </fieldset>
</template>

<script>
export default {
    name: "CmdNewsletterSubscription",
    emits: ["button-click"],
    data() {
        return {
            buttonDisabled: true
        }
    },
    props: {
        /**
         * set value for v-model (must be named modelValue in vue3 if default v-model should be used)
         */
        modelValue: {
            type: Object,
            default() {
                return {
                    subscription: "subscribe",
                    email: ""
                }
            }
        },
        /**
         * set type for button
         *
         * @allowedValues: "submit", "button"
         */
        buttonType: {
            type: String,
            default: "button",
            validator(value) {
                return value === "submit" || value === "button"
            }
        },
        /**
         * legend for form
         *
         * useFieldset-property must be activated
         *
         * @requiredForAccessiblity: true
         */
        legend: {
            default() {
                return {
                    show: true,
                    align: "left",
                    text: "Legend"
                }
            }
        },
        /**
         * properties for CmdInputGroup-component
         */
        cmdInputGroup: {
            type: Object,
            default: function () {
                return {
                    labelText: "Choose option",
                    showLabel: false,
                    inputElements: [
                        {
                            labelText: "Subscribe",
                            id: "radio-subscribe",
                            name: "cmd-subscribe-group",
                            value: "subscribe"
                        },
                        {
                            labelText: "Unsubscribe",
                            id: "radio-unsubscribe",
                            name: "cmd-subscribe-group",
                            value: "unsubscribe"
                        }
                    ]
                }
            }
        },
        /**
         * properties for CmdFormElement-component for email-field
         */
        cmdFormElementEmail: {
            type: Object,
            default: function () {
                return {
                    labelText: "Email-Address:",
                    placeholder: "Enter your email-address",
                    required: true
                }
            }
        },
        /**
         * properties for CmdFormElement-component for submit-button
         */
        cmdFormElementSubmit: {
            type: Object,
            default: function () {
                return {
                    text: "Submit",
                    icon: {
                        show: true,
                        iconClass: "icon-message-send",
                        position: "before",
                        tooltip: ""
                    }
                }
            }
        }
    },
    computed: {
        cmdFormElementSubmitDynamicLabel() {
            return this.updateButtonLabelText
        },
        updateButtonLabelText() {
            const button = {...this.cmdFormElementSubmit}
            button.text = this.subscription === "subscribe" ? "Subscribe now" : "Unsubscribe from list"
            return button
        },
        subscription: {
            get() {
                return this.modelValue.subscription || "subscribe"
            },
            set(value) {
                this.$emit("update:modelValue", {subscription: value, email: this.email})
            }
        },
        email: {
            get() {
                return this.modelValue.email
            },
            set(value) {
                this.$emit("update:modelValue", {subscription: this.subscription, email: value})
            }
        }
    },
    methods: {
        sendData(event) {
            this.$emit("button-click", {subscription: this.subscription, email: this.email, originalEvent: event})
        },
        checkValidationStatus(event) {
            this.buttonDisabled = event !== "success"
        }
    },
    watch: {
        modelValue: {
            handler() {
                return this.updateButtonLabelText
            },
            deep: true,
            immediate: true
        }
    }
}
</script>