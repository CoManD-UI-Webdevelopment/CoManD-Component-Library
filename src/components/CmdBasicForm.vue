<template>
    <div class="cmd-pages-basic-form">
        <!-- begin CmdHeadline -->
        <CmdHeadline v-if="cmdHeadline" v-bind="cmdHeadline" />
        <!-- end CmdHeadline -->

        <!-- begin CmdForm -->
        <CmdForm
            @submit="onSubmit"
            :class="{'send-success': sendSuccessfully}"
            novalidate="novalidate"
            v-bind="cmdForm"
            :legend="legend"
            :submitButton="submitButtonProperties"
            :formAction="formAction"
            ref="form"
            class="flex-container flex-direction-column"
        >
            <div v-if="configuration.salutation" class="flex-container flex-none row-for-small order-male-female">
                <!-- begin cmd-form-element -->
                <CmdFormElement
                    element="input"
                    type="radio"
                    :labelText="getMessage('basic_form.labeltext.salutation_male')"
                    :name="configuration.salutation?.name"
                    inputValue="m"
                    :replaceInputType="configuration.salutation?.replaceInputType"
                    v-model="formData.salutation.value"
                    :i18n="i18n"
                />
                <!-- end cmd-form-element -->

                <!-- begin cmd-form-element -->
                <CmdFormElement
                    element="input"
                    type="radio"
                    :labelText="getMessage('basic_form.labeltext.salutation_female')"
                    :name="configuration.salutation?.name"
                    inputValue="f"
                    :replaceInputType="configuration.salutation?.replaceInputType"
                    v-model="formData.salutation.value"
                    :i18n="i18n"
                />
                <!-- end cmd-form-element -->
            </div>

            <!-- begin slot (top) -->
            <slot name="top"></slot>
            <!-- end slot (top) -->

            <div v-if="configuration.lastName || configuration.firstName" class="flex-container order-lastname-firstname">
                <!-- begin cmd-form-element -->
                <CmdFormElement
                    v-if="configuration.lastName"
                    element="input"
                    :type="configuration.lastName?.type || 'text'"
                    iconClass="icon-user-profile"
                    :labelText="getMessage('basic_form.labeltext.last_name')"
                    :required="configuration.lastName?.required"
                    :name="configuration.lastName?.name"
                    :placeholder="getMessage('basic_form.placeholder.last_name')"
                    v-model="formData.lastName.value"
                    :status="formData.lastName.error ? 'error' : ''"
                    :i18n="i18n"
                    :showStatusIcon="false"
                />
                <!-- end cmd-form-element -->

                <!-- begin cmd-form-element -->
                <CmdFormElement
                    v-if="configuration.firstName"
                    element="input"
                    :type="configuration.firstName?.type || 'text'"
                    iconClass="icon-user-profile"
                    :labelText="getMessage('basic_form.labeltext.first_name')"
                    :placeholder="getMessage('basic_form.placeholder.first_name')"
                    :required="configuration.firstName?.required"
                    :name="configuration.firstName?.name"
                    v-model="formData.firstName.value"
                    :status="formData.firstName.error ? 'error' : ''"
                    :i18n="i18n"
                />
                <!-- end cmd-form-element -->
            </div>
            <div v-if="configuration.email || configuration.phone" class="flex-container order-phone-email">
                <!-- begin cmd-form-element -->
                <CmdFormElement
                    v-if="configuration.email"
                    element="input"
                    :type="configuration.email?.type || 'email'"
                    iconClass="icon-mail"
                    :labelText="getMessage('basic_form.labeltext.email')"
                    :placeholder="getMessage('basic_form.placeholder.email')"
                    :required="configuration.email?.required"
                    :name="configuration.email?.name"
                    v-model="formData.email.value"
                    :status="formData.email.error ? 'error' : ''"
                    :i18n="i18n"
                    :showStatusIcon="false"
                />
                <!-- end cmd-form-element -->

                <!-- begin cmd-form-element -->
                <CmdFormElement
                    v-if="configuration.phone"
                    element="input"
                    :type="configuration.phone?.type || 'tel'"
                    iconClass="icon-phone"
                    :labelText="getMessage('basic_form.labeltext.phone')"
                    :placeholder="getMessage('basic_form.placeholder.phone')"
                    v-model="formData.phone.value"
                    :required="configuration.phone?.required"
                    :name="configuration.phone?.name"
                    :status="formData.phone.error ? 'error' : ''"
                    :i18n="i18n"
                />
                <!-- end cmd-form-element -->
            </div>

            <div v-if="configuration.streetNo || configuration.streetNo || (configuration.zip && configuration.city)" class="flex-container">
                <!-- begin cmd-form-element -->
                <CmdFormElement
                    v-if="configuration.country"
                    element="select"
                    :labelText="getMessage('basic_form.labeltext.country')"
                    :selectOptions="configuration.country?.selectOptions"
                    :required="configuration.country?.required"
                    :name="configuration.country?.name"
                    v-model="formData.country.value"
                    :status="formData.country.error ? 'error' : ''"
                    :i18n="i18n"
                    @update:modelValue="onCountrySelect"
                />
                <!-- end cmd-form-element -->

                <!-- begin cmd-form-element -->
                <CmdFormElement
                    v-if="configuration.streetNo"
                    element="input"
                    :type="configuration.streetNo?.type || 'text'"
                    :labelText="getMessage('basic_form.labeltext.street_no')"
                    :placeholder="getMessage('basic_form.placeholder.street_no')"
                    :required="configuration.streetNo?.required"
                    :name="configuration.streetNo?.name"
                    v-model="formData.streetNo.value"
                    :status="formData.streetNo.error ? 'error' : ''"
                    :i18n="i18n"
                />
                <!-- end cmd-form-element -->

                <!-- begin cmd-form-element -->
                <CmdFormElement
                    v-if="configuration.pobox"
                    element="input"
                    :type="configuration.pobox?.type || 'text'"
                    :labelText="getMessage('basic_form.labeltext.pobox')"
                    :placeholder="getMessage('basic_form.placeholder.pobox')"
                    :required="configuration.pobox?.required"
                    :name="configuration.pobox?.name"
                    v-model="formData.pobox.value"
                    :status="formData.pobox.error ? 'error' : ''"
                    :i18n="i18n"
                />
                <!-- end cmd-form-element -->

                <div class="input-wrapper" :class="cityBeforeZip ? 'order-city-zip' : 'order-zip-city'">
                    <!-- begin cmd-form-element -->
                    <CmdFormElement
                        v-if="configuration.zip"
                        element="input"
                        class="input-zip"
                        :type="configuration.zip?.type || 'number'"
                        :labelText="getMessage('basic_form.labeltext.zip')"
                        :placeholder="getMessage('basic_form.placeholder.zip')"
                        :required="configuration.zip?.required"
                        :name="configuration.zip?.name"
                        v-model="formData.zip.value"
                        :status="formData.zip.error ? 'error' : ''"
                        :i18n="i18n"
                    />
                    <!-- end cmd-form-element -->

                    <!-- begin cmd-form-element -->
                    <CmdFormElement
                        v-if="configuration.city"
                        element="input"
                        :type="configuration.city?.type || 'text'"
                        :labelText="getMessage('basic_form.labeltext.city')"
                        :placeholder="getMessage('basic_form.placeholder.city')"
                        :required="configuration.city?.required"
                        :name="configuration.city?.name"
                        v-model="formData.city.value"
                        :status="formData.city.error ? 'error' : ''"
                        :i18n="i18n"
                    />
                    <!-- end cmd-form-element -->
                </div>

                <!-- begin cmd-form-element -->
                <CmdFormElement
                    v-if="configuration.additionalAddressInfo"
                    element="input"
                    :type="configuration.additionalAddressInfo?.type || 'text'"
                    :labelText="getMessage('basic_form.labeltext.additional_address_info')"
                    :placeholder="getMessage('basic_form.placeholder.additional_address_info')"
                    :required="configuration.additionalAddressInfo?.required"
                    :name="configuration.additionalAddressInfo?.name"
                    v-model="formData.additionalAddressInfo.value"
                    :status="formData.additionalAddressInfo.error ? 'error' : ''"
                    :i18n="i18n"
                />
                <!-- end cmd-form-element -->
            </div>

            <!-- begin cmd-form-element -->
            <CmdFormElement
                v-if="configuration.userMessage"
                :element="configuration.userMessage?.element || 'textarea'"
                :labelText="getMessage('basic_form.labeltext.user_message')"
                :placeholder="getMessage('basic_form.placeholder.user_message')"
                :required="configuration.userMessage?.required"
                :name="configuration.userMessage?.name"
                :textCharactersLeft="getMessage('basic_form.text.characters_left')"
                :maxlength="configuration.userMessage?.maxLength"
                v-model="formData.userMessage.value"
                :status="formData.userMessage.error ? 'error' : ''"
                :i18n="i18n"
                :showStatusIcon="false"
            />
            <!-- end cmd-form-element -->

            <!-- begin slot (bottom) -->
            <slot name="bottom"></slot>
            <!-- end slot (bottom) -->

            <!-- begin cmd-form-element -->
            <CmdFormElement
                v-if="configuration.acceptPrivacy"
                element="input"
                type="checkbox"
                class="flex-none"
                :required="configuration.acceptPrivacy?.required"
                :name="configuration.acceptPrivacy?.name"
                :replaceInputType="configuration.acceptPrivacy?.replaceInputType"
                v-model="formData.acceptPrivacy.value"
                :status="formData.acceptPrivacy.error ? 'error' : ''"
                :i18n="i18n"
                >
                <template v-slot:labeltext>
                    <span ref="dataPrivacy" v-html="getMessage('basic_form.labeltext.data_privacy')"></span>
                </template>
            </CmdFormElement>
            <!-- end cmd-form-element -->

            <!-- button to test a successful sending
            <button class="button" type="button" @click="onSuccess">On Success</button>
            -->
        </CmdForm>
        <!-- end CmdForm -->
    </div>
