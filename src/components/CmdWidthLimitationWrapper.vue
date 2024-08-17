<template>
    <div class="cmd-width-limitation-wrapper" :class="{'sticky': sticky}" ref="width-limitation-wrapper">
        <!-- begin slot-content in section -->
        <section v-if="useInnerSection" :class="setSectionClass" :id="anchorId">
            <!-- begin cmd-headline -->
            <CmdHeadline
                v-if="cmdHeadline"
                :pre-headline-text="cmdHeadline.preHeadlineText"
                :headline-text="cmdHeadline.headlineText"
                :headline-level="cmdHeadline.headlineLevel"
            />
            <!-- end cmd-headline -->

            <!-- begin slot-content (one column/slot-item only) -->
            <slot v-if="oneSlotItem()"></slot>
            <!-- end slot-content (one column/slot-item only) -->

            <!-- begin grid-/flex-container to wrap multiple columns/items -->
            <div v-else :class="setInnerClass">
                <!-- begin slot-content (multiple columns only) -->
                <slot></slot>
                <!-- end slot-content (multiple columns only) -->
            </div>
            <!-- end grid-/flex-container to wrap multiple columns/items -->
        </section>
        <!-- end slot-content in section -->

        <!-- begin slot-content without section -->
        <template v-else>
            <!-- begin slot-content -->
            <a v-if="anchorId" :id="anchorId"></a>
            <slot></slot>
            <!-- end slot-content -->
        </template>
        <!-- end slot-content without section -->
    </div>
</template>

<script>
export default {
    name: "CmdWidthLimitationWrapper",
    props: {
        /**
         * define container-type
         *
         * @allowedValues: "grid", "flex"
         */
        containerType: {
            type: String,
            default: "flex"
        },
        /**
         * set a html-tag as inner tag
         *
         * @allowedValues: section, div
         */
        innerComponent: {
            type: String,
            default: "section",
            validator(value) {
                return value
            }
        },
        /**
         * activate if the inner content should be wrapped in inner component tag (recommended)
         *
         * (if deactivated, content will be directly placed inside cmd-width-limitation-wrapper)
         *
         */
        useInnerSection: {
            type: Boolean,
            default: true
        },
        /**
         * activate if wrapper (and its content) should be sticky (=position remains the same if content below is scrolled)
         *
         * i.e. use for site-header
         *
         * keep attention that more than one sticky-element on same html-level can cause problems, if content below is scrolled
         */
        sticky: {
            type: Boolean,
            default: false
        },
        /**
         * set class to inner component
         *
         * innerWrapper-property must be true
         */
        sectionClass: {
            type: String,
            required: false
        },
        /**
         * set id for (invisible) anchor to enable shortcuts
         */
        anchorId: {
            type: String,
            required: false
        },
        /**
         * define content-orientation
         *
         * @allowedValues: "vertical", "horizontal"
         */
        contentOrientation: {
            type: String,
            default: "vertical",
            validator(value) {
                return value === "horizontal" ||
                    value === "vertical"
            }
        },
        /**
         * properties for CmdHeadline-component
         *
         * @requiredForAccessibilty
         */
        cmdHeadline: {
            type: Object,
            required: false
        }
    },
    computed: {
        setSectionClass() {
            if (this.sectionClass) {
                return this.sectionClass
            }
            if (this.innerComponent === "header") {
                return "grid-container-create-columns"
            }
            if (this.innerComponent === "footer") {
                return "flex-container"
            }
            return ""
        },
        setInnerClass() {
            if(this.containerType === "grid") {
                return "grid-container-create-columns"
            }

            if(this.containerType === "flex") {
                if(this.contentOrientation === "horizontal") {
                    return "flex-container"
                } else if(this.contentOrientation === "vertical") {
                    return "flex-container vertical"
                }
            }
            return ""
        },
        setOuterId() {
            if (this.innerComponent === "header") {
                return "site-header"
            }
            if (this.innerComponent === "footer") {
                return "site-footer"
            }
            return ""
        }
    },
    methods: {
        oneSlotItem() {
            const vnodes = this.$slots.default();
            if (vnodes.length === 1 && typeof vnodes[0].type === "symbol" && Array.isArray(vnodes[0].children)) {
                return vnodes[0].children.length === 1
            }
            return vnodes.length === 1
        }
    }
}
</script>

<style>
/* begin cmd-width-limitation-wrapper ---------------------------------------------------------------------------------------- */
.cmd-width-limitation-wrapper {
    > * {
        max-width: var(--max-width);
        margin: 0 auto;
        padding: var(--default-padding);
    }

    &.sticky {
        position: sticky;
        left: 0;
        right: 0;
        top: 0;
    }
}
/* end cmd-width-limitation-wrapper ------------------------------------------------------------------------------------------ */
</style>