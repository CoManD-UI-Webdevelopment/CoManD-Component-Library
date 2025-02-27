<template>
    <div :class="['cmd-flexible-scroll-container flexible-scroll-container', {'reverse-order': fixedContainerAtBottom}]">
        <div class="fixed-wrapper">
            <!-- begin slot for fixed-wrapper -->
            <slot name="fixed-wrapper"></slot>
            <!-- end slot for fixed-wrapper -->
        </div>
        <div class="scroll-wrapper">
            <!-- begin slot for scroll-wrapper -->
            <slot name="scroll-wrapper"></slot>
            <!-- end slot for scroll-wrapper -->
        </div>
    </div>
</template>

<script>
export default {
    name: "CmdFlexibleScrollContainer",
    /**
     * put fixed container to bottom
     *
     * @affectLayout: true
     */
    props: {
        fixedContainerAtBottom: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style>
/* begin cmd-flexible-scroll-container  ------------------------------------------------------------------------------------------ */
.cmd-flexible-scroll-container {
    &.reverse-order {
        flex-direction: column-reverse;
    }
}
/* end cmd-flexible-scroll-container  ------------------------------------------------------------------------------------------ */
</style>