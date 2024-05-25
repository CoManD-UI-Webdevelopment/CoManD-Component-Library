<template>
    <div class="cmd-page-multiple-lists-of-links flex-container vertical">
        <template v-for="(segment, index) in segments" :key="index">
            <!-- begin CmdListOfLinks -->
            <CmdListOfLinks
                :links="segment.links"
                :orientation="segment.orientation"
                :largeIcons="segment.largeIcons"
                :cmdHeadline="segment.headline"
            />
            <!-- end CmdListOfLinks -->

            <!-- begin slot-content -->
            <slot name="multiple-lists-of-links-slot-${index}"></slot>
            <!-- end slot-content -->
        </template>
    </div>
</template>

<script>
export default {
    name: "MultipleListsOfLinks",
    props: {
        segments: {
            type: Array,
            default: null
        }
    }
}
</script>

<style>

</style>