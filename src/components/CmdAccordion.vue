<template>
    <!-- begin CmdAccordion ---------------------------------------------------------------------------------------- -->
    <details ref="cmdAccordion" :class="['cmd-accordion', highlightLevel, { 'flex-container no-gap' : rowView }]" :name="accordionName">
        <summary>
            <!--
            <span :class="[cmdIconClosed.iconClass, 'closed']" :title="cmdIconClosed.tooltip"></span>
            <span :class="[cmdIconOpen.iconClass, 'open']" :title="cmdIconOpen.tooltip"></span>
        -->
            <CmdIcon :iconClass="toggleIconIconClass" :class="toggleIconStatus" :tooltip="toggleIconTooltip" />
            <CmdHeadline v-bind="cmdHeadlineProperties" />
            <!--
            toggleIconStatus: {{ toggleIconStatus }}<br />
            this.$refs.cmdAccordion?.open: {{ $refs.cmdAccordion?.open }}<br />
            isOpen: {{ isOpen() }}
        -->
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
export default {
    name: "CmdAccordion",
    mounted() {
  console.log("this.$refs.cmdAccordion.open:", this.$refs.cmdAccordion?.open)
},
    props: {
        /**
         * arranges box-content in a row
         *
         * @affectsStyling: true
         */
         rowView: {
            type: Boolean,
            default: false
        },
        /**
         * set highlight-level for headline
         * 
         * @allowedValues: "", "primary", "secondary", "tertiary"
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
                    iconClass: "icon-chevron-one-stripe-right",
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
            type: Object,
            required: false
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
        cmdHeadlineProperties() {
            return {
                headlineLevel: 4,
                ...this.cmdHeadline
            }
        },
        toggleIconIconClass() {
            if(this.rowView) {
                return this.isOpen ? this.cmdIconOpenRowView?.iconClass : this.cmdIconClosedRowView?.iconClass
            } else {
                return this.isOpen ? this.cmdIconOpenColumnView?.iconClass : this.cmdIconClosedColumnView?.iconClass
            }
        },
        toggleIconStatus() {
            return this.isOpen ? 'open' : 'closed'
        },
        toggleIconTooltip() {
            if(this.rowView) {
                return this.isOpen ? this.cmdIconOpenRowView?.tooltip : this.cmdIconClosedRowView?.tooltip
            } else {
                return this.isOpen ? this.cmdIconOpenColumnView?.tooltip : this.cmdIconClosedColumnView?.tooltip
            }
        }
    },
    methods: {
        isOpen() {
            return this.$refs.cmdAccordion?.open + "test"
        }
    }
}
</script>

<style>
.cmd-accordion {
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
        }

        summary {
            writing-mode: vertical-rl;
            transform: rotate(180deg);
        }
    }

    summary {
        .cmd-headline {
            margin: 0;
        }
    }
}
</style>