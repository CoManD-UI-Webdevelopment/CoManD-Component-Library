<template>
    <!-- begin CmdSiteWrapper ---------------------------------------------------------------------------------------- -->
    <div :class="['cmd-site-wrapper site-wrapper', { 'overflow-hidden': offCanvasOpen }]"
        :style="{ 'scroll-padding-top': heightSiteHeader + 'px' }" v-fancybox>
        <a v-if="!nestedInPage" id="anchor-back-to-top"></a>
        <!-- begin above-site-header-slot -->
        <slot name="above-site-header"></slot>
        <!-- end above-site-header-slot -->

        <slot name="site-header">
            <CmdSiteHeader v-if="cmdSiteHeaderProperties.show" v-bind="cmdSiteHeaderProperties"
                @offcanvas="offcanvasToggled">
                <!-- begin site-header-slots-->
                <template v-slot:topheader>
                    <slot name="topheader"></slot>
                </template>
                <template v-slot:logo>
                    <slot name="logo"></slot>
                </template>
                <template v-slot:header>
                    <slot name="header"></slot>
                </template>
                <template v-slot:navigation>
                    <slot name="navigation"></slot>
                </template>
                <!-- end site-header-slots-->
            </CmdSiteHeader>
        </slot>

        <!-- begin hero-section-wrapper -->
        <div v-if="useHeroSection" class="hero-section-wrapper">
            <!-- begin hero-section-content-slot -->
            <slot name="hero-section-content"></slot>
            <!-- end hero-section-content-slot -->
        </div>
        <!-- end hero-section-wrapper -->

        <!-- begin main-content-wrapper -->
        <component :is="nestedInPage ? 'div' : 'main'" class="main-content-wrapper">
            <CmdWidthLimitationWrapper :useFullDeviceWidth="useFullWidthForMainContent"
                :contentOrientation="contentOrientation">
                <!-- begin left column -->
                <aside v-if="aside?.leftColumn?.show" class="left-column" aria-label="Left column">
                    <!-- begin slot left column -->
                    <slot name="left-column"></slot>
                    <!-- end slot left column -->
                </aside>
                <!-- end left column -->

                <!-- begin (center column for) page-content -->
                <div class="page-wrapper">
                    <CmdPageHeader v-bind="cmdPageHeader" />

                    <!-- begin slot page-content -->
                    <slot name="page-content">
                        <div class="page-content" v-html="pageContent"></div>
                    </slot>
                    <!-- end slot page-content -->

                    <CmdPageFooter v-bind="cmdPageFooter" />
                </div>
                <!-- end (center column for) page-content -->

                <!-- begin right column -->
                <aside v-if="aside?.rightColumn?.show" class="right-column" aria-label="Right column">
                    <!-- begin slot right column -->
                    <slot name="right-column"></slot>
                    <!-- end slot right column -->
                </aside>
                <!-- begin right column -->
            </CmdWidthLimitationWrapper>
        </component>
        <!-- end main-content-wrapper -->

        <!-- begin site-footer-slot -->
        <slot name="site-footer">
            <CmdSiteFooter v-if="cmdSiteFooterProperties.show" v-bind="cmdSiteFooterProperties">
                    <!-- begin parent-component -->
                    <template v-if="editMode">
                        <EditComponentWrapper v-for="(component, componentIndex) in cmdSiteFooter?.components || []"
                            :key="componentIndex" :allow-add-component="component.allowAddComponent"
                            :componentName="component.name" :componentProps="component.props"
                            :componentPath="componentPath(componentIndex)">
                            <component :is="component.name" v-bind="component.props">
                                <!-- begin child-component -->
                                <component v-for="(childComponent, childComponentIndex) in component.components || []"
                                    :key="childComponentIndex" :is="childComponent.name" v-bind="childComponent.props"
                                    :editContent="childComponent.editContent" />
                                <!-- end child-component -->
                            </component>
                        </EditComponentWrapper>
                    </template>
                    <template v-else>
                        <component v-for="(component, index) in cmdSiteFooter?.components || []" :key="index"
                            :is="component.name" v-bind="component.props">
                            <!-- begin child-component -->
                            <component v-for="(childComponent, childComponentIndex) in component.components || []"
                                :key="childComponentIndex" :is="childComponent.name" v-bind="childComponent.props"
                                :editContent="childComponent.editContent" />
                            <!-- end child-component -->
                        </component>
                    </template>
                    <!-- end parent-component -->
            </CmdSiteFooter>
        </slot>
        <!-- end site-footer-slot -->

        <!-- begin below-site-footer-slot -->
        <slot name="below-site-footer"></slot>
        <!-- end below-site-footer-slot -->

        <CmdBackToTopButton v-if="!offCanvasOpen && cmdBackToTopButtonProperties.show" href="#anchor-back-to-top"
            v-bind="cmdBackToTopButtonProperties" />

        <CmdFancyBox v-if="cmdCookieDisclaimer" :show="fancyBoxCookieDisclaimer" :fancyboxOptions="{}"
            :allowEscapeKey="false" :cmdHeadline="cmdHeadlineForFancyBox"
            :ariaLabelText="cmdHeadlineForFancyBox?.headlineText">
            <CmdCookieDisclaimer :cookieOptions="cmdCookieDisclaimer.options"
                buttonLabelAcceptAllCookies="Accept all cookies"
                buttonLabelAcceptCurrentSettings="Accept current settings"
                @closeCookieDisclaimer="closeCookieDisclaimer" v-model="acceptedCookies"
                :cmdHeadlineCookieDisclaimer="{ show: false }" />
        </CmdFancyBox>
    </div>
    <!-- end CmdSiteWrapper ---------------------------------------------------------------------------------------- -->
