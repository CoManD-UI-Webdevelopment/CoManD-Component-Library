<template>
    <!-- begin CmdTooltip -->
    <CmdTooltip
        ref="tooltip"
        class="box cmd-tooltip-for-form-elements"
        :class="validationStatus"
        :relatedId="relatedId"
        :toggle-visibility-by-click="true">

        <!-- begin CmdListOfRequirements -->
        <CmdListOfRequirements
            v-if="cmdListOfRequirements.showRequirements"
            :showHeadline="cmdListOfRequirements.showHeadline"
            :inputRequirements="cmdListOfRequirements.inputRequirements"
            :helplink="cmdListOfRequirements.helplink"
            :inputModelValue="cmdListOfRequirements.inputModelValue"
            :inputAttributes="cmdListOfRequirements.inputAttributes"
            :labelText="cmdListOfRequirements.labelText"
        />
        <!-- end CmdListOfRequirements -->
    </CmdTooltip>
    <!-- end CmdTooltip -->
</template>

<script>
export default {
    name: "CmdTooltipForFormElements",
    props: {
        /**
         * related-id for CmdTooltip-component
         */
        relatedId: {
            type: String,
            default: ""
        },
        /**
         * validation-status for CmdTooltip-component
         *
         * @allowedValues: "", error, warning, success, info
         *
         * @affectsStyling: true
         */
        validationStatus: {
            type: String,
            default: "",
            validator(value) {
                return value === "" ||
                    value === "error" ||
                    value === "warning" ||
                    value === "success" ||
                    value === "info"
            }
        },
        /**
         * properties for CmdListOfRequirements-component
         */
        cmdListOfRequirements: {
            type: Object,
            default() {
                return {
                    showRequirements: true,
                    validationTooltip: "",
                    inputRequirements: [],
                    inputAttributes: {},
                    showHeadline: true,
                    inputModelValue: "",
                    helplink: {},
                    labelText: ""
                }
            }
        }
    },
    methods: {
        hideTooltip() {
            // close tooltip by calling function from CmdTooltip using $refs
            this.$refs.tooltip.hideTooltip()
        }
    }
}
</script>

<style>
/* begin cmd-tooltip-for-form-elements ---------------------------------------------------------------------------------------- */
.cmd-tooltip-for-form-elements {
    .headline-wrapper {
        a[class*="icon-"], a:has([class*="icon-"]) {
            margin-left: auto;

            &:hover, &:active, &:focus {
                background: none;
            }
        }
    }
}
/* end cmd-tooltip-for-form-elements ---------------------------------------------------------------------------------------- */
</style>