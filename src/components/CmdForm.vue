<template>
    <form class="cmd-form" :action="formAction" :data-use-validation="useValidation" @submit="onSubmit" :class="{error: errorOccurred}" :novalidate="novalidate">
        <template v-if="useFieldset">
            <fieldset class="flex-container">
                <legend :class="{hidden : !legend.show, 'align-left': legend.align === 'left'}">{{ legend.text }}</legend>
                <!-- begin default-slot-content -->
                <slot v-if="useSlot"></slot>
                <!-- end default-slot-content -->

                <!-- begin loop for formElements -->
                <CmdFormElement
                    v-else
                    v-for="(item, index) in formElements"
                    :key="index"
                    :element="item.element || 'input'"
                    :type="item.type || 'text'"
                    :name="item.name"
                    :class="item.htmlClass"
                    :id="item.id || createHtmlId()"
                    v-model="formValues[item.name]"
                    :inputValue="item.inputValue"
                    :fieldIconClass="item.innerIconClass"
                    :selectOptions="item.selectOptions"
                    :labelText="item.labelText"
                    :placeholder="item.placeholder"
                    :required="item.required"
                    :disabled="item.disabled"
                    :autocomplete="item.autocomplete"
                    :minlength="item.minlength"
                    :maxlength="item.maxlength"
                    :nativeButton="item.nativeButton"
                />
                <!-- end loop for formElements -->

                <!-- begin submit-button -->
                <button v-if="submitButton && submitButton.position === 'insideFieldset'" :class="['button', {primary: submitButton.primary}]" :type="submitButton.type">
                    <span v-if="submitButton.iconClass" :class="submitButton.iconClass"></span>
                    <span v-if="submitButton.text">{{ submitButton.text }}</span>
                </button>
                <!-- end submit-button -->
            </fieldset>

            <div v-if="submitButton && submitButton.position === 'belowFieldset'" class="button-wrapper">
                <!-- begin submit-button -->
                <button :class="['button', {primary: submitButton.primary}]" :type="submitButton.type">
                    <span v-if="submitButton.iconClass" :class="submitButton.iconClass"></span>
                    <span v-if="submitButton.text">{{ submitButton.text }}</span>
                </button>
                <!-- end submit-button -->
            </div>

            <!-- begin button-row-slot-content -->
            <slot name="button-row"></slot>
            <!-- end button-row-slot-content -->
        </template>

        <!-- begin default-slot-content -->
        <slot v-else></slot>
        <!-- end default-slot-content -->
    </form>
</template>

<script>
import {createHtmlId} from "@"

export default {
    name: "CmdForm",
    emits: ["submit"],
    data(){
        return {
            errorOccurred: false,
            formValues: {}
        }
    },
    props: {
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
            default() {
                return {
                    show: true,
                    align: "left",
                    text: "Legend"
                }
            }
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
         * submit-button to submit all form-data
         */
        submitButton: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-check",
                    text: "Submit",
                    type: "submit",
                    position: "insideFieldset",
                    primary: true
                }
            }
        }
    },
    methods: {
        createHtmlId,
        submitFormData(event) {
            // fill form-data with names and value
            let formdata = {}
            if(this.formElements) {
                this.formElements.forEach((element) => {
                    formdata[element.name] = this.formValues[element.name]
                })
            }
            this.$emit("submit", {originalEvent: event, formdata: formdata})
        },
        onSubmit(event) {
            if(this.useValidation) {
                if(event.target.checkValidity()) {
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
        formElements: {
            handler() {
                this.formValues = {}

                this.formElements?.forEach(element => {
                    if(element.type === "checkbox") {
                        // create array if element is a checkbox (to contain several values)
                        if(!this.formValues[element.name]) {
                            this.formValues[element.name] = []
                        }

                        if(element.value != null) {
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

    legend.align-left {
        left: 0;
        right: auto;
    }

    &.error {
        fieldset, *:invalid {
            border-color: var(--error-color);
        }
    }

    .button, .button:last-child {
        margin-left: auto;
    }

    fieldset + .button-wrapper {
        margin-top: var(--default-margin);
    }
}
/* end cmd-form ---------------------------------------------------------------------------------------- */
</style>
