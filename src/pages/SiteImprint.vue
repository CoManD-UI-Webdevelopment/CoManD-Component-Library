<template>
    <!-- begin CmdHeadline -->
    <CmdHeadline v-if="cmdHeadline" v-bind="cmdHeadline"/>
    <!-- end CmdHeadline -->

    <!-- begin slot #aboveAddressData -->
    <slot name="aboveAddressData"></slot>
    <!-- end slot #aboveAddressData -->

    <!-- begin CmdAddressData -->
    <CmdAddressData v-if="cmdAddressData" v-bind="cmdAddressData"/>
    <!-- end CmdAddressData -->

    <!-- begin slot #belowAddressData -->
    <slot name="belowAddressData"></slot>
    <!-- end slot #belowAddressData -->
</template>

<script>
export default {
    name: "SiteImprint",
    props: {
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            default: {
                headlineText: "Imprint",
                headlineLevel: 1
            }
        },
        /**
         * properties for CmdAddressData-component
         */
        cmdAddressData: {
            type: Object,
            required: false
        }
    }
}
</script>

<style>

</style>