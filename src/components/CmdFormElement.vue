<template>
    <label
        v-if="(element === 'input' || element === 'select' || element === 'textarea')"
        :class="[
        'cmd-form-element',
         validationStatus,
         $attrs.class,
           {
            disabled: $attrs.disabled,
            inline : displayLabelInline,
            'stretch-field' : stretchField,
            'toggle-switch': toggleSwitch,
            colored: colored,
            'has-state': validationStatus
           }
       ]"
        :for="htmlId"
        :title="$attrs.title"
        ref="label">

        <!-- begin label-text (+ required asterisk) -->
        <span v-if="(labelText || $slots.labeltext) && $attrs.type !== 'checkbox' && $attrs.type !== 'radio'"
              :class="['label-text', { hidden: !showLabel }]">
            <span>
                <span v-if="labelText" v-html="labelText"></span>

                <!-- begin slot 'labeltext' -->
                <slot v-else name="labeltext"/>
                <!-- end slot 'labeltext' -->

                <!-- begin required asterisk -->
                <sup v-if="$attrs.required != null && $attrs.required !== false" aria-hidden="true">*</sup>
                <!-- end required asterisk -->
            </span>

            <!-- begin status-icon (linked with tooltip) -->
            <a v-if="($attrs.required || inputRequirements.length) && showStatusIcon"
               href="#"
               @click.prevent
               :title="validationTooltip"
               :aria-errormessage="tooltipId"
               aria-live="assertive"
               :id="tooltipId">
                <!-- begin CmdIcon -->
                <CmdIcon :iconClass="getStatusIconClass"/>
                <!-- end CmdIcon -->
            </a>
            <!-- end status-icon (linked with tooltip) -->

            <!-- begin CmdTooltipForFormElements -->
            <CmdTooltipForFormElements
                v-if="useCustomTooltip && (validationStatus === '' || validationStatus === 'error')"
                ref="tooltip"
                :validationStatus="validationStatus"
                :relatedId="tooltipId"
                :scrollContainerForTooltip="scrollContainerForTooltip"
                :cmdListOfRequirements="listOfRequirements"
                :role="validationStatus === 'error' ? 'alert' : 'dialog'"
            />
            <!-- end CmdTooltipForFormElements -->
        </span>
        <!-- end label-text (+ required asterisk) -->

        <span v-if="$attrs.type !== 'checkbox' && $attrs.type !== 'radio' && $attrs.type !== 'search'"
              class="flex-container inner-input-wrapper"><!-- container required to place inner icons correctly -->
            <!-- begin CmdIcon (for icon inside field) -->
            <CmdIcon v-if="fieldIconClass" class="place-inside" :iconClass="fieldIconClass"
            />
            <!-- end CmdIcon (for icon inside field) -->

            <!-- begin inputfield -->
            <template v-if="element === 'input' && $attrs.type !== 'search'">
                <input
                    v-bind="elementAttributes"
                    :id="htmlId"
                    :class="inputClass"
                    @focus="tooltip = true"
                    @blur="onBlur"
                    @input="onInput"
                    @mouseover="datalistFocus"
                    @keyup="checkForCapsLock"
                    @change="$emit('change', $event)"
                    :autocomplete="autocomplete"
                    :list="datalist ? datalist.id : null"
                    :value="modelValue"
                    :maxlength="getMaxLength()"
                    ref="input"
                />
            </template>
            <!-- end inputfield -->

            <!-- begin show-password-icon -->
            <a v-if="$attrs.type === 'password'"
               href="#"
               class="place-inside"
               @mousedown.prevent="showPassword"
               @mouseup.prevent="hidePassword"
               @mouseleave.prevent="hidePassword"
               @click.prevent
               :title="iconPasswordVisible.tooltip"
            >
               <!-- begin CmdIcon -->
               <CmdIcon :iconClass="iconPasswordVisible.iconClass"/>
                <!-- end CmdIcon -->
            </a>
            <!-- end show-password-icon -->
        </span>

        <!-- begin datalist -->
        <template v-if="datalist && datalist.options.length">
            <datalist :id="datalist.id">
                <option v-for="(option, index) in datalist.options" :key="index" :value="option"></option>
            </datalist>
        </template>
        <!-- end datalist -->

        <!-- begin checkbox and radiobutton -->
        <template v-else-if="element === 'input' && ($attrs.type === 'checkbox' || $attrs.type === 'radio')">
            <template v-if="!(onLabel && offLabel)">
                <input
                    v-bind="elementAttributes"
                    @change="onChange"
                    @blur="onBlur"
                    :checked="isChecked"
                    :value="inputValue"
                    :class="[inputClass, validationStatus, toggleSwitchIconClass, { 'replace-input-type': replaceInputType}]"
                    :id="htmlId"
                    :disabled="$attrs.disabled"
                    :aria-invalid="validationStatus === 'error'"
                />
                <span v-if="labelText || $slots.labeltext" :class="['label-text', { hidden: !showLabel }]">
                    <span>
                        <!-- begin labelText for checkbox/radio/toggle-switch (without switch-label) -->
                        <span v-if="labelText" v-html="labelText"></span>
                        <!-- end labelText for checkbox/radio/toggle-switch (without switch-label) -->

                        <!-- begin slot 'labeltext' -->
                        <slot v-else name="labeltext"/>
                        <!-- end slot 'labeltext' -->

                        <sup v-if="$attrs.required">*</sup>
                    </span>
                </span>
            </template>

            <!-- begin labels for toggle-switch with switch-label -->
            <template v-else-if="onLabel && offLabel">
                <span class="switch-label-wrapper">
                    <input
                        v-bind="elementAttributes"
                        @change="onChange"
                        @blur="onBlur"
                        :checked="isChecked"
                        :value="inputValue"
                        :class="{inputClass, validationStatus}"
                        :id="htmlId"
                        :disabled="$attrs.disabled"
                        :aria-invalid="validationStatus === 'error'"
                    />
                    <span class="label-text">{{ onLabel }}</span>
                    <span class="label-text">{{ offLabel }}</span>
                </span>
                <!-- begin labelText for checkbox/radio/toggle-switch (with switch-label) -->
                <span v-if="labelText" :class="['label-text', {hidden: !showLabel}]">
                     <span v-html="labelText"></span><sup v-if="$attrs.required">*</sup>
                </span>
                <!-- end labelText for checkbox/radio/toggle-switch (with switch-label) -->
            </template>
            <slot v-else></slot>
            <!-- end labels for toggle-switch with switch-label -->
        </template>
        <!-- end checkbox and radiobutton -->

        <!-- begin selectbox -->
        <select v-if="element === 'select'"
                v-bind="elementAttributes"
                :id="htmlId"
                @blur="onBlur"
                @change="$emit('update:modelValue', $event.target.value)">
            <option
                v-for="(option, index) in selectOptions"
                :key="index"
                :value="option.value"
                :selected="option.value === modelValue"
            >
                {{ option.text }}
            </option>
        </select>
        <!-- end selectbox -->

        <!-- begin textarea -->
        <textarea
            v-if="element === 'textarea'"
            v-bind="elementAttributes"
            :id="htmlId"
            :value="modelValue"
            :maxlength="getMaxLength()"
            @input="onInput"
            @focus="tooltip = true"
            @blur="onBlur"></textarea><!-- no line-break to avoid empty spaces inside textarea -->
        <span v-if="element === 'textarea' && showCharactersTextarea" class="characters-left-wrapper">
            <span v-if="textCharactersLeft">{{ textCharactersLeft }}</span>
            <span :class="['characters-left', {error: charactersLeft === 0}]">{{ charactersLeft }}</span>
        </span>
        <!-- end textarea -->

        <!-- begin searchfield -->
        <template v-else-if="element === 'input' && $attrs.type === 'search'">
            <span class="search-field-wrapper flex-container no-gap">
                <!-- begin CmdIcon (for icon inside field) -->
                <CmdIcon v-if="fieldIconClass" class="place-inside" :iconClass="fieldIconClass"/>
                <!-- end CmdIcon (for icon inside field) -->
                <input
                    v-bind="elementAttributes"
                    :id="htmlId"
                    @input="onInput"
                    :maxlength="getMaxLength()"
                    :value="modelValue"
                />
                <a v-if="showSearchButton" href="#" :class="['button no-flex', {disabled: $attrs.disabled}]"
                   :title="iconSearch.tooltip" @click.prevent="executeSearch">
                    <!-- begin CmdIcon -->
                    <CmdIcon :iconClass="iconSearch.iconClass"/>
                    <!-- end CmdIcon -->
                </a>
                <a v-if="iconDelete?.show" href="#" @click.prevent="$emit('update:modelValue', '')"
                   :title="iconDelete?.tooltip">
                    <!-- begin CmdIcon -->
                    <CmdIcon :iconClass="iconDelete?.iconClass" :type="iconDelete?.iconType"/>
                    <!-- end CmdIcon -->
                </a>
            </span>
        </template>
    </label>
    <!-- end searchfield -->

    <!-- begin button -->
    <button v-else-if="element === 'button'" class="button" v-bind="buttonAttrs" @click="submit">
        <!-- begin CmdIcon -->
        <CmdIcon
            v-if="nativeButton?.icon?.show && (nativeButton?.icon?.position === 'before' || !nativeButton?.icon?.position)"
            :iconClass="nativeButton?.icon?.iconClass"
            :type="nativeButton?.icon?.iconType"
        />
        <!-- end CmdIcon -->
        <span v-if="nativeButton?.icon && nativeButton?.text">{{ nativeButton.text }}</span>
        <template v-else>
            {{ nativeButton.text }}
        </template>
        <!-- begin CmdIcon -->
        <CmdIcon
            v-if="nativeButton?.icon?.show && nativeButton?.icon?.position === 'after'"
            :iconClass="nativeButton?.icon?.iconClass"
            :type="nativeButton?.icon?.iconType"
        />
        <!-- end CmdIcon -->
    </button>
    <!-- end button -->
