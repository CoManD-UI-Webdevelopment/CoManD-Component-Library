<template>
    <!-- begin CmdBasicForm -->
    <BasicForm v-if="contactFormOnly" v-bind="basicForm" />
    <!-- end CmdBasicForm -->

    <div v-else class="flex-container">
        <!-- begin CmdBasicForm -->
        <BasicForm v-bind="basicForm" />
        <!-- end CmdBasicForm -->

        <!-- begin additional-columns -->
        <div class="flex-container vertical">
            <!-- begin CmdAddressData -->
            <CmdAddressData v-if="cmdAddressData" v-bind="cmdAddressData" />
            <!-- end CmdAddressData -->

            <!-- begin CmdGoogleMaps -->
            <CmdGoogleMaps v-if="cmdGoogleMaps" v-bind="cmdGoogleMaps" />
            <!-- end CmdGoogleMaps -->

            <!-- begin slot-content -->
            <slot name="additional-info"></slot>
            <!-- end slot-content -->
        </div>
        <!-- end additional-columns -->
    </div>
</template>

<script>
export default {
    name: "ContactInformation",
    props: {
        basicForm: {
            type: Object,
            default: null
        },
        cmdAddressData: {
            type: Object,
            default: null
        },
        cmdGoogleMaps: {
            type: Object,
            default: null
        }
    },
    computed: {
        contactFormOnly() {
            return !(this.cmdAddressData || this.cmdGoogleMaps || !this.isSlotEmpty)
        },
        isSlotEmpty() {
            return !this.$scopedSlots['custom-info']
        }
    }
}
</script>

<style>

</style>