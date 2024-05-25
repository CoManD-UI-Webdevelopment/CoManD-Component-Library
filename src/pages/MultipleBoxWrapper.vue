<template>
    <div class="cmd-page-multiple-box-wrapper flex-container vertical">
        <template v-for="(segment, index) in segments" :key="index">
            <!-- begin CmdBoxWrapper -->
            <CmdBoxWrapper
                :boxesPerRow="segment.boxesPerRow"
                :useRowViewAsDefault="segment.useRowViewAsDefault"
                :useGap="segment.useGap"
                :cmdHeadline="segment.cmdHeadline"
            >
                <template v-slot="slotProps">
                    <!-- begin CmdBox -->
                    <CmdBox
                        :use-slots="['box-body']"
                        v-for="(box, index) in segment.boxes"
                        :key="index"
                        v-bind="box"
                        :rowView="slotProps.rowView"
                    >
                        box {{box}}
                    </CmdBox>
                    <!-- end CmdBox -->
                </template>
            </CmdBoxWrapper>
            <!-- end CmdBoxWrapper -->

            <!-- begin slot-content -->
            <slot name="multiple-box-wrapper-slot-${index}"></slot>
            <!-- end slot-content -->
        </template>
    </div>
</template>

<script>
export default {
    name: "MultipleBoxWrapper",
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