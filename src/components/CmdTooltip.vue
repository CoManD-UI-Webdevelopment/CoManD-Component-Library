<template>
    <!-- begin CmdTooltip ---------------------------------------------------------------------------------------- -->
    <!-- teleported to body: tooltip is a popover (top-layer) and its block content (headline, list, close-button) must not be nested in phrasing content or inside a <label> -->
    <Teleport to="body">
    <div :class="['cmd-tooltip', validationStatus]" popover="manual" ref="tooltip" role="tooltip" v-bind="$attrs"
        :id="popoverTargetName" @mouseenter="handleTooltipEnter" @mouseleave="handleTooltipLeave"
        :style="positionAnchor ? 'position-anchor:' + positionAnchor : null"
    >
        <!-- begin CmdHeadline -->
        <CmdHeadline v-if="cmdHeadlineProperties.show && cmdHeadlineProperties.headlineText" v-bind="cmdHeadlineProperties" />
        <!-- end CmdHeadline -->

        <!-- begin button to close tooltip -->
        <CmdLink 
            v-if="cmdLinkCloseButtonProperties.show"
            v-bind="cmdLinkCloseButtonProperties" 
            class="close-tooltip no-style" 
            popovertargetaction="hide" 
            :popovertarget="popoverTargetName"
        />
        <!-- end button to close tooltip -->

        <!-- begin slot-content -->
        <slot>
            <span v-html="tooltipText"></span>
        </slot>
        <!-- end slot-content -->
        <!-- end CmdTooltip ---------------------------------------------------------------------------------------- -->
    </div>
    </Teleport>
</template>

