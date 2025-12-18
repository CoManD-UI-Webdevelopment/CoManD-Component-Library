<template>
    <!-- begin CmdFakeSelect ---------------------------------------------------------------------------------------- -->
    <div
        :class="[
            validationStatus,
            'cmd-fake-select label',
            {
                color: type === 'color',
                'has-state': validationStatus && validationStatus !== 'none',
                disabled: $attrs.disabled
            }
        ]"
        :title="$attrs.title"
        role="listbox"
        :aria-labelledby="htmlId"
        :aria-required="$attrs.required !== undefined"
        ref="fakeselect"
    >
        <template v-if="showLabel">
            <!-- begin label -->
            <span class="label-text">
                <span :id="htmlId">{{ labelText }}<sup v-if="$attrs.required !== undefined" aria-hidden="true">*</sup></span>

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
                    :validationMessage="getValidationMessage"
                    :relatedId="tooltipId"
                    :cmdListOfRequirements="listOfRequirements"
                    :role="validationStatus === 'error' ? 'alert' : 'dialog'"
                />
                <!-- end CmdTooltipForFormElements -->
            </span>
            <!-- end label -->
        </template>
        <ul :class="{'open': showOptions}" @clickout="closeOptions" :aria-expanded="showOptions">
            <li>
                <!-- begin default/selected-option -->
                <a href="#" @click.prevent="toggleOptions" @blur="onBlur" :title="optionIcon?.tooltip">
                    <!-- begin show flag -->
                    <img v-if="type === 'country' && optionCountry"
                         :src="pathFlag(optionCountry)"
                         :alt="optionCountry"
                         :class="['flag', optionCountry]"/>
                    <!-- end show flag -->

                    <!-- begin show color-box -->
                    <span v-else-if="type === 'color'" :style="'background: ' + optionColor"></span>
                    <!-- end show color-box -->

                    <!-- begin optional icon -->
                    <!-- begin CmdIcon -->
                    <CmdIcon v-if="optionIcon?.iconClass" :type="optionIcon?.iconType"
                             :iconClass="optionIcon?.iconClass"/>
                    <!-- end CmdIcon -->
                    <!-- end optional icon -->

                    <!-- begin text -->
                    <span v-if="optionName" class="option-name">{{ optionName }}</span>
                    <!-- end text -->

                    <!-- begin custom dropdown-icon -->
                    <!-- begin CmdIcon -->
                    <CmdIcon
                        v-if="iconDropdown"
                        :iconClass="iconDropdown.iconClass"
                        :type="iconDropdown.iconType"
                        :title="iconDropdown.tooltip"
                    />
                    <!-- end CmdIcon -->
                    <!-- end custom dropdown-icon -->
                </a>
                <!-- end default/selected-option-->

                <!-- begin default dropdown (incl. optional icon) -->
                <ul v-if="type === 'default' && showOptions" role="listbox">
                    <li v-for="(option, index) in selectData" :key="index" role="option"
                        :aria-selected="option.value === modelValue">
                        <!-- begin type 'href' -->
                        <a v-if="optionLinkType === 'href'"
                           href="#" @click.prevent="selectOption(option.value)"
                           :class="{'active' : option.value === modelValue}"
                           :title="option.tooltip"
                        >
                            <!-- begin CmdIcon -->
                            <CmdIcon v-if="option.iconClass" :iconClass="option.iconClass" :type="option.iconType"/>
                            <!-- end CmdIcon -->
                            <span v-if="option.text">{{ option.text }}</span>
                        </a>
                        <!-- end type 'href' -->

                        <!-- begin type 'router' -->
                        <router-link v-if="optionLinkType === 'router'" to="#"
                                     @click.prevent="selectOption(option.value)"
                                     :class="{'active' : option.value === modelValue}">
                            <!-- begin CmdIcon -->
                            <CmdIcon v-if="option.iconClass" :iconClass="option.iconClass" :type="option.iconType"/>
                            <!-- end CmdIcon -->
                            <span>{{ option.text }}</span>
                        </router-link>
                        <!-- end type 'router' -->
                    </li>
                </ul>
                <!-- end default dropdown (incl. optional icon) -->

                <!-- begin dropdown with checkboxes/countries/colors -->
                <ul v-else-if="type !== 'default' && type !== 'content' && showOptions"
                    :class="{'checkbox-options': type === 'checkboxOptions'}" :aria-expanded="showOptions">
                    <li v-for="(option, index) in selectData" :key="index">
                        <!-- begin checkboxes -->
                        <label v-if="type === 'checkboxOptions'" :for="'option-' + (index + 1)"
                               :class="{'active' : modelValue.includes(`${option.value}`)}">
                            <input type="checkbox" :value="option.value" @change="optionSelect"
                                   :checked="compareValues(option.value)" :id="'option-' + (index + 1)"/>
                            <span>{{ option.text }}</span>
                        </label>
                        <!-- end checkboxes -->

                        <!-- begin country-flags -->
                        <a v-else-if="type === 'country'" href="#"
                           @click.prevent="selectOption(option.value)"
                           :class="{'active' : option.value === modelValue}">
                            <img class="flag" :src="pathFlag(option.value)"
                                 :alt="option.text"/>
                            <span>{{ option.text }}</span>
                        </a>
                        <!-- end country-flags -->

                        <!-- begin color-boxes -->
                        <a v-else-if="type === 'color'" href="#" @click.prevent="selectOption(option.value)"
                           :class="{'active' : option.value === modelValue}">
                            <span class="color" :style="'background: ' + option.value"></span>
                            <span>{{ option.text }}</span>
                        </a>
                        <!-- end color-boxes -->
                    </li>

                    <!-- begin (de)select all options -->
                    <li v-if="showSelectAllOptions && type === 'checkboxOptions'" class="select-all-options">
                        <a href="#" @click.prevent="toggleAllOptions">
                            <!-- begin CmdIcon -->
                            <CmdIcon v-if="!allOptionsSelected" :iconClass="iconSelectAllOptions.iconClass"
                                     :type="iconSelectAllOptions.iconType"/>
                            <CmdIcon v-else :iconClass="iconDeselectAllOptions.iconClass"
                                     :type="iconDeselectAllOptions.iconType"/>
                            <!-- end CmdIcon -->
                            <span>{{ selectAllOptionsText }}</span>
                        </a>
                    </li>
                    <!-- end (de)select all options -->
                </ul>
                <!-- end dropdown with checkboxes/countries/colors -->

                <!-- begin dropdown with slot -->
                <template v-else-if="type === 'content' && showOptions" :aria-expanded="showOptions">
                    <slot></slot>
                </template>
                <!-- end dropdown with slot -->
            </li>
        </ul>
    </div>
    <!-- end CmdFakeSelect ---------------------------------------------------------------------------------------- -->
