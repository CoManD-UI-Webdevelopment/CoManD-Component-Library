<template>
    <div class="cmd-pages-basic-form">
        <!-- being CmdForm -->
        <CmdForm :action="formAction"
                 @submit="onSubmit"
                 novalidate="novalidate"
                 :textLegend="getMessage('basic_form.legend')"
                 :submitButton="submitButton"
        >
            <div class="flex-container no-flex">
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

            <div class="flex-container">
                <!-- begin cmd-form-element -->
                <CmdFormElement
                    v-if="configuration.lastName"
                    element="input"
                    :type="configuration.lastName?.type || 'text'"
                    iconClass="icon-user-profile"
                    :labelText="getMessage('basic_form.labeltext.last_name')"
                    :tooltipText="formData.lastName.error ? formData.lastName.errorMessage :  'Type your surname!'"
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
                    :tooltipText="formData.firstName.error ? formData.firstName.errorMessage :  'Type your first name!'"
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
                    :tooltipText="formData.email.error ? formData.email.errorMessage :  'Type your email!'"
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
                    :tooltipText="formData.phone.error ? formData.phone.errorMessage :  'Type your phone number!'"
                    @validate="onValidate"
                />
                <!-- end cmd-form-element -->
            </div>

            <div class="flex-container">
                <!-- begin cmd-form-element -->
                <CmdFormElement
                    element="input"
                    :type="configuration.streetNo?.type || 'text'"
                    :labelText="getMessage('basic_form.labeltext.street_no')"
                    :placeholder="getMessage('basic_form.placeholder.street_no')"
                    :required="configuration.streetNo?.required"
                    :name="configuration.streetNo?.name || 'street-no'"
                    v-model="formData.streetNo.value"
                    :status="formData.streetNo.error ? 'error' : ''"
                    :tooltipText="formData.streetNo.error ? formData.streetNo.errorMessage :  'Type your street and number!'"
                    @validate="onValidate"
                />
                <!-- end cmd-form-element -->

                <div class="input-wrapper">
                    <!-- begin cmd-form-element -->
                    <CmdFormElement
                        element="input"
                        :type="configuration.zip?.type || 'number'"
                        :labelText="getMessage('basic_form.labeltext.zip')"
                        :placeholder="getMessage('basic_form.placeholder.zip')"
                        :required="configuration.zip?.required"
                        :name="configuration.zip?.name || 'zip'"
                        v-model="formData.zip.value"
                        :status="formData.zip.error ? 'error' : ''"
                        :tooltipText="formData.zip.error ? formData.zip.errorMessage :  'Type your zip/postal code!'"
                        @validate="onValidate"
                    />
                    <!-- end cmd-form-element -->
                    <!-- begin cmd-form-element -->
                    <CmdFormElement
                        element="input"
                        :type="configuration.city?.type || 'text'"
                        :labelText="getMessage('basic_form.labeltext.city')"
                        :placeholder="getMessage('basic_form.placeholder.city')"
                        :required="configuration.city?.required"
                        :name="configuration.city?.name || 'zip'"
                        v-model="formData.city.value"
                        :status="formData.city.error ? 'error' : ''"
                        :tooltipText="formData.city.error ? formData.city.errorMessage :  'Type your city!'"
                        @validate="onValidate"
                    />
                    <!-- end cmd-form-element -->
                </div>

                <!-- begin cmd-form-element -->
                <CmdFormElement
                    element="input"
                    :type="configuration.additionalAddressInfo?.type || 'text'"
                    :labelText="getMessage('basic_form.labeltext.additional_address_info')"
                    :placeholder="getMessage('basic_form.placeholder.additional_address_info')"
                    :required="configuration.additionalAddressInfo?.required"
                    :name="configuration.additionalAddressInfo?.name || 'additional-address-info'"
                    v-model="formData.additionalAddressInfo.value"
                    :status="formData.additionalAddressInfo.error ? 'error' : ''"
                    :tooltipText="formData.additionalAddressInfo.error ? formData.additionalAddressInfo.errorMessage :  'Type additional address information!'"
                    @validate="onValidate"
                />
                <!-- end cmd-form-element -->
            </div>

            <!-- begin cmd-form-element -->
            <CmdFormElement
                :type="configuration.additionalText?.type || 'textarea'"
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
                        type: "textarea"
                    },
                    acceptPrivacy: {
                        required: true,
                        replaceInputType: true
                    }
                }
            }
        },
        receiverEmailAddress: {
            type: String,
            default: ""
        },
        formAction: {
            type: String,
            required: true
        },
        submitButton: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-message-send",
                    text: "Send mail",
                    type: "submit",
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

