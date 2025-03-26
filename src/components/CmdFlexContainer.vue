<template>
    <div :class="['cmd-flex-container', 'flex-container', htmlClasses]">
        <!-- begin slot-content -->
        <slot></slot>
        <!-- end slot-content -->
    </div>
</template>

<script>
export default {
    name: "CmdFlexContainer",
    props: {
        /**
         * activate if content should be aligned vertically
         *
         * @affectsStyling: true
         */
        alignContentVertical: {
            type: String,
            required: false
        },
        /**
         * activate if no gap between items should be used
         *
         * @affectsStyling: true
         */
        noGap: {
            type: Boolean,
            default: true
        },
        /**
         * activate if items should not behave like flex-items (they are now shrunk to their content)
         *
         * @affectsStyling: true
         */
        noFlex: {
            type: Boolean,
            default: true
        },
        /**
         * define how the items will be aligned vertically
         *
         * attention: if alignContentVertical is activated, this property defines the horizontal alignment
         *
         * @allowedValues: top, flex-start, center, flex-end, bottom
         * @affectsStyling: true
         */
        alignItems: {
            type: String,
            required: false,
            validator(value) {
                return value === "top" ||
                    value === "flex-start" ||
                    value === "center" ||
                    value === "flex-end" ||
                    value === "bottom"
            }
        },
        /**
         * define how the items will be aligned/justified horizontally.
         *
         * attention: if alignContentVertical is activated, this property defines the vertical alignment/justification
         *
         * @allowedValues: top, flex-start, center, flex-end, bottom, space-between, space-around
         * @affectsStyling: true
         */
        justifyContent: {
            type: String,
            required: false,
            validator(value) {
                return value === "top" ||
                    value === "flex-start" ||
                    value === "center" ||
                    value === "flex-end" ||
                    value === "bottom" ||
                    value === "space-between" ||
                    value === "space-around"
            }
        }
    },
    computed: {
        htmlClasses() {
            const htmlClasses = []

            if (this.alignContentVertical) {
                htmlClasses.push("vertical")
            }
            if (this.useGap) {
                htmlClasses.push("no-gap")
            }
            if (this.noFlex) {
                htmlClasses.push("no-flex")
            }
            if (this.alignItems) {
                htmlClasses.push("align-items-" + this.alignItems)
            }
            if (this.justifyContent) {
                htmlClasses.push("justify-content-" + this.justifyContent)
            }

            return htmlClasses.join(" ")
        }
    }
}
</script>

<style>

</style>