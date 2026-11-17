<template>
    <!-- begin CmdBoxWrapper ---------------------------------------------------------------------------------------- -->
    <div class="cmd-accordions-wrapper">
        <div v-if="cmdHeadline.headlineText || allowUserToToggleOrientation" class="flex-container headline-wrapper">
            <CmdHeadline v-if="cmdHeadline.headlineText" v-bind="cmdHeadline" />

            <!-- begin toggle orientation TODO: replace by CmdLink -->
            <div v-if="allowUserToToggleOrientation" class="options-wrapper">
                <a href="#" @click.prevent="toggleOrientation" class="toggle-orientation" :title="rowView ? iconRowView.tooltip : iconColumnView.tooltip">
                    <CmdIcon :iconClass="rowView ? iconColumnView.iconClass : iconRowView.iconClass" :type="rowView ? iconColumnView.iconType : iconRowView.iconType" />
                </a>
            </div>
            <!-- begin end orientation -->
        </div>
        <div :class="['inner-accordions-wrapper flex-container',
            {
                'no-gap': !useGap,
                'flex-direction-column' : !rowView 
            }
            ]">
            <slot
                :collapsingBoxesOpen="collapsingBoxesOpen"
                :rowView="rowView"
                :openAccordionHasFullWidth="fullWidth"
                :summaryWritingMode="summaryWritingMode"
                :allowMultipleExpandedBoxes="allowMultipleExpandedBoxes"
            >
            </slot>
        </div>
    </div>
    <!-- end CmdBoxWrapper ---------------------------------------------------------------------------------------- -->
</template>

<script>
export default {
    name: "CmdAccordionsWrapper",
    data() {
        return {
            rowView: this.useRowViewAsDefault,
            collapsingBoxesOpen: true,
            currentOpenBox: [],
            oneBoxPerRow: false
        }
    },
    props: {
        /**
         * give list of box-indices that should be open by default
         *
         * allowMultipleExpandedBoxes-property must be activated if more than one box should be open by default
         */
        openBoxesByDefault: {
            type: Array,
            required: false
        },
        /**
         * activate if a gap between boxes should be used
         */
        useGap: {
            type: Boolean,
            default: true
        },
        /**
         * activate if boxes should be arranged vertically (each box is a row) by default
         */
        useRowViewAsDefault: {
            type: Boolean,
            default: false
        },
        /**
         * open accordion uses remaining space in accordions-wrapper
         * 
         * rowView must be false 
         */
        fullWidth: {
            type: Boolean,
            default: true
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
         * activate if user can toggle grid- and row-orientation by himself
         */
        allowUserToToggleOrientation: {
            type: Boolean,
            default: true
        },
        /**
         * icon for collapsed box
         */
        collapseBoxesIcon: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-chevron-two-stripes-down",
                    tooltip: "Collapse all boxes"
                }
            }
        },
        /**
         * icon for expanded box
         */
        expandBoxesIcon: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-chevron-two-stripes-up",
                    tooltip: "Expand all boxes"
                }
            }
        },
        /**
         * set if more than one collapsible box can be expanded at a time
         */
        allowMultipleExpandedBoxes: {
            type: Boolean,
            default: true
        },
        /**
         * define icon for grid-view
         */
         iconColumnView: {
            type: Object,
            default
                () {
                return {
                    iconClass: 'icon-columns',
                    tooltip: 'Toggle to row view'
                }
            }
        }
        ,
        /**
         * define icon for row-view
         */
        iconRowView: {
            type: Object,
            default() {
                return {
                    iconClass: 'icon-rows',
                    tooltip: 'Toggle to column view'
                }
            }
        },
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            default() {
                return {
                    headlineText: "",
                    headlineLevel: 4
                }
            }
        }
    },
    methods: {
        toggleOrientation() {
            this.rowView = !this.rowView
        }
    },
    watch: {
        useRowViewAsDefault: {
            handler() {
                this.oneBoxPerRow = this.useRowViewAsDefault
            },
            immediate: true
        }
    }
}
</script>

<style>
/* begin cmd-accordions-wrapper ---------------------------------------------------------------------------------------- */
.cmd-accordions-wrapper {
    .headline-wrapper {
        align-items: center;

        .options-wrapper {
            flex: none;

        }
    }

    .inner-accordions-wrapper {
        .cmd-accordion {
            flex: none;
        }
    }
}
</style>

<style lang="scss">
@import '../assets/styles/variables';

@media only screen and (max-width: $medium-max-width) {
    .cmd-accordions-wrapper {
        .toggle-orientation {
            display: none; /* hide button, because accordions are displayed vertically only at this screen-resolution */
        }

        .inner-accordions-wrapper {
            flex-direction: column; /* force accordions to be displayed vertically */
        }
    }
}
/* end cmd-accordions-wrapper ---------------------------------------------------------------------------------------- */
</style>

