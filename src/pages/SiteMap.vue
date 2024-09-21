<template>
    <ul>
        <li v-for="(page, index) in pages" :key="index">
            <!-- begin recursive call for children -->
            <SiteMap v-if="page.children" />
            <!-- end recursive call for children -->

            <!-- begin entries without children -->
            <template v-else>
                <!-- begin CmdLink -->
                <CmdLink v-bind="page" />
                <!-- end CmdLink -->
            </template>
            <!-- end entries without children -->
        </li>
    </ul>
</template>

<script>
export default {
    name: "SiteMap",
    props: {
        /**
         * pages to list in site-map as links
         */
        pages: {
            type: Array,
            required: true
        }
    }
}
</script>

<style>

</style>