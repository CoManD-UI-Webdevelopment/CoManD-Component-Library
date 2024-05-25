<template>
    <header class="cmd-page-header flex-container">
        <div v-if="cmdBreadcrumbs || cmdHeadline" class="headline-wrapper flex-container vertical">
            <!-- begin CmdBreadcrumbs -->
            <CmdBreadcrumbs v-if="cmdBreadcrumbs" v-bind="cmdBreadcrumbs" />
            <!-- end CmdBreadcrumbs -->

            <!-- begin CmdHeadline -->
            <CmdHeadline v-if="cmdHeadline" v-bind="cmdHeadline" />
            <!-- end CmdHeadline -->
        </div>

        <!-- begin slot -->
        <slot></slot>
        <!-- end slot -->
    </header>
</template>

<script>
export default {
    name: "CmdPageHeader",
    props: {
        /**
         * properties for CmdBreadcrumb-component
         */
        cmdBreadcrumbs: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        }
    }
}
</script>

<style>
/* begin cmd-page-header -------------------------------------------------------------------------------------------- */
.cmd-page-header {
    justify-content: space-between;

    .headline-wrapper {
        gap: calc(var(--default-gap) / 4);

        & + * {
            flex: none;
        }
    }
}
/* end cmd-page-header -------------------------------------------------------------------------------------------- */
</style>