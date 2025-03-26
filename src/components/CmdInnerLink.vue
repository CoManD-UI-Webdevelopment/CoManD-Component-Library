<template>
    <img v-if="image?.src && (image?.position === 'left' || image?.position === 'top' || !image?.position)" :src="image?.src" :alt="image?.alt" />
    <span v-if="icon?.iconClass && (icon?.position === 'left' || icon?.position === 'top' || !icon?.position)" :class="icon?.iconClass" :title="icon?.tooltip"></span>
    <span v-if="text">{{ text }}</span>
    <span v-if="icon?.iconClass && (icon?.position === 'right' || icon?.position === 'bottom')" :class="icon?.iconClass" :title="icon?.tooltip"></span>
    <img v-if="image?.src && (image?.position === 'right' || image?.position === 'bottom')" :src="img?.src" :alt="image?.alt" />
    <!-- begin default-slot -->
    <slot></slot>
    <!-- end default-slot -->
</template>

<script>
export default {
    name: "CmdInnerLink",
    props: {
        /**
         * displayed icon
         */
        icon: {
            type: Object,
            required: false
        },
        /**
         * displayed text
         */
        text: {
            type: String,
            required: false
        },
        /**
         * displayed image
         */
        image: {
            type: Object,
            required: false
        }
    }
}
</script>

<style>

</style>