</template>

<script>
// import mixins
import I18n from "../mixins/I18n"
import DefaultMessageProperties from "../mixins/CmdFormElement/DefaultMessageProperties"
import FieldValidation from "../mixins/FieldValidation.js"
import Identifier from "../mixins/Identifier.js"
import Tooltip from "../mixins/Tooltip.js"

const TYPES_WITHOUT_MAXLENGTH = ["color", "date", "datetime-local", "file", "number", "range"]

export default {
    inheritAttrs: false,
    name: "CmdFormElement",
    mixins: [
        I18n,
        DefaultMessageProperties,
        FieldValidation,
        Identifier,
        Tooltip
    ],
    data() {
        return {
            errorOccurred: 0
        }
    },
    props: {
        /**
         * specify a scroll-container which scrolling hides the tooltip
         */
        scrollContainerForTooltip: {
            type: String,
            required: false
        },
        /**
         * set value for v-model (must be named modelValue in vue3 if default v-model should be used)
         */
        modelValue: {
            type: [String, Boolean, Array, Number],
            default: ""
        },
        /**
         * set type of native form-element
         *
         * @allowedValues: input, select, textarea, button
         */
        element: {
            type: String,
            validator(value) {
                return value === "input" ||
                    value === "select" ||
                    value === "textarea" ||
                    value === "button"
            },
            default() {
                return "input"
            }
        },
        /**
         * hide label (and asterisk if mandatory)
         *
         * label may not be removed, because it is required for accessibility
         */
        showLabel: {
            type: Boolean,
            default: true
        },
        /**
         * text for label
         *
         * @requiredForAccessibility: true
         * @canContainHtml: true
         */
        labelText: {
            type: String,
            required: false
        },
        /**
         * set to activate to use toggle-switch-styling
         *
         * element-prop must be set to "input" and type-attribute must be set to "checkbox" or "radio"
         *
         * @affectsStyling: true
         */
        toggleSwitch: {
            type: Boolean,
            default: false
        },
        /**
         * text for on-label
         *
         * set to activate switch-label (=label is placed on toggle-switch (not behind))
         * toggleSwitch-prop must be set to "true"
         * element-prop must be set to "input" and type-attribute must be set to "checkbox" or "radio"
         */
        onLabel: {
            type: String,
            required: false
        },
        /**
         * text for off-label
         *
         * set to activate switch-label (=label is placed on toggle-switch (not behind))
         * toggleSwitch-prop must be set to "true"
         * element-prop must be set to "input" and type-attribute must be set to "checkbox" or "radio"
         */
        offLabel: {
            type: String,
            required: false
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
         * allow checkbox/radio-buttons to get value from outside
         */
        inputValue: {
            type: [String, Number],
            required: false
        },
        /**
         * for replacing native checkboxes/radio-buttons by custom ones (based on frontend-framework)
         *
         * @affectsStyling: true
         */
        replaceInputType: {
            type: Boolean,
            default: false
        },
        /**
         * set an optional class on native form-element (use native class="" on component ot set class on outer-component-element)
         *
         * may not be named as 'class' because it is a reserved keyword in JavaScript
         */
        inputClass: {
            type: String,
            required: false
        },
        /**
         * set if a native datalist should be used
         */
        datalist: {
            type: Object,
            required: false
        },
        /**
         * list of options for selectbox
         *
         * element-property must be 'select'
         */
        selectOptions: {
            type: Array,
            required: false
        },
        /**
         * activate if interactive status-icon (to show requirements) should be shown inline with label
         */
        showStatusIcon: {
            type: Boolean,
            default: true
        },
        /**
         * native button
         */
        nativeButton: {
            type: Object,
            default() {
                return {
                    text: "",
                    icon: {
                        show: true,
                        iconClass: "",
                        position: "left",
                        tooltip: ""
                    }
                }
            }
        },
        /**
         * set class for inner icon (icon placed 'inside' input/ left of input-text)
         *
         * element-property must be 'input' and type-property may not be checkbox or radio
         */
        fieldIconClass: {
            type: String,
            required: false
        },
        /**
         * activate if label-text should be place inline/left of form-element (and not above)
         *
         * type-property may not be checkbox or radio
         */
        displayLabelInline: {
            type: Boolean,
            required: false
        },
        /**
         * activate if field should be stretch over remaining (horizontal) space if inline
         *
         * displayLabelInline-property must be activated
         */
        stretchField: {
            type: Boolean,
            default: false
        },
        /**
         * set status for label and form-element
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
         * toggle display of number of used and allowed characters for textarea
         *
         * type-property must be set to textarea
         */
        showCharactersTextarea: {
            type: Boolean,
            default: true
        },
        /**
         * text shown in front of character-count below textarea
         *
         * type-property must be set to textarea
         * showCharactersTextarea-property must be activated
         */
        textCharactersLeft: {
            type: String,
            default: "Characters left:"
        },
        /**
         * toggle visibility of search-button (next to search-field)
         */
        showSearchButton: {
            type: Boolean,
            default: true
        },
        /**
         * icon to delete search term
         *
         * element-property must be set to 'input'
         * type-property must be set to 'search'
         *
         */
        iconDelete: {
            type: Object,
            default() {
                return {
                    show: true,
                    iconClass: "icon-cancel-circle",
                    tooltip: "Delete term"
                }
            }
        },
        /**
         * icon to search term
         *
         * element-property must be set to 'input'
         * type-property must be set to 'search'
         *
         */
        iconSearch: {
            type: Object,
            default() {
                return {
                    show: true,
                    iconClass: "icon-search",
                    tooltip: "Search"
                }
            }
        },
        /**
         * icon for error-validated items in list-of-requirements
         *
         * element-property must be set to 'input'
         * showRequirements-subproperty (of CmdListOfRequirements) must be set to 'true'
         *
         */
        iconHasStateError: {
            type: Object,
            default() {
                return {
                    show: true,
                    iconClass: "icon-error-circle",
                    tooltip: "Error"
                }
            }
        },
        /**
         * icon for warning-validated items in list-of-requirements
         *
         * element-property must be set to 'input'
         * showRequirements-subproperty (of CmdListOfRequirements)  must be set to 'true'
         *
         */
        iconHasStateWarning: {
            type: Object,
            default() {
                return {
                    show: true,
                    iconClass: "icon-warning-circle",
                    tooltip: "Warning"
                }
            }
        },
        /**
         * icon for success-validated items in list-of-requirements
         *
         * element-property must be set to 'input'
         * showRequirements-subproperty (of CmdListOfRequirements)  must be set to 'true'
         *
         */
        iconHasStateSuccess: {
            type: Object,
            default() {
                return {
                    show: true,
                    iconClass: "icon-check-circle",
                    tooltip: "Success"
                }
            }
        },
        /**
         * icon for info-validated items in list-of-requirements
         *
         * element-property must be set to 'input'
         * showRequirements-sub-property (of CmdListOfRequirements) must be set to 'true'
         *
         */
        iconHasStateInfo: {
            type: Object,
            default() {
                return {
                    show: true,
                    iconClass: "icon-info-circle",
                    tooltip: "Info"
                }
            }
        },
        /**
         * toggle if toggle-switch shows icons for checked/unchecked-status
         */
        useIconsForToggleSwitch: {
            type: Boolean,
            default: false
        },
        /**
         * icon for toggle-switch checked
         *
         * toggle-switch-property must be activated
         * use-icons-for-toggle-switch-property must be activated
         */
        toggleSwitchCheckedIconClass: {
            type: String,
            default: "icon-check-circle"
        },
        /**
         * icon for toggle-switch unchecked
         *
         * toggle-switch-property must be activated
         * use-icons-for-toggle-switch-property must be activated
         */
        toggleSwitchUncheckedIconClass: {
            type: String,
            default: "icon-cancel-circle"
        },
        /**
         * icon to toggle password-visibility
         *
         * element-property must be set to 'input'
         * type-property must be set to 'password'
         *
         */
        iconPasswordVisible: {
            type: Object,
            default() {
                return {
                    show: true,
                    iconClass: "icon-visible",
                    tooltip: "Show password"
                }
            }
        },
        /**
         * icon to toggle password-visibility
         *
         * element-property must be set to 'input'
         * type-property must be set to 'password'
         *
         */
        iconPasswordInvisible: {
            type: Object,
            default() {
                return {
                    show: true,
                    iconClass: "icon-not-visible"
                }
            }
        }
    },
    computed: {
        elementAttributes() {
            const commonAttributes = ["name", "required", "readonly", "disabled", "autofocus"]
            const attributes = {
                input: [...commonAttributes, "type", "minlength", "pattern", "min", "max", "multiple", "step", "autocomplete", "placeholder"],
                select: [...commonAttributes, "multiple"],
                textarea: [...commonAttributes, "placeholder"]
            }
            const attrs = {}
            if (attributes[this.element]) {
                Object.entries(this.$attrs).filter(([name]) => attributes[this.element].includes(name)).forEach(([name, value]) => attrs[name] = value)
            }
            return attrs
        },
        buttonAttrs() {
            // copy all native attributes
            const allAttrs = {...this.$attrs}

            // check if specific tooltip for icon is set (and add as title-attribute)
            if (this.nativeButton.icon?.tooltip) {
                allAttrs.title = this.nativeButton.icon?.tooltip
            }

            return allAttrs
        },
        tooltipHeadline() {
            return {
                text: this.labelText,
                level: "5"
            }
        },
        isChecked() {
            if (typeof this.modelValue === "boolean") {
                return this.modelValue
            }
            if (typeof this.modelValue === "string") {
                return this.modelValue === this.inputValue
            }
            if (typeof this.modelValue === "number") {
                return this.modelValue === this.inputValue
            }
            if (this.modelValue !== undefined) {
                return this.modelValue.includes(this.inputValue)
            }
            return false
        },
        charactersLeft() {
            return this.getMaxLength() - this.modelValue.length
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
            } else if (this.capsLockActivated) {
                return this.getMessage("form_element.validation_tooltip.caps_lock_is_activated")
            }
            return this.getMessage("form_element.validation_tooltip.open_field_requirements")
        },
        autocomplete() {
            if (this.$attrs.type !== 'file') {
                return this.datalist ? 'off' : 'on'
            }
            return null
        },
        // toggle icons for toggle-switch
        toggleSwitchIconClass() {
            if (this.toggleSwitch && this.useIconsForToggleSwitch && this.toggleSwitchUncheckedIconClass && this.toggleSwitchCheckedIconClass) {
                if (this.isChecked) {
                    return this.toggleSwitchCheckedIconClass
                }
                return this.toggleSwitchUncheckedIconClass
            }
            return null
        }
    },
    methods: {
        setFocus() {
            this.$refs.label.querySelector("input, select, textarea")?.focus()
        },
        additionalStandardRequirements() {
            const requirements = []
            // check if field is type "email"
            if (this.$attrs.type === "email") {
                requirements.push({
                    message: this.getMessage("form_element.validation_tooltip.is_valid_email"),
                    valid: () => this.$refs.input.checkValidity()
                })
            }
            return requirements
        },
        getDomElement() {
            return this.$refs.label
        },
        // define max-length for different input-types
        getMaxLength() {
            if (this.$attrs.element === 'textarea') {
                return this.$attrs.maxlength > 0 ? this.$attrs.maxlength : 5000
            }

            if (!TYPES_WITHOUT_MAXLENGTH.includes(this.$attrs.type)) {
                return this.$attrs.maxlength > 0 ? this.$attrs.maxlength : 255
            }
            return null
        },
        validateInput(event) {
            // check if surrounding form with data-use-validation exists
            const useValidation = event.target.closest("form")?.dataset.useValidation === "true"

            if (useValidation) {
                // if input is filled, set status to success (expect for checkboxes and radiobuttons)
                if (!["checkbox", "radio"].includes(this.$attrs.type) && this.modelValue) {
                    this.validationStatus = "success"
                }

                if (typeof event.target.checkValidity === "function" && !event.target.checkValidity()) {
                    this.validationStatus = "error"
                } else {
                    if (this.customRequirements) {
                        // check if customRequirement returns invalid result
                        const invalidCustomRequirement = this.customRequirements.some(requirement => {
                            return !requirement.valid(this.modelValue)
                        })

                        // set validation-status if invalidCustomRequirement returns at least one invalid entry
                        if (invalidCustomRequirement) {
                            this.validationStatus = "error"
                        }
                    }
                }

                this.$emit('validation-status-change', this.validationStatus)
            }
        },
        onBlur(event) {
            this.validateInput(event)
            this.closeTooltipOnBlur()
            this.$emit('blur', event)
        },
        onInput(event) {
            this.validateInput(event)
            this.$emit('update:modelValue', event.target.value)
        },
        onChange(event) {
            if (typeof this.modelValue === "boolean") {
                this.$emit("update:modelValue", event.target.checked)
            } else if (typeof this.modelValue === "string") {
                this.$emit("update:modelValue", event.target.value)
            } else if (this.modelValue !== undefined) {
                let values = [...this.modelValue]
                if (event.target.checked) {
                    values.push(event.target.value)
                } else {
                    values = values.filter(value => value !== event.target.value)
                }
                this.$emit("update:modelValue", values)
            }
        },
        datalistFocus() {
            /* corrects focus-bug for datalist in firefox */
            if (this.datalist) {
                this.$refs.label.focus()
            }
        },
        showPassword() {
            // get password-field
            const passwordField = this.$refs.input

            // get value of password field (to save it temporary)
            const password = passwordField.value

            // toggle input-type to make password visible
            passwordField.nextElementSibling.classList.replace(this.iconPasswordVisible.iconClass, this.iconPasswordInvisible.iconClass)
            passwordField.setAttribute("type", "text")

            // assign saved password back to field
            passwordField.setAttribute("value", password)
        },
        hidePassword() {
            this.$refs.input.nextElementSibling.classList.replace(this.iconPasswordInvisible.iconClass, this.iconPasswordVisible.iconClass)
            this.$refs.input.setAttribute("type", "password")
        },
        executeSearch() {
            this.$emit("search", this.value)
        },
        closeTooltipOnBlur() {
            // close tooltip by calling function from CmdTooltipForInputElements using $refs
            if (this.$refs.tooltip) {
                this.$refs.tooltip.hideTooltip()
            }
        },
        // (submit-)button is clicked
        submit(event) {
            this.$emit("submit", event)
        }
    },
    watch: {
        status: {
            handler() {
                this.validationStatus = this.status || ""
            },
            immediate: true
        }
    }
}
</script>

