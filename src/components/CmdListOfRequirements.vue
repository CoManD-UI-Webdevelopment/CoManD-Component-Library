<template>
    <!-- begin CmdListOfRequirements ---------------------------------------------------------------------------------------- -->
    <div class="cmd-list-of-requirements">
        <!-- begin CmdHeadline -->
        <CmdHeadline v-if="showHeadline" :headline-level="cmdHeadline.headlineLevel">
             {{ headlineRequirements }}<template v-if="labelText"><br/>"{{ labelText }}"</template>
        </CmdHeadline>
        <!-- end CmdHeadline -->

        <!-- begin list of requirements -->
        <dl>
            <template v-for="(requirement, index) in inputRequirements" :key="index">
                <dt aria-live="assertive" :class="requirement.valid(inputModelValue, inputAttributes) ? 'success' : 'error'">{{ requirement.message }}:</dt>
                <dd :class="requirement.valid(inputModelValue, inputAttributes) ? 'success' : 'error'">
                    <!-- begin CmdIcon -->
                    <CmdIcon
                        aria-live="assertive"
                        :iconClass="requirement.valid(inputModelValue, inputAttributes) ? iconSuccess.iconClass : iconError.iconClass"
                        :type="requirement.valid(inputModelValue, inputAttributes) ? iconSuccess.iconType : iconError.iconType"
                        :title="requirement.valid(inputModelValue, inputAttributes) ? iconSuccess.tooltip : iconError.tooltip"
                    />
                    <!-- end CmdIcon -->
                </dd>
            </template>
        </dl>
        <!-- end list of requirements -->

        <!-- begin helplink -->
        <template v-if="helplink && helplink.show">
            <hr />
            <a
                v-if="helplink.url"
                :href="helplink.url"
                :target="helplink.target"
                @click.prevent
            >
                <!-- begin CmdIcon -->
                <CmdIcon
                    v-if="helplink.icon?.iconClass"
                    :class="helplink.icon?.iconClass"
                    :title="helplink.icon?.tooltip"
                />
                <!-- end CmdIcon -->
                <span v-if="helplink.text">
                    {{ helplink.text }}
                </span>
            </a>
        </template>
        <!-- end helplink -->
    </div>
    <!-- end CmdListOfRequirements ---------------------------------------------------------------------------------------- -->
</template>

<script>
// import mixins
import I18n from "../mixins/I18n"
import DefaultMessageProperties from "../mixins/CmdListOfRequirements/DefaultMessageProperties"

export default {
    name: "CmdListOfRequirements",
    mixins: [
        I18n,
        DefaultMessageProperties
    ],
    props: {
        /**
        * property to check validity of given modelValue
        */
        inputModelValue: {
            type: [String, Boolean, Array, Number],
            default: ""
        },
        /**
         * property to check validity of given attributes
         */
        inputAttributes: {
            type: Object,
            required: true
        },
        /**
         * text for label (used in headline)
         */
        labelText: {
            type: String,
            required: false
        },
        /**
         * list of all requirements
         */
        inputRequirements: {
            type: Array,
            required: true
        },
        /**
         * set a helplink to a different page for further support
         */
        helplink: {
            type: Object,
            required: false
        },
        /**
         * icon to show success-status
         */
        iconSuccess: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-check-circle",
                    tooltip: "success"
                }
            }
        },
        /**
         * icon to show error-status
         */
        iconError: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-error-circle",
                    tooltip: "error"
                }
            }
        },
        /**
        * toggle headline-visibility
        */
        showHeadline: {
            type: Boolean,
            default: true
        },
        /**
         * properties of CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            default() {
                return {
                    headlineLevel: 6
                }
            }
        }
    },
    computed: {
        headlineRequirements() {
            if (this.inputRequirements.length > 1) {
                return this.getMessage("list_of_requirements.headline.requirements_for_input")
            }
            return this.getMessage("list_of_requirements.headline.requirement_for_input")
        }
    }
}
</script>

<style>
/* begin cmd-list-of-requirements ------------------------------------------------------------------------------------------ */
.cmd-list-of-requirements {
    dl {
        span[class*="icon-"] {
            color: var(--status-color);
        }

        .error, .error span {
            --status-color: var(--error-color) !important; /* assure status-color is not overwritten by form-element-status */
        }

        .warning, .warning span {
            --status-color: var(--warning-color) !important; /* assure status-color is not overwritten by form-element-status */
        }

        .success, .success span {
            --status-color: var(--success-color) !important; /* assure status-color is not overwritten by form-element-status */
        }

        .info, .info span {
            --status-color: var(--info-color) !important; /* assure status-color is not overwritten by form-element-status */
        }

        dt, dt span[class*="icon-"] {
            color: var(--status-color);
        }

        & ~ a {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            text-decoration: none;
        }
    }
}
/* end cmd-list-of-requirements ------------------------------------------------------------------------------------------ */
</style>