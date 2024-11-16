<template>
    <form class="cmd-form" :action="formAction" :data-use-validation="useValidation" @submit="onSubmit"
          :class="{error: errorOccurred}" :novalidate="novalidate" :method="formMethod">
        <template v-if="useFieldset">
            <fieldset class="flex-container">
                <legend :class="{hidden : !legend.show, 'align-left': legend.align === 'left'}">{{
                        legend.text
                    }}
                </legend>
                <CmdSystemMessage v-if="systemMessage.show && systemMessage.message" :validationStatus="systemMessage.validationStatus" :system-message="systemMessage.message"/>
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

                <!-- begin submit-button (inside fieldset) -->
                <button
                    v-if="submitButtonOptions && (submitButtonOptions.position === 'insideFieldset' || submitButtonOptions.position === null) "
                    :class="['button', {primary: submitButtonOptions.primary}]"
                    :type="submitButtonOptions.type"
                >
                    <span v-if="submitButtonOptions.iconClass" :class="submitButtonOptions.iconClass"></span>
                    <span v-if="submitButtonOptions.text">{{ submitButtonOptions.text }}</span>
                </button>
                <!-- end submit-button (inside fieldset) -->
            </fieldset>

            <div v-if="submitButtonOptions && submitButtonOptions.position === 'belowFieldset'" class="button-wrapper">
                <!-- begin submit-button (below fieldset) -->
                <button :class="['button', {primary: submitButtonOptions.primary}]"
                        :type="submitButtonOptions.type || 'submit'">
                    <span v-if="submitButtonOptions.iconClass" :class="submitButtonOptions.iconClass"></span>
                    <span v-if="submitButtonOptions.text">{{ submitButtonOptions.text }}</span>
                </button>
                <!-- end submit-button (below fieldset) -->
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
import CmdSystemMessage from "@/components/CmdSystemMessage.vue";

export default {
    name: "CmdForm",
    components: {CmdSystemMessage},
    emits: ["submit"],
    data() {
        return {
            errorOccurred: false,
            formValues: {},
            showSystemMessage: false,
            systemMessage: {
                show: false,
                validationStatus: "",
                message: ""
            }
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
            required: false
        }
    },
    computed: {
        submitButtonOptions() {
            return {
                iconClass: "icon-check",
                text: "Submit",
                type: "submit",
                position: "insideFieldset",
                primary: true,
                ...this.submitButton
            }
        }
    },
    methods: {
        createHtmlId,
        showMessage(validationStatus, message) {
            this.systemMessage.show = true
            this.systemMessage.validationStatus = validationStatus
            this.systemMessage.message = message
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
        formElements: {
            handler() {
                this.formValues = {}

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