</template>

<script>
export default {
    name: "CmdSiteWrapper",
    data() {
        return {
            offCanvasOpen: false,
            heightSiteHeader: 150,
            acceptedCookies: [],
            fancyBoxCookieDisclaimer: true
        }
    },
    props: {
        /**
         * set to true if the site-wrapper is embedded in another page (i.e. demo, preview): renders no <main> and no anchor-id (both must exist only once per document)
         */
        nestedInPage: {
            type: Boolean,
            default: false
        },
        /**
         * active sections shown in page-content-wrapper
         */
        activeSections: {
            type: Array,
            required: false
        },
        /**
         * set aside (left-/right-column) in main-content-wrapper
         */
        aside: {
            type: Object,
            required: false
        },
        /**
         * activate if hero-section between site-header and main-content should be displayed
         */
        useHeroSection: {
            type: Boolean,
            default: false
        },
        /**
         * provide (html-)content
         */
        pageContent: {
            type: String,
            required: false
        },
        /** 
         * activate if main-content showuld be stretchted to full viewport-width (else it will be limited by CmdWidhtLimitationWrapper)
        */
        useFullWidthForMainContent: {
            type: Boolean,
            default: false
        },
        /**
         * properties for CmdSiteHeader-component
         */
        cmdSiteHeader: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdSiteFooter-component
         */
        cmdSiteFooter: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdBackToTopButton-component
         */
        cmdBackToTopButton: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdPageHeader-component
         */
        cmdPageHeader: {
            type: Object,
            default: null
        },
        /**
         * properties for CmdPageFooter-component
         */
        cmdPageFooter: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdHeadline for Fancy-Box
         */
        cmdHeadlineForFancyBox: {
            type: Object,
            default() {
                return {
                    show: true,
                    headlineText: "Cookie Disclaimer",
                    headlineLevel: 2
                }
            }
        },
        /**
         * properties for CmdCookieDisclaimer
         */
        cmdCookieDisclaimer: {
            type: Object,
            required: false
        },
        /**
         * activate edit-mode
         */
         editMode: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        cmdSiteHeaderProperties() {
            return {
                show: true,
                ...this.cmdSiteHeader
            }
        },
        cmdSiteFooterProperties() {
            return {
                show: true,
                ...this.cmdSiteFooter
            }
        },
        cmdBackToTopButtonProperties() {
            return {
                show: true,
                scrollContainer: ".site-wrapper",
                ...this.cmdBackToTopButton
            }
        },
        contentOrientation() {
            if (this.$slots["left-column"] || this.$slots["right-column"]) {
                return "horizontal"
            }
            return "vertical"
        },
    },
    methods: {
        offcanvasToggled(event) {
            this.offCanvasOpen = event.open
        },
        setupIntersectionObserver() {
            this.$nextTick(() => {
                const sectionProvider = () => document.querySelectorAll(".main-content-wrapper .cmd-width-limitation-wrapper > section:not(:has(.cmd-page-header))")
                if (this.$_intersectionObserver) {
                    this.$_intersectionObserver.disconnect()
                    this.$_intersectionObserver = null
                }
                const options = {
                    root: document.getElementById("site-wrapper"),
                    threshold: 0.1
                }
                this.$_intersectionObserver = new IntersectionObserver(entries => {
                    entries.filter(entry => entry.isIntersecting).forEach(entry => {
                        entry.target.classList.add("visible")
                    })
                }, options)
                setTimeout(() => sectionProvider().forEach(element => this.$_intersectionObserver.observe(element)), 500)
            })
        },
        openFancybox(event) {
            openFancyBox({ url: event.target.href })
        },
        closeCookieDisclaimer() {
            this.fancyBoxCookieDisclaimer = false
            localStorage.setItem("onepagerPrivacySettingsAccepted", "true")
        },
        componentPath(componentIndex) {
            return [
                "siteFooter",
                "components",
                componentIndex
            ]
        },
        childComponentPath(componentIndex) {
            return [
                "components",
                componentIndex
            ]
        }
    },
    mounted() {
        const siteHeader = document.getElementsByClassName("cmd-site-header")

        if (siteHeader.length > 0) {
            const resizeObserver = new ResizeObserver(entries => {
                // get height of site-header to set scroll-padding on .site-wrapper
                this.heightSiteHeader = entries[0].target.offsetHeight
            })
            resizeObserver.observe(siteHeader[0])
        }
    },
    updated() {
        this.setupIntersectionObserver()
    },
    watch: {
        activeSections: {
            handler() {
                this.setupIntersectionObserver()
            },
            immediate: true
        }
    }
}
</script>

