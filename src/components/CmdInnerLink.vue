<template>
    <span v-if="icon.iconClass && icon.position === 'left' || icon.position === 'top'" :class="icon.iconClass" :title="icon.tooltip"></span>
    <span v-if="text">{{ text }}</span>
    <span v-if="icon.iconClass && icon.position === 'right' || icon.position === 'bottom'" :class="icon.iconClass" :title="icon.tooltip"></span>
    <!-- begin default-slot -->
    <slot></slot>
    <!-- end default-slot -->
</template>

<script>
export default {
    name: "CmdInnerLink",
    props: {
        /**
         * icon to display
         */
        icon: {
            type: Object,
            default: {}
        },
        /**
         * displayed text
         */
        text: {
            type: String,
            default: ""
        }
    }
}
</script>

<style>

</style>