<script>
export default {
    name: "CmdTooltip",
    inheritAttrs: false,
    data() {
        return {
            triggerElement: null,
            tooltipVisibility: false
        }
    },
    inject: {
        injectScrollContainer: {
            default: ""
        }
    },
    props: {
        /**
         * name for popover-target (will be set as id for popover and must correspond popovertarget-value of button that opens the popup)
         * 
         * @requiered-for-accessibility
         */
         popoverTargetName: {
            type: String,
            required: false
        },
        /**
         * positionAnchor
         */
         positionAnchor: {
            type: String,
            required: false
         },
        /**
         * text shown as tooltip
         */
        tooltipText: {
            type: String,
            required: false
        },
        /**
         * delay (in milliseconds) until tooltip will be shown
         *
         * only works on hover/leave
         * 
         * toggleVisibilityByClick-property must be false
         */
        delayToShowTooltip: {
            type: Number,
            default: 0
        },
         /**
         * delay (in milliseconds) until tooltip will be hidden
         *
         * only works on hover/leave
         * 
         * toggleVisibilityByClick-property must be false
         * 
         * minimum should be set to 100 to avoid flickering while user moves mouse over tooltip itself
         */
         delayToHideTooltip: {
            type: Number,
            default: 100
        },
        /**
         * id of related input-element
         */
        relatedId: {
            type: String,
            required: false
        },
        /**
         * validation-status for tooltip
         *
         * @allowedValues: "", error, warning, success, info
         */
        validationStatus: {
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
         * selector of container that scrolls the content of the site
         */
        scrollContainer: {
            type: String,
            default: ".site-wrapper"
        },
        /**
         * properties for CmdLink-compoentnfor close-button
         */
        cmdLinkCloseButton: {
            type: Object,
            required: false
        },
        /**
         * enable toggling tooltip-visibility by click
         */
         showCloseIcon: {
            type: Boolean,
            default: false
        },
         /**
         * properties for CmdHeadline-component
         */
         cmdHeadline: {
            type: Object,
            requiured: false
        }
    },
    computed: {
        cmdHeadlineProperties() {
            return {
                show: true,
                headlineLevel: 6,
                ...this.cmdHeadline
            }
        },
        cmdLinkCloseButtonProperties() {
            return {
                show: true,
                linkType: "button",
                icon: {
                    iconClass: "icon-cancel-circle",
                    tooltip: "Close this tooltip!"
                },
                ...this.cmdLinkCloseButton
            }
        }
    },
    mounted() {
        // provide the container the tooltip scrolls in (and should react to)
        const scrollContainerSelector = this.injectScrollContainer || this.scrollContainer

        if (scrollContainerSelector) {
            const scrollContainerElement = document.querySelector(scrollContainerSelector)

            if (scrollContainerElement) {
                scrollContainerElement.addEventListener("scroll", this.hideTooltip) // avoid fixed tooltip on scroll
            } else {
                console.warn("'CmdTooltip-Component': Element accessed by " + scrollContainerSelector + " does not exist! Please provide selector for an existing element!")
            }
        }

        if(this.relatedId) {
            // get eleemnt that triggers the tooltip
            this.triggerElement = document.getElementById(this.relatedId)
            if (!this.triggerElement) return
            
            // add event listeners
            this.triggerElement.addEventListener("mouseenter", this.handleTriggerEnter)
            this.triggerElement.addEventListener("mouseleave", this.handleTriggerLeave)
        }
    },
    beforeUnmount() {
        if(this.relatedId) {
            if (!this.triggerElement) return

            this.triggerElement.removeEventListener("mouseenter", this.handleTriggerEnter)
            this.triggerElement.removeEventListener("mouseleave", this.handleTriggerLeave)
        }

    },
    methods: {
        showTooltip() {
            // use native method on element to show popover/tooltip
            this.$refs.tooltip.showPopover()
        },
        hideTooltip() {
            // use native method on element to close popover/tooltip
            this.$refs.tooltip.hidePopover()
        },
        handleTriggerEnter() {
                 // small delay prevents flicker when moving to tooltip
                setTimeout(() => {
                if (!this.tooltipVisibility) {
                    this.showTooltip()
                }
            }, this.delayToShowTooltip)
        },
        handleTriggerLeave() {
            // small delay prevents flicker when moving to tooltip
            setTimeout(() => {
                if (!this.tooltipVisibility) {
                    this.hideTooltip()
                }
            }, this.delayToHideTooltip)
        },
        handleTooltipEnter() {
            this.tooltipVisibility = true  
        },
        handleTooltipLeave() {
            this.tooltipVisibility = false
            this.$refs.tooltip.hidePopover()
        }
    },
    unmounted() {
        document.removeEventListener("scroll", this.hideTooltip)
    }
}
</script>

<style>
/* begin cmd-tooltip ------------------------------------------------------------------------------------------ */
.cmd-tooltip {
    padding: .6rem .7rem .4rem .7rem;
    line-height: 100%;
    font-size: var(--font-size-small);
    position: fixed;
    background: var(--color-scheme-background);
    z-index: 100;
    border: var(--default-border);
    border-color: hsl(220, 2%, 25%);
    border-right-color: hsl(240, 1%, 81%);
    border-bottom-color: hsl(240, 1%, 81%);

    &.error,
    &.warning,
    &.success,
    &.info {
        border-color: var(--status-color);
    }

    &.error {
        --status-color: var(--error-color-text);
    }

    &.warning {
        --status-color: var(--warning-color-text);
    }

    &.success {
        --status-color: var(--success-color-text);
    }

    &.info {
        --status-color: var(--info-color-text);
    }

    .headline-wrapper {
        display: flex;

        >button {
            margin-left: auto !important;

            [class*="icon-"] {
                padding-left: 1rem;
                font-size: var(--font-size-small);
                color: var(--hyperlink-color);

                &:hover,
                &:active,
                &:focus {
                    color: var(--hyperlink-color-highlighted);
                }
            }
        }
    }
}

@-moz-document url-prefix() {
    .cmd-tooltip {
        font-size: 1.3rem;
        border-color: hsl(0, 0%, 46%);
    }
}

/* end cmd-tooltip ------------------------------------------------------------------------------------------ */
</style>