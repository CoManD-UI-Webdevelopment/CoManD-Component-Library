<template>
    <!-- begin CmdIcon ---------------------------------------------------------------------------------------- -->
    <!-- begin iconify-icon -->
    <Icon v-if="isIconify" :icon="iconClass" :title="tooltip" v-bind="a11yAttributes"></Icon>
    <!-- end iconify-icon -->

    <!-- begin icon from local iconfont -->
    <span v-else :class="iconClass" :title="tooltip" v-bind="a11yAttributes"></span>
    <!-- end icon from local iconfont -->
    <!-- end CmdIcon ---------------------------------------------------------------------------------------- -->
</template>

<script>
// import components
import {Icon} from "@iconify/vue"

export default {
    name: "CmdIcon",
    components: {
        Icon
    },
    props: {
        /**
         * type that defines where the icon is loaded from
         * 'auto' is for letting the component check (by classname) if the icon should be loaded from the local iconfont (class="icon-'iconname'")
         *  or if the icon should be loaded form iconify-api (class='fontprefix':'iconname') (https://iconify.design/)
         * 'iconify' forces the component to load an iconify icon (without api) from a local source (which must be defined)
         *
         * @allowedValues: 'auto', 'iconify'
         */
        type: {
            type: String,
            default: "auto",
            validator(value) {
                return value === "auto" ||
                    value === "iconify"
            }
        },
        /**
         * icon-class for icon from local iconfont
         *
         * type-property must be set to auto and classname must include icon-'iconname'
         */
        iconClass: {
            type: String,
            required: true
        },
        /**
         * tooltip text for icon
         *
         * @requiredForAccessibility: true
         */
        tooltip: {
            type: String,
            required: false
        }
    },
    computed: {
        /**
         * icons with tooltip are images with an accessible name, icons without tooltip are decorative (hidden for screen readers)
         */
        a11yAttributes() {
            return this.tooltip ? {role: "img", "aria-label": this.tooltip} : {"aria-hidden": "true"}
        },
        isIconify() {
            if (this.type === "iconify") {
                return true
            }
            if (this.type === "auto") {
                return this.iconClass.includes(":")
            }
            return false
        }
    }
}
</script>

<style>
.iconify {
    font-size: var(--default-icon-size);
    vertical-align: text-bottom;

    & + span, span + &  {
        margin-left: calc(var(--default-margin) / 2);
    }
}
</style>