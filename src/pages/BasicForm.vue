<template>
    <div class="cmd-pages-basic-form">
        <!-- being CmdForm -->
        <CmdForm @submit="onSubmit"
                 novalidate="novalidate"
                 :textLegend="getMessage('basic_form.legend')"
                 :submitButton="submitButton"
        >
            <div v-if="configuration.salutation" class="flex-container no-flex">
                <!-- begin cmd-form-element -->
                <CmdFormElement
                    element="input"
                    type="radio"
                    :labelText="getMessage('basic_form.labeltext.salutation_male')"
                    :name="configuration.salutation?.name || salutation"
                    inputValue="m"
                    :replaceInputType="configuration.salutation?.replaceInputType"
                    v-model="formData.salutation"
                    @validate="onValidate"
                />
                <!-- end cmd-form-element -->

                <!-- begin cmd-form-element -->
                <CmdFormElement
                    element="input"
                    type="radio"
                    :labelText="getMessage('basic_form.labeltext.salutation_female')"
                    :name="configuration.salutation?.name || salutation"
                    inputValue="f"
                    :replaceInputType="configuration.salutation?.replaceInputType"
                    v-model="formData.salutation"
                    @validate="onValidate"
                />
                <!-- end cmd-form-element -->
            </div>

            <!-- begin slot (top) -->
            <slot name="top"></slot>
            <!-- end slot (top) -->

            <div v-if="configuration.lastName || configuration.firstName" class="flex-container">
                <!-- begin cmd-form-element -->
                <CmdFormElement
                    v-if="configuration.lastName"
                    element="input"
                    :type="configuration.lastName?.type || 'text'"
                    iconClass="icon-user-profile"
                    :labelText="getMessage('basic_form.labeltext.last_name')"
                    :required="configuration.lastName?.required"
                    :name="configuration.lastName?.name || 'last-name'"
                    :placeholder="getMessage('basic_form.placeholder.last_name')"
                    v-model="formData.lastName.value"
                    :status="formData.lastName.error ? 'error' : ''"
                    @validate="onValidate"
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
                    :name="configuration.firstName?.name || 'first-name'"
                    v-model="formData.firstName.value"
                    :status="formData.firstName.error ? 'error' : ''"
                    @validate="onValidate"
                />
                <!-- end cmd-form-element -->
            </div>
            <div v-if="configuration.email || configuration.phone" class="flex-container">
                <!-- begin cmd-form-element -->
                <CmdFormElement
                    v-if="configuration.email"
                    element="input"
                    :type="configuration.email?.type || 'email'"
                    iconClass="icon-mail"
                    :labelText="getMessage('basic_form.labeltext.email')"
                    :placeholder="getMessage('basic_form.placeholder.email')"
                    :required="configuration.email?.required"
                    :name="configuration.email?.name || 'email'"
                    v-model="formData.email.value"
                    :status="formData.email.error ? 'error' : ''"
                    @validate="onValidate"
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
                    :name="configuration.phone?.name || 'phone'"
                    :status="formData.phone.error ? 'error' : ''"
                    @validate="onValidate"
                />
                <!-- end cmd-form-element -->
            </div>

            <div v-if="configuration.streetNo || configuration.zip || configuration.city" class="flex-container">
                <!-- begin cmd-form-element -->
                <CmdFormElement
                    v-if="configuration.streetNo"
                    element="input"
                    :type="configuration.streetNo?.type || 'text'"
                    :labelText="getMessage('basic_form.labeltext.street_no')"
                    :placeholder="getMessage('basic_form.placeholder.street_no')"
                    :required="configuration.streetNo?.required"
                    :name="configuration.streetNo?.name || 'street-no'"
                    v-model="formData.streetNo.value"
                    :status="formData.streetNo.error ? 'error' : ''"
                    @validate="onValidate"
                />
                <!-- end cmd-form-element -->

                <div class="input-wrapper">
                    <!-- begin cmd-form-element -->
                    <CmdFormElement
                        v-if="configuration.zip"
                        element="input"
                        :type="configuration.zip?.type || 'number'"
                        :labelText="getMessage('basic_form.labeltext.zip')"
                        :placeholder="getMessage('basic_form.placeholder.zip')"
                        :required="configuration.zip?.required"
                        :name="configuration.zip?.name || 'zip'"
                        v-model="formData.zip.value"
                        :status="formData.zip.error ? 'error' : ''"
                        @validate="onValidate"
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
                        :name="configuration.city?.name || 'zip'"
                        v-model="formData.city.value"
                        :status="formData.city.error ? 'error' : ''"
                        @validate="onValidate"
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
                    :name="configuration.additionalAddressInfo?.name || 'additional-address-info'"
                    v-model="formData.additionalAddressInfo.value"
                    :status="formData.additionalAddressInfo.error ? 'error' : ''"
                    @validate="onValidate"
                />
                <!-- end cmd-form-element -->
            </div>

            <!-- begin cmd-form-element -->
            <CmdFormElement
                v-if="configuration.additionalText"
                :element="configuration.additionalText?.element || 'textarea'"
                :labelText="getMessage('basic_form.labeltext.additional_text')"
                :placeholder="getMessage('basic_form.placeholder.additional_text')"
                :required="configuration.additionalText?.required"
                :name="configuration.additionalText?.name || 'additional-text'"
                v-model="formData.additionalText.value"
                :status="formData.additionalText.error ? 'error' : ''"
                @validate="onValidate"
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
                :required="configuration.acceptPrivacy?.required"
                :name="configuration.acceptPrivacy?.name || 'accept-privacy'"
                :replaceInputType="configuration.acceptPrivacy?.replaceInputType"
                v-model="formData.acceptPrivacy.value"
                :status="formData.acceptPrivacy.error ? 'error' : ''"
                @validate="onValidate">
                <template v-slot:labeltext>
                    <span ref="dataPrivacy" v-html="getMessage('basic_form.labeltext.data_privacy')"></span>
                </template>
            </CmdFormElement>
            <!-- end cmd-form-element -->
        </CmdForm>
        <!-- end CmdForm -->
    </div>
