<template>
    <!-- begin CmdForm ---------------------------------------------------------------------------------------- -->
    <form 
        :class="['cmd-form', {error: errorOccurred}]" 
        :action="formAction" 
        :data-use-validation="useValidation" 
        @submit="onSubmit"
        :novalidate="novalidate" 
        :method="formMethod"
    >
        <template v-if="useFieldset">
            <fieldset class="flex-container flex-direction-column"><!-- do not remove .flex-direction-column to keep specificity -->
                <!-- begin (mandatory) legend-->
                <legend :class="{hidden : !legendOptions.show, 'align-left': legendOptions.align === 'left'}">{{
                        legendOptions.text
                    }}
                </legend>
                <!-- end (mandatory) legend-->

                <CmdHeadline 
                    v-if="cmdHeadline?.headlineText"
                    v-bind="cmdHeadline"
                />
  
                <CmdSystemMessage 
                    v-if="systemMessage.show && systemMessage.message" 
                    :validationStatus="systemMessage.validationStatus" 
                    :systemMessage="systemMessage.message"
                />

                <!-- begin default-slot-content -->
                <slot v-if="useSlot"></slot>
                <!-- end default-slot-content -->

                <!-- begin loop for formElements -->
                <template v-else v-for="(item, index) in formElements" :key="index">
                    <CmdFormElement
                        v-if="!item.component || item.component === 'CmdFormElement'"
                        :key="index"
                        :class="item.htmlClass"
                        v-bind="item"
                        v-model="formValues[item.name]"
                        @validation-status-change="formElementHasError($event, item.name)"
                    />
                    <CmdFakeSelect
                        v-if="item.component === 'CmdFakeSelect'"
                        :class="item.htmlClass"
                        v-bind="item"
                        v-model="formValues[item.name]"
                    />
                    <CmdInputGroup
                        v-else-if="item.component === 'CmdInputGroup'"
                        :class="item.htmlClass"
                        v-bind="item"
                        v-model="formValues[item.name]"                
                    /> 
                    <div 
                        v-else-if="item.component === 'flexContainer' || item.component === 'inputWrapper'"
                        :class="item.component === 'flexContainer' ? 'flex-container' : 'input-wrapper'"
                    >
                        <!-- begin inner loop for formElements inside flex-container/input-wrapper -->
                        <template v-for="(item, index) in item.formElements" :key="index">
                            <CmdFormElement
                                v-if="!item.component || item.component === 'CmdFormElement'"
                                :key="index"
                                :class="item.htmlClass"
                                v-bind="item"
                                v-model="formValues[item.name]"
                                @validation-status-change="formElementHasError($event, item.name)"
                            />
                            <CmdFakeSelect
                                v-else-if="item.component === 'CmdFakeSelect'"
                                :class="item.htmlClass"
                                v-bind="item"
                                v-model="formValues[item.name]"
                            />
                            <CmdInputGroup
                                v-else-if="item.component === 'CmdInputGroup'"
                                v-model="formValues[item.name]"
                                v-bind="item"
                            />
                        </template>
                        <!-- end inner loop for formElements inside flex-container/input-wrapper -->
                    </div>
                </template>
                <!-- end loop for formElements -->

                <!-- begin submit- and cancel-button inside fieldset -->
                <div v-if="submitButtonOptions.show && (submitButtonOptions.position === 'insideFieldset' || submitButtonOptions.position === null)" class="flex-container no-wrap-on-small-devices">
                    <small v-if="mandatoryText" class="mandatory-text"><sup>*</sup>{{ mandatoryText }}</small>
                    <!-- begin cancel-button -->
                    <button 
                        v-if="cancelButtonOptions.show"
                        :class="['button', {'stretch-on-small-devices': cancelButtonOptions.stretchOnSmallDevices, disabled: cancelButtonOptions.disabled, cancel: cancelButtonOptions.useDefaultStyling}]" 
                        type="button"
                        @click="cancelFormSubmit"
                    >
                        <span v-if="cancelButtonOptions.iconClass" :class="cancelButtonOptions.iconClass"></span>
                        <span v-if="cancelButtonOptions.text">{{ cancelButtonOptions.text }}</span>
                    </button>
                    <!-- end cancel-button -->
                    
                    <!-- begin submit-button -->
                    <button
                        :class="['button', {'stretch-on-small-devices': submitButtonOptions.stretchOnSmallDevices, primary: submitButtonOptions.primary, disabled: submitButtonOptions.disabled}]"
                        :type="submitButtonOptions.type"
                        @click.prevent="onSubmit"
                    >
                        <span v-if="submitButtonOptions.iconClass" :class="submitButtonOptions.iconClass"></span>
                        <span v-if="submitButtonOptions.text">{{ submitButtonOptions.text }}</span>
                    </button>
                    <!-- end submit-button -->
                </div>
                <!-- end submit- and cancel-button inside fieldset -->
            </fieldset>

            <!-- begin submit- and cancel-button outside/below fieldset -->
            <div v-if="submitButtonOptions.show && submitButtonOptions.position === 'belowFieldset'" class="flex-container no-wrap-on-small-devices">
                <small v-if="mandatoryText" class="mandatory-text"><sup>*</sup>{{ mandatoryText }}</small>     
                <!-- begin cancel-button-->
                <button 
                    v-if="cancelButtonOptions.show"
                    :class="['button', {'stretch-on-small-devices': cancelButtonOptions.stretchOnSmallDevices, disabled: cancelButtonOptions.disabled, cancel: cancelButtonOptions.useDefaultStyling}]" 
                    type="button"
                    @click="cancelFormSubmit"
                >
                    <span v-if="cancelButtonOptions.iconClass" :class="cancelButtonOptions.iconClass"></span>
                    <span v-if="cancelButtonOptions.text">{{ cancelButtonOptions.text }}</span>
                </button>
                <!-- end cancel-button -->

                <!-- begin submit-button -->
                <button v-if="submitButtonOptions.show"
                        :class="['button', {'stretch-on-small-devices': submitButtonOptions.stretchOnSmallDevices, primary: submitButtonOptions.primary, disabled: submitButtonOptions.disabled}]"
                        :type="submitButtonOptions.type || 'submit'">
                    <span v-if="submitButtonOptions.iconClass" :class="submitButtonOptions.iconClass"></span>
                    <span v-if="submitButtonOptions.text">{{ submitButtonOptions.text }}</span>
                </button>
                <!-- end submit-button -->
            </div>
            <!-- end submit- and cancel-button outside/below fieldset -->

            <!-- begin button-row-slot-content -->
            <slot name="button-row"></slot>
            <!-- end button-row-slot-content -->
        </template>

        <!-- begin default-slot-content -->
        <slot v-else></slot>
        <!-- end default-slot-content -->
    </form>
    <!-- end CmdForm ---------------------------------------------------------------------------------------- -->
