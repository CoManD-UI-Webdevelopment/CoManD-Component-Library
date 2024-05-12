<template>
    <div class="cmd-pages-basic-form">
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
                    name="salutation"
                    inputValue="M"
                    :replace-input-type="true"
                    v-model="formData.salutation"
                    @validate="onValidate"
                />
                <!-- end cmd-form-element -->

                <!-- begin cmd-form-element -->
                <CmdFormElement
                    element="input"
                    type="radio"
                    :labelText="getMessage('basic_form.labeltext.salutation_female')"
                    name="salutation"
                    :replace-input-type="true"
                    v-model="formData.salutation"
                    @validate="onValidate"
                />
                <!-- end cmd-form-element -->
            </div>
            <div class="flex-container">
                <!-- begin cmd-form-element -->
                <CmdFormElement
                    element="input"
                    type="text"
                    iconClass="icon-user-profile"
                    :labelText="getMessage('basic_form.labeltext.last_name')"
                    :tooltipText="formData.last_name.error ? formData.last_name.errorMessage :  'Type your surname!'"
                    required="required"
                    :placeholder="getMessage('basic_form.placeholder.last_name')"
                    v-model="formData.last_name.value"
                    :status="formData.last_name.error ? 'error' : ''"
                    @validate="onValidate"
                />
                <!-- end cmd-form-element -->

                <!-- begin cmd-form-element -->
                <CmdFormElement
                    element="input"
                    type="text"
                    iconClass="icon-user-profile"
                    :labelText="getMessage('basic_form.labeltext.first_name')"
                    :tooltipText="formData.first_name.error ? formData.first_name.errorMessage :  'Type your first name!'"
                    :placeholder="getMessage('basic_form.placeholder.first_name')"
                    v-model="formData.first_name.value"
                    :status="formData.first_name.error ? 'error' : ''"
                    @validate="onValidate"
                />
                <!-- end cmd-form-element -->
            </div>
            <div class="flex-container">
                <!-- begin cmd-form-element -->
                <CmdFormElement
                    element="input"
                    type="email"
                    iconClass="icon-mail"
                    :labelText="getMessage('basic_form.labeltext.email')"
                    :placeholder="getMessage('basic_form.placeholder.email')"
                    required="required"
                    v-model="formData.email.value"
                    :status="formData.email.error ? 'error' : ''"
                    :tooltipText="formData.email.error ? formData.email.errorMessage :  'Type your email!'"
                    @validate="onValidate"
                />
                <!-- end cmd-form-element -->

                <!-- begin cmd-form-element -->
                <CmdFormElement
                    element="input"
                    type="phone"
                    iconClass="icon-phone"
                    :labelText="getMessage('basic_form.labeltext.phone')"
                    :placeholder="getMessage('basic_form.placeholder.phone')"
                    v-model="formData.phone.value"
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
                    type="text"
                    :labelText="getMessage('basic_form.labeltext.street_no')"
                    :placeholder="getMessage('basic_form.placeholder.street_no')"
                    required="required"
                    v-model="formData.street_no.value"
                    :status="formData.street_no.error ? 'error' : ''"
                    :tooltipText="formData.street_no.error ? formData.street_no.errorMessage :  'Type your street and number!'"
                    @validate="onValidate"
                />
                <!-- end cmd-form-element -->

                <div class="input-wrapper">
                    <!-- begin cmd-form-element -->
                    <CmdFormElement
                        element="input"
                        type="number"
                        :labelText="getMessage('basic_form.labeltext.zip')"
                        :placeholder="getMessage('basic_form.placeholder.zip')"
                        v-model="formData.zip.value"
                        :status="formData.zip.error ? 'error' : ''"
                        :tooltipText="formData.zip.error ? formData.zip.errorMessage :  'Type your zip/postal code!'"
                        @validate="onValidate"
                    />
                    <!-- end cmd-form-element -->
                    <!-- begin cmd-form-element -->
                    <CmdFormElement
                        element="input"
                        type="text"
                        :labelText="getMessage('basic_form.labeltext.city')"
                        :placeholder="getMessage('basic_form.placeholder.city')"
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
                    type="text"
                    :labelText="getMessage('basic_form.labeltext.additional_address_info')"
                    :placeholder="getMessage('basic_form.placeholder.additional_address_info')"
                    required="required"
                    v-model="formData.additional_address_info.value"
                    :status="formData.additional_address_info.error ? 'error' : ''"
                    :tooltipText="formData.additional_address_info.error ? formData.additional_address_info.errorMessage :  'Type additional address information!'"
                    @validate="onValidate"
                />
                <!-- end cmd-form-element -->
            </div>

            <!-- begin cmd-form-element -->
            <CmdFormElement
                element="input"
                type="checkbox"
                :required="true"
                v-model="formData.privacy.value"
                :status="formData.privacy.error ? 'error' : ''"
                @validate="onValidate">
                <template v-slot:labeltext>
                    <span ref="dataPrivacy" v-html="getMessage('basic_form.labeltext.data_privacy')"></span>
                </template>
            </CmdFormElement>
            <!-- end cmd-form-element -->
        </CmdForm>
    </div>