</template>

<script>
// import mixins
import I18n from "../mixins/I18n"
import DefaultMessageProperties from "../mixins/pages/BasicForm/DefaultMessageProperties"
import FieldValidation from "../mixins/FieldValidation"

export default {
    mixins: [
        I18n,
        DefaultMessageProperties,
        FieldValidation
    ],
    inject: {
        editModeContext: {
            default: null
        }
    },
    data() {
        return {
            //validator: new ContactFormValidator(name => this.label(name)),
            formData: {
                salutation: this.configuration.salutation.default,
                lastName: {value: ''},
                firstName: {value: ''},
                email: {value: ''},
                phone: {value: ''},
                streetNo: {value: ''},
                zip: {value: ''},
                city: {value: ''},
                additionalAddressInfo: {value: ''},
                additionalText: {value: ''},
                acceptPrivacy: {value: false}
            },
            nativeButton: {
                icon: {
                    show: true,
                    iconClass: "icon-message-send",
                    tooltip: "Send message"
                },
                text: "Send"
            }
        }
    },
    props: {
        /**
         * configuration for form-elements used in form
         */
        configuration: {
            type: Object,
            default() {
                return {
                    salutation: {
                        name: "salutation",
                        default: "m",
                        replaceInputType: true
                    },
                    lastName: {
                        name: "surname",
                        required: true,
                        type: "text"
                    },
                    firstName: {
                        required: false,
                        type: "text"
                    },
                    email: {
                        required: true,
                        type: "email"
                    },
                    phone: {
                        required: false,
                        type: "phone"
                    },
                    streetNo: {
                        required: false,
                        type: "text"
                    },
                    zip: {
                        required: false,
                        type: "number"
                    },
                    city: {
                        required: false,
                        type: "text"
                    },
                    additionalAddressInfo: {
                        required: false,
                        type: "text"
                    },
                    additionalText: {
                        required: false,
                        element: "textarea"
                    },
                    acceptPrivacy: {
                        required: true,
                        replaceInputType: true
                    }
                }
            }
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
            default() {
                return {
                    iconClass: "icon-message-send",
                    text: "Send mail",
                    type: "submit",
                    position: "belowFieldset",
                    primary: true
                }
            }
        }
    },
    mounted() {
        this.$refs.dataPrivacy?.querySelector('.fancybox')?.addEventListener('click', event => {
            event.preventDefault()
            openFancyBox({url: event.target.getAttribute('href')})
        })
    },
    methods: {
        onSubmit(event) {
            this.onValidate();

            this.formData = Object.assign({}, this.validator.validatePrivacy(this.formData));
            if (this.formData.error) {
                event.preventDefault();
                return;
            }

            event.preventDefault();
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
    }
}
</script>

<style>
.cmd-pages-basic-form {
    fieldset {
        margin: 0;
    }
}
</style>

