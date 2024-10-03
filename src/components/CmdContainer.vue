<template>
    <div class="cmd-container">
        <!-- begin cmd-headline -->
        <CmdHeadline
            v-if="cmdHeadline"
            v-bind="cmdHeadline"
        />
        <!-- end cmd-headline -->

        <!-- begin contentAboveSlot -->
        <div v-if="contentAboveSlot" v-html="contentAboveSlot"></div>
        <!-- end contentAboveSlot -->

        <!-- begin slot-content (one column/slot-item only) -->
        <slot v-if="oneSlotItem()"></slot>
        <!-- end slot-content (one column/slot-item only) -->

        <!-- begin grid-/flex-container to wrap multiple columns/items -->
        <div v-else :class="[setInnerClass, 'inner-slot-wrapper']">
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
         *
         * @canContainHtml: true
         */
        contentAboveSlot: {
            type: String,
            required: false
        },
        /**
         * define (html-)content to display below slot-content
         *
         * @canContainHtml: true
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
         * containerType-property must be set to "flex"
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
         * define a class to set on inner div
         */
        innerClass: {
            type: String,
            required: false
        },
        /**
         * properties for CmdHeadline-component
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
            if (typeof this.$slots.default !== "function") {
                return false
            }

            const vnodes = this.$slots.default()

            if (vnodes.length === 1 && typeof vnodes[0].type === "symbol" && Array.isArray(vnodes[0].children)) {
                return vnodes[0].children.length === 1
            }
            if (vnodes.length === 1 && typeof vnodes[0].type === "object" && vnodes[0].type.name === "RenderComponents" && typeof vnodes[0].props === "object" && Array.isArray(vnodes[0].props.components)) {
                return vnodes[0].props.components.length === 1
            }
            return vnodes.length === 1
        }
    },
    computed: {
        setInnerClass() {
            let htmlClass = this.innerClass || ""
            switch (this.containerType) {
                case "grid":
                    htmlClass += " grid-container-create-columns"
                    break
                case "flex":
                    if (this.contentOrientation === "horizontal") {
                        htmlClass += " flex-container"
                    } else if (this.contentOrientation === "vertical") {
                        htmlClass += " flex-container vertical"
                    }
                    break
                default: /* do nothing */
            }
            return htmlClass
        }
    }
}
</script>

<style>
.cmd-container {
    min-height: 1rem;
}
</style>
