<template>
    <!-- begin basic-form ------------------------------------------------------------------------------------------------------------------------------------------------------->
    <CmdWidthLimitationWrapper>
        <h2 class="headline-demopage" id="section-basic-form">
            <span>Basic Form</span>
        </h2>
        <BasicForm :formAction="basicForm.formAction" />
    </CmdWidthLimitationWrapper>
    <!-- end basic-form ------------------------------------------------------------------------------------------------------------------------------------------------------->

    <!-- begin segmented-lists-of-links ------------------------------------------------------------------------------------------------------------------------------------------------------->
    <CmdWidthLimitationWrapper>
        <h2 class="headline-demopage" id="section-segmented-lists-of-links-downloads">
            <span>Segmented Lists of links</span>
        </h2>
        <h3>Downloads</h3>
        <SegmentedListsOfLinks :segments="listOfDownloadsData" />
        <hr />
        <h3>SiteMap</h3>
        <SegmentedListsOfLinks :segments="listOfSiteLinksData" />
    </CmdWidthLimitationWrapper>
    <!-- end segmented-lists-of-links ------------------------------------------------------------------------------------------------------------------------------------------------------->
</template>

<script>
// import page-templates
import BasicForm from "@/pages/BasicForm.vue"
import SegmentedListsOfLinks from "@/pages/SegmentedListsOfLinks.vue"

// import example data
import listOfDownloadsData from "@/assets/data/pages/list-of-downloads.json"
import listOfSiteLinksData from "@/assets/data/pages/list-of-site-links.json"
export default {
    name: "PageOverview",
    components: {
        BasicForm,
        SegmentedListsOfLinks
    },
    data() {
        return {
            listOfDownloadsData,
            listOfSiteLinksData,
            basicForm: {
                formAction: "POST"
            }
        }
    }
}
</script>

<style>

</style>