</template>

<script>
// import mixins
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
                salutation: 'M',
                last_name: {value: ''},
                first_name: {value: ''},
                email: {value: ''},
                phone: {value: ''},
                street_no: {value: ''},
                zip: {value: ''},
                city: {value: ''},
                additional_address_info: {value: ''},
                privacy: {value: false}
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
        hiddenFormElements: {
            
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
    /*
    mounted() {
        usePiniaStore().$subscribe(() => {
            this.$nextTick(() => {
                this.$refs.dataPrivacy?.querySelector('.fancybox')?.addEventListener('click', event => {
                    event.preventDefault()
                    openFancyBox({url: event.target.getAttribute('href')})
                })
            })
        })
    },
    */
    methods: {
        onSubmit(event) {
            this.onValidate();

            this.formData = Object.assign({}, this.validator.validatePrivacy(this.formData));
            if (this.formData.error) {
                event.preventDefault();
                return;
            }

            alert(`
                Form submit:
                salutation: ${this.formData.salutation}
                last_name: ${this.formData.last_name.value}
                first_name: ${this.formData.first_name.value}
                email: ${this.formData.email.value}
                phone: ${this.formData.phone.value}
                street_no: ${this.formData.street_no.value}
                zip: ${this.formData.zip.value}
                city: ${this.formData.city.value}
                additional_address_info: ${this.formData.additional_address_info.value}
                privacy: ${this.formData.privacy.value}
            `);

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
        // onPersist(data) {
        //     return {
        //         editModeContextData: {
        //             ...(this.editModeContextData || {})
        //         },
        //         update(props) {
        //             props.cmdHeadline = {
        //                 ...(props.cmdHeadline || {}),
        //             }
        //             props.cmdHeadline.headlineText = data[0].headlineText
        //         }
        //     }
        // },
        // onDelete() {
        //     console.log("ContactForm.onDelete()")
        //     return {
        //         editModeContextData: {
        //             ...(this.editModeContextData || {})
        //         }
        //     }
        // }
        // openDataPrivacy(url) {
        //     openFancyBox({url})
        // }
    }
}

// @Watch('$store.state.currentLanguage')
// private languageChanged(): void {
//     this.formData = Object.assign({}, {
//       salutation: 'M',
//       surname: {value: ''},
//       email: {value: ''},
//       message: {value: ''},
//       privacy: {value: false}
//     } as ContactFormData);
//     this.labelsChanged()
// }
//
// @Watch('$store.state.labels')
// private labelsChanged(): void {
//     this.$nextTick(() => {
//         this.$el.querySelectorAll('.fancybox').forEach(link => link.addEventListener('click', e => {
//             e.preventDefault()
//             this.openDataPrivacy(link.getAttribute('href'))
//         }))
//     })
// }
</script>

<style>
.cmd-pages-basic-form {
    fieldset {
        margin: 0;
    }
}
</style>