</template>

<script>
import {createHtmlId} from "@"
import CmdSystemMessage from "@/components/CmdSystemMessage.vue";

export default {
    name: "CmdForm",
    components: {CmdSystemMessage},
    emits: ["submit", "update:modelValue"],
    data() {
        return {
            errorOccurred: false,
            formValues: {},
            showSystemMessage: false,
            systemMessage: {
                show: false,
                validationStatus: "",
                message: ""
            },
            formElementsWithError: []
        }
    },
    props: {
        /**
         * model-value for entire form
         */
        modelValue: {
            type: Object
        },
        /**
         * set url for form-action
         */
        formAction: {
            type: String,
            required: false
        },
        /**
         * define method to send form
         */
        formMethod: {
            type: String,
            default: "POST",
            validator(value) {
                return value === "POST" || value === "GET"
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
            type: Object,
            required: false
        },
        /**
         * activate if form-elements should be given by slot
         */
        useSlot: {
            type: Boolean,
            default: true
        },
        /**
         * define form-elements by given array
         */
        formElements: {
            type: Array,
            required: false
        },
        /**
         * deactivate if browser-validation should be used
         */
        novalidate: {
            type: Boolean,
            default: true
        },
        /**
         * if activated the entire form will be validated by pre-coded validation
         *
         * @affectsStyling: true
         */
        useValidation: {
            type: Boolean,
            default: true
        },
        /**
         * activate if you want to use a fieldset
         *
         * @requiredForAccessibility: true
         */
        useFieldset: {
            type: Boolean,
            default: true
        },
         /**
         * text to clarify which inputs are mandatory
         */
         mandatoryText: {
            type: String,
            default: "mandatory inputs"
        },
        /**
         * cancel-button to not submit any form-data
         */
        cancelButton: {
            type: Object,
            required: false
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
        }
    },
    mounted() {
        // get the names of all elements that match the phrase and push to data-property to initially collect all required field to set correct validationStatus for form
        const requiredElementNames = this.formElements?.filter(element => element.required === true).map(element => element.name)
        
        requiredElementNames?.forEach((name) => {
            this.formElementsWithError.push(name)
        })
    },
    computed: {
        legendOptions() {
            return {
                show: false,
                align: "left",
                text: "Legend",
                ...this.legend
            }
        },
        cancelButtonOptions() {
            return {
                show: true,
                iconClass: "icon-cancel-circle",
                text: "Cancel",
                useDefaultStyling: false,
                stretchOnSmallDevices: false,
                position: "insideFieldset",
                ...this.cancelButton
            }
        },
        submitButtonOptions() {
            return {
                show: true,
                iconClass: "icon-check-circle",
                text: "Submit",
                type: "submit",
                stretchOnSmallDevices: false,
                position: "insideFieldset",
                primary: true,
                ...this.submitButton
            }
        }
    },
    methods: {
        formElementHasError(event, itemName) {
            if (event === "error" && !this.formElementsWithError.some(entry => entry.name === itemName)) {
                this.formElementsWithError.push(itemName)
            } else if (event === "success" && this.formElementsWithError.includes(itemName)) {
                this.formElementsWithError = this.formElementsWithError.filter((element) => element !== itemName)
            }

            this.$emit("validation-status-change", this.formElementsWithError.length ? "error" : "success")
        },
        createHtmlId,
        showMessage(validationStatus, message) {
            this.systemMessage.show = true
            this.systemMessage.validationStatus = validationStatus
            this.systemMessage.message = message
        },
        cancelFormSubmit(event) {
            const isConfirmed = window.confirm("Are you sure you want to cancel the form submit (all entered data will be lost)?");
      
            if (isConfirmed) {
                this.$emit("cancel-form-submit", event)
            }
        },
        submitFormData(event) {
            // fill form-data with names and value
            let formdata = {}
            if (this.formElements) {
                this.formElements.forEach((element) => {
                    formdata[element.name] = this.formValues[element.name]
                })
            }
            this.$emit("submit", {originalEvent: event, formdata: formdata})
        },
        onSubmit(event) {
            if (this.useValidation) {
                if (event.target.checkValidity()) {
                    this.errorOccurred = false
                    this.submitFormData(event)
                } else {
                    event.preventDefault()
                    this.errorOccurred = true
                }
            } else {
                this.submitFormData(event)
            }
        }
    },
    watch: {
        modelValue: {
            handler() {
               if(!this.modelValue) {
                     return
                }

                // assign values in loop, because entire object cannot be assigned
                for (const key in this.modelValue) {
                    this.formValues[key] = this.modelValue[key]
                }
            },
            immediate: true
        },
        formValues: {
            handler() {
                this.$emit("update:modelValue", this.formValues)
            },
            deep: true
        },
        /*
        formValues: {
            handler() {
                if(!this.formElements) {
                    return
                }

                const numberRequiredFormElements = this.formElements.filter((element) => {
                    return element.required     
                }).length

                const numberEmptyRequiredFormElements = this.formElements.filter((element) => {
                    return element.required && !this.formValues[element.name]    
                }).length

                const allRequiredFormElementsEmpty = numberRequiredFormElements > 0 && numberRequiredFormElements === numberEmptyRequiredFormElements
                const emptyRequiredFormElementExists = numberRequiredFormElements > 0 && numberEmptyRequiredFormElements > 0

                this.$emit("empty-required-form-elements", { allRequiredFormElementsEmpty, emptyRequiredFormElementExists })
            },
            immediate: true,
            deep: true
        },  */
        formElements: {
            handler() {
                this.formElements?.forEach(element => {
                    if (element.type === "checkbox") {
                        // create array if element is a checkbox (to contain several values)
                        if (!this.formValues[element.name]) {
                            this.formValues[element.name] = []
                        }

                        if (element.value != null) {
                            this.formValues[element.name].push(element.value)
                        }
                    } else {
                        this.formValues[element.name] = element.value ?? ""
                    }
                })
            },
            immediate: true,
            deep: true
        }
    }
}
</script>

<style>
/* begin cmd-form ---------------------------------------------------------------------------------------- */
.cmd-form {
    &:not([data-use-validation="true"]) {
        label.error :where(::placeholder, select option:first-child),
        :where(input, select, textarea):invalid:focus {
            color: var(--error-color);
        }

        :where(input, select, textarea):user-valid:focus[required],
        select:user-invalid:focus[required] option:not(:first-child) {
            color: var(--success-color);
        }
    }

    /* must be refactored */
    &.send-success {
        fieldset {
            border-color: var(--default-border-color) !important;

            :is(label, .label) :is(.label-text :is(span, a[class*="icon-"], a:has([class*="icon-"])), .place-inside[class*="icon-"], input, select, textarea) {
                --status-color: var(--default-text-color) !important;
                border-color: var(--default-border-color) !important;
            }

            sup {
                --status-color: var(--primary-color) !important;
            }
        }
    }

    legend.align-left {
        left: 0;
        right: auto;
    }

    &.error {
        fieldset, *:invalid {
            border-color: var(--error-color);
        }
    }

    .mandatory-text {
        sup {
            color: var(--primary-color);
            font-size: 1.5rem;
            top: 0;
        }
    }

    [type="submit"].button {
        margin-left: auto;
    }

    fieldset + .button-wrapper {
        margin-top: var(--default-margin);
    }
}

/* end cmd-form ---------------------------------------------------------------------------------------- */
</style>
