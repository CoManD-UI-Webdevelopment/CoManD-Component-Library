<template>
    <!-- begin CmdInputGroup ---------------------------------------------------------------------------------------- -->
    <div :class="[
        'cmd-input-group label',
        required ? validationStatus : null,
        {
            'has-state': validationStatus,
            inline: labelInline,
            'multiple-switch': multipleSwitch,
            disabled: disableGroup,
            'toggle-switches': toggleSwitches
        }
        ]"
         :aria-labelledby="htmlId">

        <!-- begin label -->
        <span v-show="showLabel" class="label-text">
            <span :id="htmlId">{{ labelText }}<sup v-if="required" aria-hidden="true">*</sup></span>

                <!-- begin status-icon (linked with tooltip) -->
                <button v-if="($attrs.required || inputRequirements.length) && showStatusIcon"
                    type="button"
                    class="no-style"
                    :title="validationTooltip" 
                    :aria-errormessage="tooltipId" 
                    aria-live="assertive" 
                    :popovertarget="'tooltip-target-' + htmlId"
                    :style="'anchor-name: --tooltip-anchor-' + htmlId"
                >
                        <!-- begin CmdIcon -->
                        <CmdIcon :iconClass="getStatusIconClass" />
                        <!-- end CmdIcon -->
                </button>
                <!-- end status-icon (linked with tooltip) -->

                 <!-- begin CmdTooltip -->
                <CmdTooltip
                    ref="tooltip"
                    :class="['cmd-tooltip-for-form-elements box', validationStatus]"
                    :id="'tooltip-target-' + htmlId"
                    :scrollContainer="scrollContainerForTooltip"
                    :popoverTargetName="'tooltip-target-' + htmlId"
                    :validationStatus="validationStatus"
                    :role="validationStatus === 'error' ? 'alert' : 'dialog'"
                    :toggle-visibility-by-click="true"
                    :style="'position-anchor: --tooltip-anchor-' + htmlId"
                >

                    <!-- begin CmdListOfRequirements -->
                    <CmdListOfRequirements
                        v-if="cmdListOfRequirementsProperties.showRequirements"
                        v-bind="cmdListOfRequirementsProperties"
                    />
                    <!-- end CmdListOfRequirements -->
                </CmdTooltip>
                <!-- end CmdTooltip -->
        </span>
        <!-- end label -->

        <!-- begin view without slot -->
        <span v-if="!useSlot" :class="['flex-container', {'vertical': orientation === 'vertical','flex-items-flex-none': !stretchHorizontally, 'no-gap': multipleSwitch}]">
            <label v-for="(inputElement, index) in inputElements" :key="index" :for="inputElement.id" :class="{'toggle-switch': toggleSwitches, colored: colored}">
                <input
                    :type="inputTypes"
                    :id="inputElement.id"
                    :name="inputElement.name"
                    :value="inputElement.value"
                    v-model="inputValue"
                    :disabled="inputElement.disabled"
                    :class="[inputElements.htmlClass, {'replace-input-type': replaceInputType}]"
                />
                <!-- begin CmdIcon -->
                <CmdIcon
                    v-if="multipleSwitch && inputElement.iconClass"
                    :iconClass="inputElement.iconClass"
                    :type="inputElement.iconType"
                />
                <!-- end CmdIcon -->
                <span v-if="inputElement.labelText" class="label-text">{{ inputElement.labelText }}</span>
            </label>
        </span>
        <!-- end view without slot -->

        <!-- begin useSlot -->
        <div v-else class="flex-container flex-none">
            <!-- begin slot -->
            <slot></slot>
            <!-- end slot -->
        </div>
        <!-- end useSlot -->
    </div>
    <!-- end CmdInputGroup ---------------------------------------------------------------------------------------- -->
</template>

<script>
// import mixins
import FieldValidation from "../mixins/FieldValidation.js"
import Identifier from "../mixins/Identifier"
import Tooltip from "../mixins/Tooltip.js"
import DefaultMessageProperties from "../mixins/CmdFormElement/DefaultMessageProperties"

