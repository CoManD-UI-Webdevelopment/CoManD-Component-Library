<template>

    <!-- begin basic-form ------------------------------------------------------------------------------------------------------------------------------------------------------->
    <CmdWidthLimitationWrapper>
        <h2 class="headline-demopage" id="section-contact-information">
            <span>Contact Information</span>
        </h2>
        <ContactInformation
            :cmdBasicForm="basicForm"
            :cmdAddressData="{}"
            :cmdGoogleMaps="{}">
            <template v-slot:additional-info>
                Additional information given by slot
            </template>
        </ContactInformation>
    </CmdWidthLimitationWrapper>
    <!-- end basic-form ------------------------------------------------------------------------------------------------------------------------------------------------------->

    <!-- begin multiple-lists-of-links ------------------------------------------------------------------------------------------------------------------------------------------------------->
    <CmdWidthLimitationWrapper>
        <h2 class="headline-demopage" id="section-multiple-lists-of-links-downloads">
            <span>Multiple Lists of links</span>
        </h2>
        <h3 id="section-multiple-lists-of-links-downloads">Downloads</h3>
        <MultipleListsOfLinks :segments="listOfDownloadsData" />
        <hr />
        <h3 id="section-multiple-lists-of-links-sitemap">SiteMap</h3>
        <MultipleListsOfLinks :segments="listOfSiteLinksData" />
    </CmdWidthLimitationWrapper>
    <!-- end multiple-lists-of-links ------------------------------------------------------------------------------------------------------------------------------------------------------->

    <!-- begin multiple-box-wrapper ------------------------------------------------------------------------------------------------------------------------------------------------------->
    <CmdWidthLimitationWrapper>
        <h2 class="headline-demopage" id="section-multiple-box-wrapper">
            <span>Multiple Box Wrapper</span>
        </h2>
        <h3 id="section-multiple-box-wrapper-faqs">FAQs</h3>
        <MultipleBoxWrapper :segments="faqsData" />
        <hr />
        <h3 id="section-multiple-box-wrapper-team-overview">Team Overview</h3>
        <MultipleBoxWrapper :segments="boxesTeamOverviewData" />
    </CmdWidthLimitationWrapper>
    <!-- end multiple-box-wrapper ------------------------------------------------------------------------------------------------------------------------------------------------------->
</template>

<script>
// import example data
import addressData from "@/assets/data/address-data.json"
import faqsData from "@/assets/data/pages/boxes-faqs.json"
import boxesTeamOverviewData from "@/assets/data/pages/boxes-team-overview.json"
import listOfDownloadsData from "@/assets/data/pages/list-of-downloads.json"
import listOfSiteLinksData from "@/assets/data/pages/list-of-site-links.json"
export default {
    name: "PageOverview",
    data() {
        return {
            addressData,
            faqsData,
            boxesTeamOverviewData,
            listOfDownloadsData,
            listOfSiteLinksData
        }
    }
}
</script>

<style>

</style>