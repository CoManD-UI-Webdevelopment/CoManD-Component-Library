<template>
    <div v-if="tooltipVisibility" :class="['cmd-tooltip', validationStatus]" ref="tooltip">
        <div v-if="cmdHeadline || iconClose.show" class="headline-wrapper">
            <!-- begin CmdHeadline -->
            <CmdHeadline
                v-if="cmdHeadline"
                v-bind="cmdHeadline"
            />
            <!-- end CmdHeadline -->

            <!-- begin icon to close tooltip -->
            <a v-if="iconClose.show && toggleVisibilityByClick" href="#" @click.prevent="hideTooltip"
               :title="iconClose.tooltip">
                <!-- begin CmdIcon -->
                <CmdIcon :iconClass="iconClose.iconClass" :type="iconClose.iconType"/>
                <!-- end CmdIcon -->
            </a>
            <!-- end icon to close tooltip -->
        </div>

        <!-- begin slot-content -->
        <slot>
            {{ tooltipText }}
        </slot>
        <!-- end slot-content -->
    </div>
</template>

<script>
export default {
    name: "CmdTooltip",
    data() {
        return {
            tooltipVisibility: false,
            pointerX: 0,
            pointerY: 0
        }
    },
    inject: {
        injectScrollContainer: {
            default: ""
        }
    },
    props: {
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            default() {
            }
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
         * toggleVisibilityByClick-property must be false
         */
        delayToShowTooltip: {
            type: Number,
            default: 0
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
            default: ".page-wrapper"
        },
        /**
         * icon 'close'
         *
         * @requiredForAccessibility: partial
         */
        iconClose: {
            type: Object,
            default() {
                return {
                    show: true,
                    iconClass: "icon-cancel",
                    tooltip: "Close this tooltip!"
                }
            }
        },
        /**
         * enable toggling tooltip-visibility by click
         */
        toggleVisibilityByClick: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        if (this.relatedId) {
            const relatedElement = document.getElementById(this.relatedId)

            if (relatedElement) {
                const scrollContainerSelector = this.injectScrollContainer || this.scrollContainer

                if (scrollContainerSelector) {
                    const scrollContainerElement = document.querySelector(scrollContainerSelector)

                    if(scrollContainerElement) {
                        scrollContainerElement.addEventListener("scroll", this.hideTooltip) // avoid fixed tooltip on scroll
                    } else {
                        console.warn( "'CmdTooltip-Component': Element accessed by " + scrollContainerSelector + " does not exist! Please provide selector for an existing element!")
                    }

                    document.addEventListener("keyup", this.hideTooltipOnEsc) // close tooltip by using "escape"-key
                }

                if (this.toggleVisibilityByClick) {
                    relatedElement.addEventListener("click", this.toggleTooltipVisibility)
                } else {
                    relatedElement.addEventListener("mouseenter", this.showTooltip)
                    relatedElement.addEventListener("mouseleave", this.hideTooltip)
                }
            }
        }
    },
    methods: {
        toggleTooltipVisibility(event) {
            this.getPointerPosition(event)
            this.tooltipVisibility = !this.tooltipVisibility
        },
        showTooltip(event) {
            // if delay is set
            if (this.delayToShowTooltip > 0) {
                setTimeout(() => {
                    this.toggleVisibility(event)
                }, this.delayToShowTooltip)
            } else {
                this.toggleVisibility(event)
            }
        },
        toggleVisibility(event) {
            if (!this.toggleVisibilityByClick) {
                this.tooltipVisibility = true
            }
            this.getPointerPosition(event)
        },
        hideTooltipOnEsc(event) {
            if (this.allowEscapeKey) {
                if (event.key === 'Escape' || event.key === 'Esc') {
                    this.hideTooltip()
                }
            }
        },
        hideTooltip() {
            this.tooltipVisibility = false
        },
        getPointerPosition(event) {
            this.pointerX = event.clientX
            this.pointerY = event.clientY
        }
    },
    unmounted() {
        if (this.relatedId) {
            const relatedElement = document.getElementById(this.relatedId)

            if (relatedElement) {
                document.removeEventListener("scroll", this.hideTooltip)
                document.removeEventListener("keyup", this.hideTooltipOnEsc)

                if (this.toggleVisibilityByClick) {
                    relatedElement.removeEventListener("click", this.toggleTooltipVisibility)
                } else {
                    relatedElement.removeEventListener("mouseenter", this.showTooltip)
                    relatedElement.removeEventListener("mouseleave", this.showTooltip)
                }
            }
        }
    },
    watch: {
        tooltipVisibility() {
            if (this.tooltipVisibility) {
                this.$nextTick(() => {
                    const verticalOffset = 25
                    // this.$refs.tooltip.addEventListener("keyup", this.hideTooltip)
                    this.$refs.tooltip.style.left = (this.pointerX / 10) + "rem"
                    this.$refs.tooltip.style.top = ((this.pointerY + verticalOffset) / 10) + "rem"
                })
            }
        }
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
    display: flex;
    flex-direction: column;

    &.error, &.warning, &.success, &.info {
        border-color: var(--status-color);
    }

    &.error {
        --status-color: var(--error-color);
    }

    &.warning {
        --status-color: var(--warning-color);
    }

    &.success {
        --status-color: var(--success-color);
    }

    &.info {
        --status-color: var(--info-color);
    }

    .headline-wrapper {
        display: flex;

        > a {
            margin-left: auto !important;

            [class*="icon-"] {
                padding-left: 1rem;
                font-size: var(--font-size-small);
                color: var(--hyperlink-color);

                &:hover, &:active, &:focus {
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