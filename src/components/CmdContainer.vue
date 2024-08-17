<template>
    <div class="cmd-container">
        <!-- begin cmd-headline -->
        <CmdHeadline
            v-if="cmdHeadline"
            :pre-headline-text="cmdHeadline.preHeadlineText"
            :headline-text="cmdHeadline.headlineText"
            :headline-level="cmdHeadline.headlineLevel"
        />
        <!-- end cmd-headline -->

        <!-- begin contentAboveSlot -->
        <div v-if="contentAboveSlot" v-html="contentAboveSlot"></div>
        <!-- end contentAboveSlot -->

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

        <!-- begin contentBelowSlot -->
        <div v-if="contentBelowSlot" v-html="contentBelowSlot"></div>
        <!-- end contentBelowSlot -->
    </div>
</template>

<script>
export default {
    name: "CmdContainer",
    props: {
        /**
         * define (html-)content to display above slot-content
         */
        contentAboveSlot: {
            type: String,
            required: false
        },
        /**
         * define (html-)content to display below slot-content
         */
        contentBelowSlot: {
            type: String,
            required: false
        },
        /**
         * define container-type
         *
         * @allowedValues: "grid", "flex"
         */
        containerType: {
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
    methods: {
        addHandlerProvider() {
            return ""
        },
        oneSlotItem() {
            const vnodes = this.$slots.default();
            if (vnodes.length === 1 && typeof vnodes[0].type === "symbol" && Array.isArray(vnodes[0].children)) {
                return vnodes[0].children.length === 1
            }
            return vnodes.length === 1
        }
    },
    computed: {
        containerClass() {
            let htmlClass = null
            switch (this.containerType) {
                case "grid":
                    htmlClass = "grid-container-create-columns"
                    break
                case "flex":
                    htmlClass = "flex-container vertical"
                    break
                default:
                    htmlClass = null
                    break
            }
            return htmlClass
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
        }
    }
}
</script>

<style>
.cmd-container {
    min-height: 1rem;
}
</style>