export default {
    mixins: [
        DefaultMessageProperties,
        FieldValidation,
        Identifier,
        Tooltip
    ],
    emits: ["validation-status-change", "update:modelValue"],
    props: {
        /**
         * set value for v-model (must be named modelValue in vue3 if default v-model should be used)
         */
        modelValue: {
            type: [Array, String],
            required: false
        },
        /**
        * specify a scroll-container which scrolling hides the tooltip
        */
         scrollContainerForTooltip: {
            type: String,
            required: false
        },
        /**
         * set orientation
         *
         * @allowedValues = horizontal, vertical
         */
        orientation: {
            type: String,
            default: 'horizontal',
            validator(value) {
                return value === "horizontal" ||
                    value === "vertical"
            }
        },
        /**
         * set if input-group should be required
         */
        required: {
            type: Boolean,
            default: false
        },
        /**
         * activate if interactive status-icon (to show requirements) should be shown inline with label
         */
        showStatusIcon: {
            type: Boolean,
            default: false
        },
        /**
         * on/off-, yes/no-color-styling
         *
         * set to true, if checkbox/radio-buttons should have green/checked and red/unchecked color-coding
         * toggleSwitch-prop must be set to "true"
         * element-prop must be set to "input" and type-attribute must be set to "checkbox" or "radio"
         *
         * @affectsStyling: true
         */
        colored: {
            type: Boolean,
            required: false
        },
        /**
         * list of input-elements inside group
         *
         * useSlot-property must be set to 'false'
         */
        inputElements: {
            type: Array,
            required: false
        },
        /**
         * set type for inputs in group
         *
         * @allowedValues: checkbox, radio
         */
        inputTypes: {
            type: String,
            default: "radio",
            validator(value) {
                return value === "checkbox" ||
                    value === "radio"
            }
        },
        /**
         * set status for label and inner form-elements
         *
         * @allowedValues: "", error, warning, success, info
         *
         * @affectsStyling: true
         */
        status: {
            type: String,
            required: false,
            validator(value) {
                return value === "" ||
                    value === "error" ||
                    value === "warning" ||
                    value === "success" ||
                    value === "info"
            }
        },
        /**
         * for replacing native checkboxes/radio-buttons by custom ones (based on frontend-framework)
         *
         * toggleSwitches-property must be set to 'false'
         *
         * @affectsStyling: true
         */
        replaceInputType: {
            type: Boolean,
            default: false
        },
        /**
         * for replacing native checkboxes/radio-buttons by toggle-switches (based on frontend-framework)
         *
         * replaceInputType-property must be set to 'false'
         *
         * @affectsStyling: true
         */
        toggleSwitches: {
            type: Boolean,
            default: false
        },
        /**
         * activate if input-elements should be given by slot
         */
        useSlot: {
            type: Boolean,
            default: false
        },
        /**
         * toggle multipleSwitch-styling
         *
         * @affectsStyling: true
         */
        multipleSwitch: {
            type: Boolean,
            default: false
        },
        /**
         * toggle label-text visibility
         */
        showLabel: {
            type: Boolean,
            default: true
        },
        /**
         * label-text for input-group
         *
         * @requiredForAccessibility: true
         */
        labelText: {
            type: String,
            required: true
        },
        /**
         * toggle label-position (inline/left of input-elements or above input-elements)
         */
        labelInline: {
            type: Boolean,
            default: false
        },
        /**
         * toggle if input-elements will be stretched horizontally
         *
         * @affectsStyling: true
         */
        stretchHorizontally: {
            type: Boolean,
            default: false
        },
        /**
         * define disabled-property to set disabled-style
         *
         * component cannot handle native disabled-attribute, because it is no native form-element
         */
        disableGroup: {
            type: Boolean,
            default: false
        },
        /**
        * properties for CmdListOfRequirements-component
        */
        cmdListOfRequirements: {
            type: Object,
            required: false   
         }
    },
    methods: {
        updateStatus() {
            if (this.required) {
                if (this.inputValue?.length) {
                    this.validationStatus = "success"
                    return
                }
                this.validationStatus = "error"
                return
            }
            this.validationStatus = this.status

            this.$emit("validation-status-change", this.validationStatus)
        }
    },
    computed: {
        cmdListOfRequirementsProperties() {
            return {
                showRequirements: true,
                validationTooltip: "",
                inputRequirements: [],
                inputAttributes: {},
                showHeadline: true,
                inputModelValue: "",
                helplink: {},
                labelText: "",
                ...this.cmdListOfRequirements
            }
        },
        validationTooltip() {
            if (!this.useCustomTooltip) {
                return this.getValidationMessage
            }

            // set default-tooltip if customTooltip is not set
            if (this.validationStatus === 'error') {
                return this.getMessage("form_element.validation_tooltip.an_error_occurred")
            } else if (this.validationStatus === 'success') {
                return this.getMessage("form_element.validation_tooltip.information_is_filled_correctly")
            }
            return this.getMessage("form_element.validation_tooltip.open_field_requirements")
        },
        inputValue: {
            // read inputValue
            get() {
                return this.modelValue
            },
            // set/write a value to update v-model for this component
            set(value) {
                this.$emit("validation-status-change", this.validationStatus)
                this.$emit("update:modelValue", value)
            }
        }
    },
    watch: {
        status: {
            handler() {
                this.updateStatus()
            },
            immediate: true
        },
        modelValue: {
            handler() {
                this.updateStatus()
            },
            immediate: true
        }
    }
}
</script>

<style>
/* begin cmd-input-group ------------------------------------------------------------------------------------------ */
.cmd-input-group {
    &.inline {
        display: flex;
        gap: var(--default-gap);
    }

    /* overwrite default behavior from frontend-framework */
    &.toggle-switch {
        display: block;
    }

    /* overwrite default behavior from frontend-framework */
    > .label-text {
        display: inline-flex;

        .flex-container {
            gap: 1rem 1.5rem; /* vertical, horizontal */
        }

        > span + a:has([class*="icon-"]) {
            margin-left: calc(var(--default-margin) / 2);
        }

        &:hover, &:active, &:focus {
            & + .flex-container {
                input {
                    border-color: var(--default-border-color);
                }
            }
        }
    }

    &.has-state {
        input:checked ~ span {
            --status-color: var(--hyperlink-color);
        }

        .label-text span {
                color: var(--status-color);
            }

        &.error {
            --status-color: var(--error-color);

            /* labels for checkboxes and radiobuttons */
   
        }


        &.multiple-switch {
            &.error {
                --status-color: var(--error-color);

                label {
                    border-color: var(--error-color);

                    > * {
                        color: var(--error-color);
                    }

                    &:is(:hover, :active, :focus) {
                        > * {
                            color: var(--hyperlink-color-highlighted);
                        }
                    }
                }
            }
        }
    }
}
/* end cmd-input-group ------------------------------------------------------------------------------------------ */
</style>