<style>
/* begin cmd-form-element ------------------------------------------------------------------------------------------ */
.cmd-form-element {
    & input.replace-input-type {
        &:checked {
            &::after {
                top: 0;
            }
        }
    }

    /* icon right aligned in input */
    input + .place-inside {
        left: auto;
        right: .5rem;
        color: var(--hyperlink-color);

        span {
            color: inherit;
        }
    }

    &.has-state, & + .cmd-tooltip {
        &.error {
            * {
                --status-color: var(--error-color);
            }
        }

        ::placeholder {
            color: var(--status-color);
        }

        span {
            color: var(--status-color);

            &.place-inside {
                color: inherit;
            }
        }

        &.success * {
            --status-color: var(--success-color);
        }
    }

    :is(input[type="checkbox"], input[type="radio"]):checked {
        ~ .label-text span {
            color: var(--hyperlink-color);
        }

        &:hover, &:active, &:focus {
            ~ .label-text span {
                color: var(--hyperlink-color-highlighted);
            }
        }
    }

    &.inline {
        .inner-input-wrapper {
            & > a:not(.button) {
                margin-left: calc(var(--default-margin) / 2);
            }
        }

        &.stretch-field {
            .inner-input-wrapper {
                width: 100%;
            }
        }
    }

    .search-field-wrapper {
        margin: 0;

        a {
            position: absolute;
            top: 50%;
            right: 1rem;
            transform: translateY(-50%);
            z-index: 100;

            /* set styles to avoid overwriting by has-state-colors */
            &.button {
                span {
                    color: var(--color-scheme-background);
                }

                &:hover, &:active, &:focus {
                    span {
                        color: var(--color-scheme-text-color);
                    }
                }
            }
        }

        a.button {
            right: 0;

            & + a {
                right: 5rem;
            }
        }
    }

    .place-inside {
        + .search-field-wrapper {
            input {
                padding-left: calc(var(--default-padding) * 3);
            }
        }
    }

    .characters-left-wrapper {
        margin-top: calc(var(--default-margin) / 2);
        display: block;

        span:not(:only-child):first-child {
            margin-right: calc(var(--default-margin) / 2);
            color: var(--color-scheme-text-color);
        }

        .characters-left {
            color: var(--color-scheme-text-color);

            &.error {
                color: var(--error-color);
            }
        }
    }
}

/* end cmd-form-element------------------------------------------------------------------------------------------ */
</style>