</template>

<script>
// import mixins
import I18n from "../mixins/I18n"
import DefaultMessageProperties from "../mixins/CmdFakeSelect/DefaultMessageProperties"
import FieldValidation from "../mixins/FieldValidation"
import Identifier from "../mixins/Identifier"
import Tooltip from "../mixins/Tooltip"

export default {
    name: 'CmdFakeSelect',
    inheritAttrs: false,
    mixins: [
        I18n,
        DefaultMessageProperties,
        FieldValidation,
        Identifier,
        Tooltip
    ],
    data() {
        return {
            showOptions: false,
            validationStatus: "",
            allOptionsSelected: false
        }
    },
    props: {
        /**
         * set different default selectbox-types for
         *
         * @allowedValues: default, color, country, content, checkboxOptions
         */
        type: {
            type: String,
            default: "default",
            validator(value) {
                return value === "default" ||
                    value === "color" ||
                    value === "country" ||
                    value === "content" ||
                    value === "checkboxOptions"
            }
        },
        /**
         * set type of option-links
         *
         * @allowedValues: href, router
         */
        optionLinkType: {
            type: String,
            default: "href",
            validator(value) {
                return value === "href" ||
                    value === "router"
            }
        },
        /**
         * set default v-model (must be named modelValue in Vue3)
         */
        modelValue: {
            type: [String, Number, Array],
            default: ""
        },
        /**
         * list of options to select (incl. displayed names and values)
         *
         * type-property must be set to "checkboxOptions"
         */
        selectData: {
            type: Array,
            required: false
        },
        /**
         * toggles option to (de)select all options in a checkbox-list
         *
         * type-property must be set to "checkboxOptions"
         */
        showSelectAllOptions: {
            type: Boolean,
            default: true
        },
        /**
         * status (i.e. for validation)
         *
         * @allowedValues: "" , error, warning, success, info
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
         * icon for dropdown-icon (i.e. an angle/arrow)
         *
         * @requiredForAccessibility: partial
         * @defaultIcon: icon-chevron-one-stripe-down
         */
        iconDropdown: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-chevron-one-stripe-down",
                    tooltip: "Toggle dropdown visibility",
                    iconType: "auto"
                }
            }
        },
        /**
         * label-text for fake-select
         *
         * @requiredForAccessibility: true
         */
        labelText: {
            type: String,
            required: false
        },
        /**
         * toggle label visibility
         */
        showLabel: {
            type: Boolean,
            default: true
        },
        /**
         * activate if interactive status-icon (to show requirements) should be shown inline with label
         */
        showStatusIcon: {
            type: Boolean,
            default: true
        },
        /**
         * path to flag-files (will be combined with flag isoCode to load svg)
         */
        pathFlags: {
            type: String,
            default: "/media/images/flags"
        },
        /**
         * default text if no option is selected (and first option is not used)
         */
        textPleaseSelect: {
            type: String,
            default: "Please select\u2026"
        },
        /**
         * set icon for "select all"-option
         */
        iconSelectAllOptions: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-check",
                    iconType: "auto"
                }
            }
        },
        /**
         * set icon for "deselect all"-option
         */
        iconDeselectAllOptions: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-cancel",
                    iconType: "auto"
                }
            }
        }
    },
    computed: {
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
        // get the displayed option name
        optionName() {
            // fake a native selectbox
            if (this.type !== "checkboxOptions" && this.type !== "content" && this.modelValue) {
                const result = this.selectData.find(option => option.value === this.modelValue)

                // if find() returns some data, return this data
                if (result) {
                    return result.text
                }
            }

            // selectbox with checkbox-options
            else if (this.type === "checkboxOptions") {
                if (this.modelValue.length === 1) {
                    return this.selectData.find(option => String(option.value) === String(this.modelValue[0]))?.text
                } else if (this.modelValue.length > 1) {
                    return this.getMessage("fake_select.option.options_selected", this.modelValue.length)
                }
            } else if (this.selectData?.length) {
                // return text of first option nothing is selected (and type !== checkboxOptions && type !== content)
                return this.selectData[0].text
            }

            // return default text if nothing is selected (and no modelValue exists) (and type !== checkboxOptions && type !== content)
            return this.textPleaseSelect
        },
        // get the displayed icon (only available for default selectbox)
        optionIcon() {
            if (this.type === "default") {
                const selectedOption = this.selectData.find(option => {
                    return option.value === this.modelValue
                })

                return {
                    iconClass: selectedOption?.iconClass,
                    tooltip: selectedOption?.tooltip
                }
            }
            return null
        },
        optionCountry() {
            if (this.type === "country") {
                return this.modelValue || this.selectData?.[0]?.value
            }
            return null
        },
        optionColor() {
            if (this.type === "color") {
                return this.modelValue || this.selectData?.[0]?.value
            }
            return null
        },
        selectAllOptionsText() {
            if (Array.isArray(this.modelValue) && this.modelValue.length === this.selectData.length) {
                this.allOptionsSelected = true
                return this.getMessage("fake_select.linktext.deselect_all_options")
            }
            this.allOptionsSelected = false
            return this.getMessage("fake_select.linktext.select_all_options")
        }
    },
    methods: {
        toggleAllOptions() {
            this.validationStatus = "success"
            
            const checkboxValues = []
            if (this.modelValue.length === this.selectData.length) {
                if (this.$attrs.required) {
                    this.validationStatus = "error"
                }
            } else {
                for (let i = 0; i < this.selectData.length; i++) {
                    checkboxValues.push(String(this.selectData[i].value))
                }
            }

            this.$emit("update:modelValue", checkboxValues)
            this.$emit('validation-status-change', this.validationStatus)
        },
        // toggle options/dropdown
        toggleOptions() {
            if (this.$attrs.disabled !== 'disabled') {
                this.showOptions = !this.showOptions
            }
        },
        // check if array of selected options includes number or string version of value
        compareValues(option) {
            return this.modelValue.some((item) => {
                return item === option || item === String(option)
            })
        },
        // check if an option is selected for default-selectbox
        selectOption(optionValue) {
            this.validationStatus = "success"
            if (this.$attrs.required !== undefined) {
                if (!optionValue) {
                    this.validationStatus = "error"
                }
            }

            // hide options after selection
            this.showOptions = false
            
            this.$emit('update:modelValue', optionValue)
            this.$emit('validation-status-change', this.validationStatus)
        },
        // check if a checkbox is changed for selectbox with checkboxes
        optionSelect(event) {
            this.validationStatus = "success"

            let value = [...this.modelValue] // copy array from props
            if (event.target.checked) {
                value.push(event.target.value) // attention: value will be transformed into string!
            } else {
                value = value.filter(item => item !== event.target.value && String(item) !== event.target.value)
            }
            if (this.$attrs.required !== undefined && !value.length) {
                this.validationStatus = "error"
            }

            this.$emit('update:modelValue', value)
        },
        // hide options (in dropdown)
        closeOptions() {
            this.showOptions = false
        },
        // set path for flag-icons (type-property must be 'country')
        pathFlag(isoCode) {
            return this.pathFlags + "/flag-" + isoCode + ".svg"
        },
        // validate on blur
        onBlur() {
            this.validationStatus = "success"

            if (this.$attrs.required !== undefined && (!this.modelValue || this.modelValue.length === 0)) {
                this.validationStatus = "error"
            }
            
            this.$emit('validation-status-change', this.validationStatus)
        },
        // overwrite requirement-message form fieldValidation.js
        getRequirementMessage() {
            return this.getMessage("fake_select.headline.an_option_is_selected")
        }
    },
    watch: {
        status: {
            handler() {
                this.validationStatus = this.status
            },
            immediate: true
        },
        selectData: {
            handler() {
                // check if given value by modelValue exists (else pre-select first option)
                if (this.type === "default" && this.selectData?.length && !this.selectData.some((option) => option.value === this.modelValue)) {
                    this.$emit("update:modelValue", this.selectData[0].value)
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>

<style>
/* begin cmd-fake-select ------------------------------------------------------------------------------------------ */
.cmd-fake-select {
    align-self: flex-end;
    border-radius: var(--form-input-border-radius);

    > span:first-child {
        a {
            align-self: flex-end;
        }
    }

    a {
        gap: calc(var(--icon-and-text-gap) / 2) !important;

        span {
            text-decoration: none !important;

            &[class*="icon"]:last-child {
                margin-left: auto !important; /* overwrite default settings from frontend-framework */
            }
        }
    }

    > ul {
        height: var(--form-input-height);
        margin: 0;
        display: block;
        min-width: 0;
        box-shadow: none;
        border-radius: var(--form-input-border-radius);

        > li {
            height: 100%;
            border-radius: var(--form-input-border-radius);

            &:first-child {
                > a {
                    height: inherit;
                    border: var(--form-input-border);
                    background: var(--color-scheme-background);
                    color: var(--color-scheme-text-color);
                    border-radius: var(--default-border-radius);

                    img {
                        flex-shrink: 0;
                    }

                    span, [class*="icon"] {
                        color: var(--color-scheme-text-color);
                    }

                    .option-name {
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }

                    > [class*="icon-"]:last-child {
                        margin-left: auto !important; /* overwrite default settings from frontend-framework */
                        font-size: var(--icon-size-small);
                    }

                    &:hover, &:active, &:focus {
                        background: var(--color-white);
                        border-color: var(--primary-color);

                        span, [class*="icon"] {
                            color: var(--hyperlink-color);
                        }
                    }
                }
            }
        }

        &.open {
            ul {
                border-bottom-left-radius: var(--default-border-radius);
                border-bottom-right-radius: var(--default-border-radius);

                > li {
                    &:first-child {
                        > a {
                            border-color: var(--primary-color);
                            border-bottom-left-radius: 0;
                            border-bottom-right-radius: 0;
                        }
                    }
                }

                > li:last-child {
                    border-bottom-left-radius: inherit;
                    border-bottom-right-radius: inherit;

                    > a {
                        border-bottom-left-radius: inherit;
                        border-bottom-right-radius: inherit;
                    }
                }
            }
        }
    }

    li {
        margin-left: 0;
        list-style: none;

        a, a:visited {
            display: flex;
            align-items: center;
            width: 100%;
            padding: var(--form-input-padding);
            padding-top: calc(var(--default-padding) - .06rem);
            padding-right: calc(var(--default-padding) / 2);
            padding-bottom: calc(var(--default-padding) - .06rem);
            outline: none;
            border-bottom: var(--default-border);
            text-decoration: none;

            &:hover, &:active, &:focus {
                background: var(--primary-color);

                span, [class*="icon"] {
                    color: var(--color-white);
                }
            }

            span {
                &:first-child, &:nth-child(2) {
                    border: 0;
                }
            }

            img {
                &.flag {
                    margin: 0 calc(var(--default-margin) / 2) 0 0;
                }
            }

            &.active {
                background: var(--color-light-gray);

                span {
                    color: var(--hyperlink-color);
                }

                &:hover, &:active, &:focus {
                    background: var(--primary-color);

                    span, [class*="icon"] {
                        color: var(--color-white);
                    }
                }
            }
        }

        label {
            display: flex;
        }

        span {
            white-space: nowrap;
        }

        ul {
            position: absolute;
            list-style: none;
            z-index: 10;
            min-width: 100%;
            margin: 0;
            border-bottom-right-radius: var(--default-border-radius);
            border-bottom-left-radius: var(--default-border-radius);
            background: var(--color-scheme-background);
            border: var(--primary-border);

            li {
                &:last-child {
                    a {
                        border-bottom: 0;
                    }
                }
            }

            &.custom-fake-select-content {
                padding: var(--default-padding);

                img {
                    display: block;
                }
            }

            &.checkbox-options {
                li {
                    padding: calc(var(--default-padding) / 2);

                    &.select-all-options {
                        border-top: var(--primary-border);
                        padding: 0;
                    }
                }
            }
        }
    }

    /* use additional class in selector to gain high specificity */
    &.has-state.label {
        &.error * {
            --status-color: var(--error-color);
        }

        &.success * {
            --status-color: var(--success-color);
        }

        .label-text {
            > span, [class*="icon-"] {
                color: var(--status-color);
            }
        }

        > ul {
            > li:first-child {
                > a {
                    text-decoration: none !important;
                    border-color: var(--status-color);

                    > span, [class*="icon-"] {
                        text-decoration: none !important;
                        color: var(--status-color);
                    }

                    &:hover, &:active, &:focus {
                        background: var(--color-scheme-background);

                        span {
                            color: var(--status-color);
                        }
                    }
                }
            }
        }
    }

    &.error, &.disabled {
        a {
            &:hover, &:focus, &:active {
                img {
                    &.flag {
                        border-color: var(--border-color);
                    }
                }
            }
        }
    }

    &.color {
        li {
            a {
                gap: calc(var(--default-gap) / 2);

                > span:first-child {
                    width: 1.5rem;
                    aspect-ratio: 1/1;
                    border: var(--default-border);

                    &[style=""] {
                        display: none;
                    }
                }
            }
        }
    }
}
</style>

<style lang="scss">
@mixin disabled-styles {
    color: var(--disabled-color);
    border-color: var(--disabled-color);
    background: var(--disabled-background);
}

.cmd-fake-select {
    &.disabled {
        > ul {
            > li {
                > a {
                    @include disabled-styles;

                    span {
                        color: var(--disabled-color);
                    }

                    &:hover, &:active, &:focus {
                        cursor: not-allowed;
                        @include disabled-styles;

                        span {
                            color: var(--disabled-color);
                        }
                    }
                }
            }
        }
    }
}

/* end cmd-fake-select ------------------------------------------------------------------------------------------ */
</style>
