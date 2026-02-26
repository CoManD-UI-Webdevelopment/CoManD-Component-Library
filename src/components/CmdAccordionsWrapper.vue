<template>
    <!-- begin CmdBoxWrapper ---------------------------------------------------------------------------------------- -->
    <div class="cmd-accordions-wrapper">
        <div v-if="cmdHeadline.headlineText || allowUserToToggleOrientation" class="flex-container headline-wrapper">
            <!-- begin CmdHeadline -->
            <CmdHeadline v-if="cmdHeadline.headlineText" v-bind="cmdHeadline" />
            <!-- end CmdHeadline -->

            <div v-if="allowUserToToggleOrientation" class="options-wrapper">
                <a href="#" @click.prevent="toggleOrientation" :title="rowView ? iconRowView.tooltip : iconColumnView.tooltip">
                    <!-- begin CmdIcon -->
                    <CmdIcon :iconClass="rowView ? iconColumnView.iconClass : iconRowView.iconClass" :type="rowView ? iconColumnView.iconType : iconRowView.iconType" />
                    <!-- end CmdIcon -->
                </a>
            </div>
        </div>
        <div :class="['inner-accordions-wrapper',
            {
                'no-gap': !useGap,
                'flex-container' : rowView 
            }
            ]">
            <slot
                :collapsingBoxesOpen="collapsingBoxesOpen"
                :boxToggled="boxToggled"
                :boxIsOpen="boxIsOpen"
                :rowView="rowView"
                @toggleCollapse="boxIsToggled"
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
                    iconClass: 'icon-blocks-small',
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
            this.oneBoxPerRow = this.rowView
        },
        boxIsOpen(index) {
            return this.currentOpenBox.includes(index)
        },
        toggleCollapsingBoxes() {
            this.collapsingBoxesOpen = !this.collapsingBoxesOpen
        },
        boxToggled(boxIndex, open) {
            if(this.allowMultipleExpandedBoxes) {
                if(open) {
                    this.currentOpenBox.push(boxIndex)
                } else {
                    // remove boxIndex from array to close specific box
                    let position = this.currentOpenBox.indexOf(boxIndex)
                    this.currentOpenBox.splice(position, 1)
                }
            } else {
                this.currentOpenBox  = []

                // add current boxIndex to array to open specific box
                if(open) {
                    this.currentOpenBox.push(boxIndex)
                }
            }
        }
    },
    watch: {
        openBoxesByDefault: {
            handler() {
                this.currentOpenBox = [...this.openBoxesByDefault || []]
            },
            immediate: true
        },
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
/* begin cmd-box-wrapper ---------------------------------------------------------------------------------------- */
.cmd-accordions-wrapper {
    .inner-accordions-wrapper {
        .cmd-accordion {
            flex: none;
        }
    }
}
</style>

<style>
/* end cmd-box-wrapper ---------------------------------------------------------------------------------------- */
</style>