<style>
.cmd-site-wrapper {
    .main-content-wrapper {
        &:has(aside) {
            .page-wrapper {
                section {
                    padding-left: calc(var(--default-padding) * 2) !important;
                    padding-right: calc(var(--default-padding) * 2) !important;
                }
            }

            aside {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: var(--default-gap);
                max-width: 20%;
                container: sidebar / inline-size;

                &>* {
                    margin: 0;
                }

                &:first-child {
                    &+.page-wrapper {
                        flex: 2;

                        &:last-child {
                            flex: 3;
                        }
                    }
                }
            }
        }

        &.full-width {
            &:has(aside) {
                aside {
                    max-width: 15%;
                }
            }
        }

        .page-wrapper {
            display: flex;
            flex-direction: column;
            width: 100%;
        }
    }
}
</style>
<style lang="scss">

@import '../assets/styles/variables';

@media only screen and (width <=$medium-max-width) {
    .cmd-site-wrapper {
        .main-content-wrapper {
            flex-direction: column;

            &:has(aside) {
                aside {
                    width: 100%;
                    max-width: none;

                    &:first-child {
                        &+.main-content-wrapper {
                            flex: none;

                            &:last-child {
                                flex: none;
                            }
                        }
                    }

                    &>* {
                        width: auto !important;
                    }
                }
            }
        }
    }
}

@media only screen and (width <=$small-max-width) {
    .cmd-site-wrapper {
        .main-content-wrapper {
            gap: calc(var(--default-gap) * 2);

            &:has(aside) {
                aside {
                    flex-direction: column;

                    &>* {
                        width: 100% !important;
                    }
                }
            }
        }
    }
}
</style>