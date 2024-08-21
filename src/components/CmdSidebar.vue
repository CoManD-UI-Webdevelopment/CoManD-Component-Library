<template>
    <aside :class="['cmd-sidebar', wrapperClass, {'box': styledAsBox, 'collapse-to-right': !collapseToLeft}]">
        <!-- begin inner-sidebar-wrapper -->
        <div class="inner-sidebar-wrapper">
            <!-- begin CmdHeadline -->
            <CmdHeadline
                v-if="cmdHeadline?.headlineText && open"
                v-bind="cmdHeadline"
                :headlineLevel="cmdHeadline.headlineLevel || 3"
                class="sidebar-main-headline"
            />
            <!-- end CmdHeadline -->

            <!-- begin slot-content for open sidebar -->
            <div v-if="open" class="open-slot-wrapper">
                <slot name="open" :openBoxStatus="open"></slot>
            </div>
            <!-- end slot-content for open sidebar -->

            <!-- begin slot-content for closed sidebar -->
            <div v-else class="closed-slot-wrapper">
                <slot name="closed" :openBoxStatus="open"></slot>
            </div>
            <!-- end slot-content for closed sidebar -->
        </div>
        <!-- end inner-sidebar-wrapper -->

        <!-- begin column to toggle sidebar open-closed-status -->
        <a v-if="collapsible"
           href="#"
           :title="open ? 'Collapse sidebar' : 'Expand sidebar'"
           @click.prevent="toggleSidebar">
            <span :class="iconClassOpenCollapse"></span>
        </a>
        <!-- end column to toggle sidebar open-closed-status -->
    </aside>
</template>

<script>
export default {
    name: "CmdSidebar",
    data() {
        return {
            open: true
        }
    },
    props: {
        /**
         * set if sidebar should be collapsible by the user
         */
        collapsible: {
            type: Boolean,
            default: true
        },
        /**
         * set open/closed status from outside or as default
         */
        openSidebar: {
            type: Boolean,
            default: true
        },
        /**
         * set if the sidebar should be styled as box (border, background, no padding in this case)
         */
        styledAsBox: {
            type: Boolean,
            default: true
        },
        /**
         * set if the sidebar should collapse to the left (otherwise it will collapse to the right)
         *
         * collapsible-property must be set to true
         */
        collapseToLeft: {
            type: Boolean,
            default: true
        },
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        }
    },
    computed: {
        wrapperClass() {
            if (this.open) {
                return 'open'
            }
            return 'closed'
        },
        iconClassOpenCollapse() {
            if (this.collapseToLeft) {
                if (this.open) {
                    return "icon-chevron-one-stripe-left"
                }
                return "icon-chevron-one-stripe-right"
            } else {
                if (this.open) {
                    return "icon-chevron-one-stripe-right"
                }
                return "icon-chevron-one-stripe-left"
            }
        }
    },
    methods: {
        toggleSidebar() {
            this.open = !this.open
            this.$emit("toggleSidebar", this.open)
        }
    },
    watch: {
        openSidebar: {
            handler() {
                this.open = this.openSidebar
            },
            immediate: true
        }
    }
}
</script>

<style>
/* begin cmd-sidebar ---------------------------------------------------------------------------------------- */
.cmd-sidebar {
    display: flex;
    height: 100%;

    &.box {
        padding: 0;

        border-left: 0;
    }

    .cmd-box-wrapper > .grid-container-create-columns {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }

    .cmd-box {
        border-left: 0;
        border-right: 0;
    }

    .inner-sidebar-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;

        .cmd-headline.sidebar-main-headline {
            padding: var(--default-padding);
            margin: 0;
        }
    }

    .open-slot-wrapper {
        flex: 1;
    }

    & > a {
        display: flex;
        flex: none;
        text-decoration: none;
        padding: calc(var(--default-padding) / 2);
        align-items: center;
        border-left: var(--default-border);
    }

    &.collapse-to-right {
        flex-direction: row-reverse;
        border-right: 0;

        > a {
            border-right: var(--default-border);
        }
    }
}
/* end cmd-sidebar ---------------------------------------------------------------------------------------- */
</style>