</template>

<script>
// import mixins
import I18n from "../mixins/I18n.js"
import DefaultMessageProperties from "../mixins/CmdBasicForm/DefaultMessageProperties.js"

// import functions
import {ContactFormValidator} from "../utils/ContactFormValidation.js"
import {openFancyBox} from "./CmdFancyBox.vue"

export default {
    emits: ["submit"],
    mixins: [
        I18n,
        DefaultMessageProperties
    ],
    inject: {
        editModeContext: {
            default: null
        }
    },
    data() {
        return {
            sendSuccessfully: false,
            validator: new ContactFormValidator(label => label),
            formData: {
                salutation: {value: this.configuration.salutation.default},
                lastName: {value: ''},
                firstName: {value: ''},
                email: {value: ''},
                phone: {value: ''},
                streetNo: {value: ''},
                zip: {value: ''},
                city: {value: ''},
                pobox: {value: ''},
                country: {value: ''},
                additionalAddressInfo: {value: ''},
                userMessage: {value: ''},
                acceptPrivacy: {value: false}
            },
            cityBeforeZip: this.showCityBeforeZip
        }
    },
    props: {
        /**
         * website-key for Google-recaptcha v3
         */
        reCaptchaWebsiteKey: {
            type: String,
            required: false
        },
        /**
         * activate if native submit-event should be used
         */
        useNativeSubmit: {
            type: Boolean,
            default: false
        },
        /**
         * set url for form-action
         */
        formAction: {
            type: String,
            required: false
        },
        /**
         * legend for form
         *
         * useFieldset-property must be activated
         *
         * @requiredForAccessiblity: true
         */
        legend: {
            type: Object,
            default() {
                return {
                    show: true,
                    align: "right",
                    text: "Legend"
                }
            }
        },
        /**
         * configuration for form-elements used in form
         */
        configuration: {
            type: Object,
            default() {
                return {
                    salutation: {
                        default: "m",
                        replaceInputType: true,
                        name: "salutation"
                    },
                    lastName: {
                        required: true,
                        type: "text",
                        name: "last-name"
                    },
                    firstName: {
                        required: false,
                        type: "text",
                        name: "first-name"
                    },
                    email: {
                        required: true,
                        type: "email",
                        name: "email"
                    },
                    phone: {
                        required: false,
                        type: "phone",
                        name: "phone"
                    },
                    country: {
                        required: false,
                        element: "select",
                        name: "country",
                        selectOptions: [
                            {
                                text: "Please select...",
                                value: ""
                            },
                            {
                                text: "United States",
                                value: "us"
                            },
                            {
                                text: "Germany",
                                value: "de"
                            },
                        ]
                    },
                    streetNo: {
                        required: false,
                        type: "text",
                        name: "street-no"
                    },
                    zip: {
                        required: false,
                        type: "number",
                        name: "zip"
                    },
                    city: {
                        required: false,
                        type: "text",
                        name: "city"
                    },
                    additionalAddressInfo: {
                        required: false,
                        type: "text",
                        name: "additional-address-info"
                    },
                    userMessage: {
                        required: true,
                        element: "textarea",
                        name: "user-message"
                    },
                    acceptPrivacy: {
                        required: true,
                        replaceInputType: true,
                        name: "accept-privacy"
                    }
                }
            }
        },
        /**
         * activate to show city first/left then zip next/right
         */
        showCityBeforeZip: {
            type: Boolean,
            default: false
        },
        /**
         * receiver e-mail-address the form is sent to
         */
        receiverEmailAddress: {
            type: String,
            default: ""
        },
        /**
         * submit-button to submit all form-data
         */
        submitButton: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdForm-component
         */
        cmdForm: {
            type: Object,
            required: false
        }
    },
    mounted() {
        this.$refs.dataPrivacy?.querySelector(".component-fancybox")?.addEventListener("click", event => {
            event.preventDefault()
            openFancyBox({url: event.target.getAttribute("href")})
        })
    },
    computed: {
        submitButtonProperties() {
            return {
                iconClass: "icon-message-send",
                text: "Send mail",
                type: "submit",
                position: "belowFieldset",
                primary: true,
                ...this.submitButton
            }
        }
    },
    methods: {
        /*
        onSuccess() {
            this.sendSuccessfully = true
            try {
                // reset global validation-status
                this.formData.error = false

                for (let key in this.formData) {
                    // reset field-validation-status
                    if(this.formData[key].error) {
                        this.formData[key].error = false
                    }

                    // reset field-values
                    if(typeof this.formData[key].value === "string") {
                        if(key === "salutation") {
                            this.formData[key].value = this.configuration.salutation.default
                        } else {
                            this.formData[key].value = ""
                        }
                    } else if(key === "acceptPrivacy") {
                        this.formData[key].value = false
                    }
                }
            } catch (error) {
                console.error(error)
            }
        },
        */
        onSubmit(event) {
            this.onValidate()
            this.formData = Object.assign({}, this.validator.validatePrivacy(this.formData));

            if (this.formData.error || this.useNativeSubmit) {
                if(this.formData.error) {
                    // prevent original event from CmdForm (to avoid submit and reload)
                    event.originalEvent.preventDefault()
                }
                return
            }

            // prevent original levent form CmdForm (to avoid submit and reload)
            event.originalEvent.preventDefault()

            if(this.reCaptchaWebsiteKey && window.grecaptcha) {
                grecaptcha.ready(() => {
                    grecaptcha.execute(this.reCaptchaWebsiteKey, {action: "submit"}).then(token => this.submitForm(token)).catch(error => console.log("recaptcha error", error))
                })
            } else {
                this.submitForm()
            }
        },
        submitForm(token) {
            this.sendSuccessfully = false

            // custom submit of form-data
            const customSubmitFormData = new FormData()

            if(token) {
                customSubmitFormData.set("recaptchaToken", token)
            }

            // get keys for form-elements from configuration
            const configurationEntries = Object.keys(this.configuration)

            for(let i = 0; i < configurationEntries.length; i++) {
                // assign formData values to form-element key
                customSubmitFormData.set(this.configuration[configurationEntries[i]].name, this.formData[configurationEntries[i]].value)
            }

            fetch(this.formAction, {method: this.cmdForm?.formMethod || "POST", body: customSubmitFormData}).then((response) => {
                if(response.ok) {
                    this.sendSuccessfully = true
                    this.$refs.form.showMessage("success", this.getMessage("basic_form.system_message.success.message_sent_successfully"))
                    try {
                        // reset global validation-status
                        this.formData.error = false

                        for (let key in this.formData) {
                            // reset field-validation-status
                            if(this.formData[key].error) {
                                this.formData[key].error = false
                            }

                            // reset field-values
                            if(typeof this.formData[key].value === "string") {
                                if(key === "salutation") {
                                    this.formData[key].value = this.configuration.salutation.default
                                } else {
                                    this.formData[key].value = ""
                                }
                            } else if (key === "acceptPrivacy") {
                                this.formData[key].value = false
                            }
                        }
                    } catch (error) {
                        console.error(error)
                    }
                } else {
                    this.$refs.form.showMessage("error", this.getMessage("basic_form.system_message.error.message_could_not_be_sent"))
                }
            }).catch((error) => {
                this.$refs.form.showMessage("error", this.getMessage("basic_form.system_message.error.message_could_not_be_sent"))
                console.error(error)
            })
        },
        onCountrySelect(event) {
          this.cityBeforeZip = event === 'us' || event === 'uk';
        },
        onValidate() {
            this.formData = Object.assign({}, this.validator.validate(this.formData));
        },
        executeLink(link, event) {
            if (link.fancybox) {
                event.preventDefault()
                openFancyBox({url: link})
            }
        },
        openDataPrivacy(url) {
            openFancyBox({url})
        }
    },
    watch: {
        showCityBeforeZip() {
            this.cityBeforeZip = this.showCityBeforeZip
        }
    }
}
</script>

<style>
.cmd-pages-basic-form {
    fieldset {
        margin: 0;

        .order-city-zip {
            flex-direction: row-reverse;
        }

        .input-zip {
            max-width: 30%;
        }
    }
}

/* overwrite inline-style from google-recaptcha to avoid collision with back-to-top-button */
.grecaptcha-badge {
    bottom: 10rem !important;
}
</style>

