<template>
    <div
        :class="['cmd-table-wrapper', {'collapsed': !showTableData, 'full-width': fullWidth, 'has-caption': hasCaption, 'has-overflow': hasOverflow}]">
        <div v-if="collapsible || userCanToggleWidth" class="button-wrapper">
            <!-- begin button to toggle table-width -->
            <a v-if="userCanToggleWidth" class="button"
               href="#" @click.prevent="fullWidth = !fullWidth"
               :title="iconToggleWidth.tooltip"
            >
                <!-- begin CmdIcon -->
                <CmdIcon :iconClass="iconToggleWidth.iconClass" :type="iconToggleWidth.iconType"/>
                <!-- end CmdIcon -->
            </a>
            <!-- end button to toggle table-width -->

            <!-- begin button to collapse table-content -->
            <a v-if="collapsible" class="button"
               href="#" @click.prevent="showTableData = !showTableData"
               :title="showTableData ? iconCollapse.tooltip : iconExpand.tooltip"
            >
                <!-- begin CmdIcon -->
                <CmdIcon :iconClass="showTableData ? iconCollapse.iconClass : iconExpand.iconClass"
                         :type="showTableData ? iconCollapse.iconType : iconExpand.iconType"/>
                <!-- end CmdIcon -->
            </a>
            <!-- end button to collapse table-content -->
        </div>
        <div class="inner-wrapper" ref="innerWrapper" @scroll="updatePosition">
            <!-- begin CmdSlideButton -->
            <CmdSlideButton
                v-if="showSlideButtons"
                @click.prevent="scrollLeft"
                slideButtonType="left"
            />
            <!-- end CmdSlideButton -->

            <!-- begin table -->
            <table ref="table" :class="{'full-width': fullWidth}">
                <slot name="table-caption">
                    <caption v-if="tableData.caption?.text || caption?.text" :class="{ hidden: hideCaption }">
                        {{ caption?.text || tableData.caption?.text }}
                    </caption>
                </slot>
                <slot name="table-head">
                    <thead>
                        <tr>
                            <th v-for="(tablehead, indexHead) in tableData.thead" :key="indexHead" v-html="tablehead"></th>
                        </tr>
                    </thead>
                </slot>
                <transition :name="useTransition ? 'fade' : null">
                    <slot name="table-body">
                        <tbody v-show="showTableData" aria-expanded="true">
                            <tr :class="{'active' : tableData.rowIndexHighlighted === indexRows}"
                                v-for="(tablerows, indexRows) in tableData.tbody" :key="indexRows">
                                <td :class="{'active' : tableData.columnIndexHighlighted === indexData}"
                                    v-for="(tabledata, indexData) in tablerows" :key="indexData" v-html="tabledata">
                                </td>
                            </tr>
                        </tbody>
                    </slot>
                </transition>
                <transition :name="useTransition ? 'fade' : null">
                    <slot name="table-foot">
                        <tfoot v-if="tableData.tfoot && tableData.tfoot.length && showTableData" aria-expanded="true">
                            <tr>
                                <td :class="{'active' : tableData.columnIndexHighlighted === indexFoot}"
                                    v-for="(tablefoot, indexFoot) in tableData.tfoot" :key="indexFoot" v-html="tablefoot">
                                </td>
                            </tr>
                        </tfoot>
                    </slot>
                </transition>
            </table>
            <!-- end table -->

            <!-- begin CmdSlideButton -->
            <CmdSlideButton
                v-if="showSlideButtons"
                @click.prevent="scrollRight"
            />
            <!-- end CmdSlideButton -->
        </div>
    </div>
</template>

<script>
import {ref} from 'vue'

