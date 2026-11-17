<template>
    <!-- begin CmdAccordion ---------------------------------------------------------------------------------------- -->
    <details ref="cmdAccordion" 
        :class="['cmd-accordion', highlightLevel, { 'flex-container no-gap' : rowView, 'stretch-to-full-width': openAccordionHasFullWidth }]" 
        :name="generateAccordionName"
    >
        <summary :class="{'writing-mode-vertical' : summaryWritingMode === 'vertical'}">
            <CmdIcon :iconClass="toggleIconIconClassClosed" class="closed" :tooltip="cmdIconClosedRowView.tooltip" />
            <CmdIcon :iconClass="toggleIconIconClassOpen" class="open" :tooltip="cmdIconOpenRowView.tooltip" />
            <CmdHeadline v-bind="cmdHeadlineProperties" :without-wrapper="true" />
        </summary>
        <div class="accordion-body">
            <!-- begin slot-content -->
            <slot>
                <CmdParagraph :content="textAccordionBody" />
            </slot>
            <!-- end slot-content -->
        </div>
    </details>
    <!-- end CmdAccordion ---------------------------------------------------------------------------------------- -->
</template>

<script>
import {createUuid} from "../utils/common.js"

export default {
    name: "CmdAccordion",
    props: {
        /**
         * arranges accordion-content in a row
         *
         * @affectsStyling: true
         */
         rowView: {
            type: Boolean,
            default: false
        },
        /**
         * set direction of text for summary
         * 
         * rowView-property must be true
         * 
         * @allowedValues: "horizontal", "vertical"
         */
         summaryWritingMode: {
            type: String,
            default: "horizontal",
            validator(value) {
                return value === "horizontal" ||
                value === "vertical"
            }
        },
        /**
         * set highlight-level for headline
         * 
         * @allowedValues: null, "primary", "secondary", "tertiary"
         */
        highlightLevel: {
            type: String,
            default: null,
            validator(value) {
                return value === null ||
                    value === "primary" ||
                    value === "secondary" ||
                    value === "tertiary"
            }
        },
        /**
         * (html-)text for accordion-body
         */
        textAccordionBody: {
            type: String,
            required: false
        },
        /**
         * open accordion uses remaining space in accordions-wrapper
         * 
         * rowView must be false 
         */
         openAccordionHasFullWidth: {
            type: Boolean,
            default: true
         },
        /**
         * properties for CmdIcon-component if accordion is collapsed/closed
         */
        cmdIconClosedRowView: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-chevron-one-stripe-down",
                    tooltip: "Expand accordion"
                }
            }
        },
        /**
        * properties for CmdIcon-component if accordion is expanded/open
        */
        cmdIconOpenRowView: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-chevron-one-stripe-left",
                    tooltip: "Collapse accordion"
                }
            }
        },
        /**
        * properties for CmdIcon-component if accordion is collapsed/closed
        */
         cmdIconClosedColumnView: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-chevron-one-stripe-right",
                    tooltip: "Expand accordion"
                }
            }
        },
        /**
        * properties for CmdIcon-component if accordion is expanded/open
        */
        cmdIconOpenColumnView: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-chevron-one-stripe-down",
                    tooltip: "Collapse accordion"
                }
            }
        },
        /**
        * accordion-name is required if multiple-accrdion-boxes should be connect (name must be identical)
        */
        accordionName: {
            type: String,
            required: false
        },
        /**
         * multiple boxes can be expanded if activated
         * 
         * accordionName-property must have different value or kept empty for each accordion-box in wrapper
         */
         allowMultipleExpandedBoxes: {
            type: Boolean,
            default: false
         },
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            requiered: true
        }
    },
    computed: {
        generateAccordionName() {
            return this.allowMultipleExpandedBoxes ? this.accordionName + "-" + createUuid() : this.accordionName
        },
        cmdHeadlineProperties() {
            return {
                headlineLevel: 4,
                ...this.cmdHeadline
            }
        },
        toggleIconIconClassOpen() {
            return this.rowView ? this.cmdIconOpenRowView?.iconClass : this.cmdIconOpenColumnView?.iconClass
        },
        toggleIconIconClassClosed() {
            return this.rowView ? this.cmdIconClosedRowView?.iconClass : this.cmdIconClosedColumnView?.iconClass
        } 
    }
}
</script>

<style>
.cmd-accordion {
    /* begin rowView */
    &.flex-container {
        flex-wrap: nowrap;
        align-items: center;

        > * {
            flex: none;
        }

        &[open] {
            summary {
                border: 0;
            }

            &.stretch-to-full-width {
                flex: 1; /* stretch accordion-body over remaining (horizontal) space in accordion-wrapper */
            }    
        }

        summary.writing-mode-vertical {
            writing-mode: vertical-rl;
            transform: rotate(180deg);
        } 
    }
    /* end rowView */

    summary {
        .cmd-headline {
            margin: 0;
        }
    }
}
</style>