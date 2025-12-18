<template>
    <!-- begin CmdContainer ---------------------------------------------------------------------------------------- -->
    <div class="cmd-container">
        <!-- begin CmdHeadline -->
        <CmdHeadline v-if="cmdHeadline" v-bind="cmdHeadline" />
        <!-- end CmdHeadline -->

        <div :class="htmlClasses">
            <!-- begin slot-content -->
            <slot></slot>
            <!-- end slot-content -->
        </div>
    </div>
    <!-- end CmdContainer ---------------------------------------------------------------------------------------- -->
</template>

<script>
export default {
    name: "CmdContainer",
    props: {
        /** define container-type
         *
         * @affectsStyling: true
         * @allowedValues: "", "default", "flex", "grid"
         */
        containerType: {
            type: String,
            default: "default",
            validator(value) {
                return value === "" ||
                    value === "default" ||
                    value === "flex" ||
                    value === "grid"
            }
        },
        /**
         * define content-orientation
         *
         * containerType-property must be set to "flex"
         *
         * @affectsStyling: true
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
         * activate if no gap between items should be used
         *
         * @affectsStyling: true
         */
        noGap: {
            type: Boolean,
            default: true
        },
        /**
        * activate if container itself should not be handled as a flex-item by its parent
        *
        * @affectsStyling: true
        */
        flexNone: {
            type: Boolean,
            default: false
        },
        /**
         * activate if items should not behave like flex-items (they are now shrunk to their content)
         *
         * @affectsStyling: true
         */
        flexItemsFlexNone: {
            type: Boolean,
            default: false
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
        htmlClasses() {
            const htmlClasses = []

            if (this.containerType !== 'default') {
                if (this.containerType === "flex") {
                    htmlClasses.push("flex-container")

                    if (this.contentOrientation) {
                        htmlClasses.push(this.contentOrientation === "vertical" ? "flex-direction-column" : null)
                    }
                    if (this.useGap) {
                        htmlClasses.push("no-gap")
                    }
                    if (this.flexNone) {
                        htmlClasses.push("flex-none")
                    }
                    if (this.flexItemsFlexNone) {
                        htmlClasses.push("flex-items-flex-none")
                    }
                    if (this.alignItems) {
                        htmlClasses.push("align-items-" + this.alignItems)
                    }
                }

                if (this.containerType === "grid") {
                    htmlClasses.push("grid-container-create-columns")
                }
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
.cmd-container {
    min-height: 1rem;
}
</style>