export default {
    name: "CmdTable",
    data() {
        return {
            showTableData: true,
            fullWidth: false,
            hasOverflow: false
        }
    },
    props: {
        /**
         * activate if transition for hiding collapsible table-data should be used
         */
        useTransition: {
            type: Boolean,
            default: true
        },
        /**
         * table data (incl. caption, thead, tbody)
         */
        tableData: {
            type: Object,
            required: true
        },
        /**
         * caption for table (shown above table)
         *
         * @requiredForAccessibility: true
         */
        caption: {
            type: Object,
            required: false
        },
        /**
         * activate if table should be collapsible
         */
        collapsible: {
            type: Boolean,
            default: false
        },
        /**
         * activate if table should be stretched to full width of its parent-container (else table will be as wide as its content)
         */
        fullWidthOnDefault: {
            type: Boolean,
            default: false
        },
        /**
         * user can toggle width (full-width (=100% of parent container or as wide as table content) with button above table)
         */
        userCanToggleWidth: {
            type: Boolean,
            default: true
        },
        /**
         * user can toggle width (full-width (=100% of parent container or as wide as table content) with button above table)
         */
        showSlideButtons: {
            type: Boolean,
            default: true
        },
        /**
         * icon to expand table (vertically)
         *
         * @requiredForAccessibility: partial
         */
        iconExpand: {
            type: Object,
            default: function () {
                return {
                    iconClass: "icon-chevron-one-stripe-down",
                    tooltip: "Expand table"
                }
            }
        },
        /**
         * icon to collapse table (vertically)
         *
         * @requiredForAccessibility: partial
         */
        iconCollapse: {
            type: Object,
            default: function () {
                return {
                    iconClass: "icon-chevron-one-stripe-up",
                    tooltip: "Collapse table"
                }
            }
        },
        /**
         * icon to shrink table (horizontally)
         *
         * @requiredForAccessibility: partial
         */
        iconToggleWidth: {
            type: Object,
            default: function () {
                return {
                    iconClass: "icon-toggle-table-width",
                    tooltip: "Toggle table width"
                }
            }
        },
        /**
         * icon to stretch table (horizontally)
         *
         * @requiredForAccessibility: partial
         */
        iconStretch: {
            type: Object,
            default: function () {
                return {
                    iconClass: "icon-chevron-one-stripe-right",
                    tooltip: "Stretch table"
                }
            }
        }
    },
    mounted() {
        this.hasOverflow = this.$refs.table.clientWidth > this.$refs.innerWrapper.clientWidth
    },
    computed: {
        hasCaption() {
            if (this.hideCaption) {
                return false
            }

            // check is a caption-text is defined
            return this.tableData.caption?.text || this.caption?.text
        },
        hideCaption() {
            return this.caption?.show === false || (this.caption?.show !== true && !this.tableData.caption?.show)
        }
    },
    methods: {
        scrollLeft() {
            this.$refs.innerWrapper.scrollLeft = 0
            this.$refs.table.previousElementSibling.style.cssText = "left: 0;"
            this.updatePosition()
        },
        scrollRight() {
            this.$refs.table.querySelector("th:last-child").scrollIntoView()
            this.$refs.table.nextElementSibling.style.cssText = "right: auto;"
            this.updatePosition()
        },
        updatePosition() {
            const leftSlidebutton = this.$refs.table.previousElementSibling
            const rightSlidebutton = this.$refs.table.nextElementSibling
            const innerWrapper = this.$refs.innerWrapper

            const parentRect = innerWrapper.getBoundingClientRect();
            const newRight = parentRect.width + innerWrapper.scrollLeft - rightSlidebutton.getBoundingClientRect().width
            const newLeft = innerWrapper.scrollLeft

            console.log("parentRect", parentRect)

            leftSlidebutton.style.left = `${newLeft}px`
            rightSlidebutton.style.left = `${newRight}px`;

            if(newLeft === 0) {
                leftSlidebutton.style.display = "none"
            } else {
                leftSlidebutton.style.display = "flex"
            }

            if(newLeft === innerWrapper.scrollLeftMax) {
               rightSlidebutton.style.display = "none"
            } else {
               rightSlidebutton.style.display = "flex"
            }

            //     const parentRect = this.$refs.innerWrapper.getBoundingClientRect();
            //     const rightSlidebutton = this.$refs.table.nextElementSibling.getBoundingClientRect();
            //     const leftSlidebutton = this.$refs.table.previousElementSibling.getBoundingClientRect();
            //
            //     // Calculate the new right position
            //     const newRight = rightSlidebutton.width + parentRect.right;
            //     const newLeft = parentRect.width - parentRect.left;
            // console.log("parentRect.width", parentRect.width)
            //     console.log("parentRect.right", parentRect.right)
            // console.log("parentRect.left", parentRect.left)
            //
            //     // Apply the new right position
            // this.$refs.table.nextElementSibling.style.left = `${newRight}px`;
            // this.$refs.table.previousElementSibling.style.right = `${newLeft}px`;
        }

    },
    watch: {
        fullWidthOnDefault: {
            handler() {
                this.fullWidth = this.fullWidthOnDefault
            },
            immediate: true
        }
    }
}
</script>

<style>
/* begin cmd-table-wrapper ---------------------------------------------------------------------------------------- */
.cmd-table-wrapper {
    display: inline-flex;
    flex-direction: column;
    max-width: 100%;
    margin-bottom: var(--default-margin);
    gap: calc(var(--default-margin) / 2);

    &.collapsed, &.full-width {
        overflow: hidden;

        table {
            th {
                white-space: normal;
            }
        }
    }

    > .button-wrapper {
        right: 0;
        z-index: 100;
        gap: calc(var(--default-gap) / 2);

        .button {
            padding: 0;
            min-width: 2rem;
            min-height: 2rem;

            [class*="icon-"] {
                font-size: var(--icon-size-small);
            }
        }
    }

    .cmd-slide-button {
        top: 50% !important;
        display: none;
        height: auto;
        transform: translateY(-50%);
    }

    .inner-wrapper {
        display: flex;
        overflow-x: auto;
        width: 100%;

        .cmd-slide-button {
            left: 0;

            &:last-child {
                right: 0;
                left: auto;
            }
        }

        table {
            table-layout: fixed;
            margin: 0;

            th {
                a[class*='icon-'] {
                    &, &:hover, &:active, &:focus {
                        font-size: var(--icon-size-small);
                        color: var(--color-white);
                    }
                }
            }
        }
    }

    &.has-caption {
        flex-direction: row;

        .button-wrapper {
            position: absolute;
        }

        table {
            margin-top: calc(var(--default-margin) / 2);
        }
    }

    &.has-overflow {
        .cmd-slide-button {
            display: flex;
        }
    }
}

/* end cmd-table-wrapper ------------------------------------------------------------------------------------------ */
</style>