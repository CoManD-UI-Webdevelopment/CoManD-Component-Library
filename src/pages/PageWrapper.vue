<template>
    <a id="anchor-back-to-top"></a>
    <div :class="{'overflow-hidden': offCanvasOpen}" class="page-wrapper" :id="templateId"
         :style="{'scroll-padding-top': heightSiteHeader + 'px'}">
        <!-- begin cmd-site-header -->
        <CmdSiteHeader
            v-if="cmdSiteHeader"
            :cmdMainNavigation="{navigationEntries: mainNavigationEntries}"
            :closeOffcanvas="{ iconClass: 'icon-cancel', text: 'Close navigation', showText: true}"
            :navigationInline="cmdSiteHeader.navigationInline"
            @offcanvas="offcanvasToggled"
        >
            <template v-slot:top-header>
                <!-- begin cmd-list-of-links (for top-header-navigation) -->
                <CmdListOfLinks
                    v-if="topHeaderNavigationEntries"
                    :links="topHeaderNavigationEntries"
                    orientation="horizontal"
                    align="right"
                />
                <!-- end cmd-list-of-links (for top-header-navigation) -->
            </template>
            <template v-slot:logo>
                <!-- begin cmd-company-logo -->
                <CmdCompanyLogo
                    v-if="cmdCompanyLogo.pathDefaultLogo"
                    :altText="cmdCompanyLogo.altText"
                    :pathDefaultLogo="cmdCompanyLogo.pathDefaultLogo"
                    :pathDarkmodeLogo="cmdCompanyLogo.pathDarkmodeLogo"
                />
                <!-- end cmd-company-logo -->
            </template>
        </CmdSiteHeader>
        <!-- end cmd-site-header -->

        <!-- begin main-content -->
        <main id="content">
            <div class="inner-content-wrapper">
                <!-- begin left column -->
                <aside v-if="mainContent.leftColumn.show" class="left-column">
                    <!-- begin slot left column -->
                    <slot name="left-column"></slot>
                    <!-- end slot left column -->
                </aside>
                <!-- end left column -->

                <!-- begin center/main column -->
                <div class="main-content-wrapper">
                    <!-- begin CmdBreadcrumbs -->
                    <CmdBreadcrumbs v-if="cmdBreadcrumbs" v-bind="cmdBreadcrumbs"/>
                    <!-- end CmdBreadcrumbs -->

                    <!-- begin CmdHeadline -->
                    <CmdHeadline v-if="cmdHeadline" v-bind="cmdHeadline"/>
                    <!-- end CmdHeadline -->

                    <slot></slot>

                    <!-- begin CmdSocialNetworks -->
                    <CmdSocialNetworks v-if="cmdSocialNetworks" v-bind="cmdSocialNetworks"/>
                    <!-- end CmdSocialNetworks -->
                </div>
                <!-- end center/main column -->

                <!-- begin right column -->
                <aside v-if="mainContent.rightColumn.show" class="right-column">
                    <!-- begin slot right column -->
                    <slot name="left-column"></slot>
                    <!-- end slot right column -->
                </aside>
                <!-- begin right column -->
            </div>
        </main>
        <!-- end main-content -->

        <!-- begin cmd-site-footer -->
        <CmdSiteFooter v-if="cmdSiteFooter">
            <!-- begin parent-component -->
            <component
                v-for="(component, index) in cmdSiteFooter.components || []" :key="index"
                :is="component.name"
                v-bind="component.props"
                v-on="handlers(component)"
            >
                <!-- begin child-component -->
                <component
                    v-for="(childComponent, childComponentIndex) in component.components || []"
                    :key="childComponentIndex" :is="childComponent.name"
                    v-bind="childComponent.props"
                    v-on="handlers(childComponent)"
                    :editContent="childComponent.editContent"
                />
                <!-- end child-component -->
            </component>
            <!-- end parent-component -->
        </CmdSiteFooter>
        <!-- end cmd-site-footer -->

        <!-- begin cmd-copyright-information DO NOT REMOVE -->
        <CmdCopyrightInformation/>
        <!-- end cmd-copyright-information DO NOT REMOVE -->

        <!-- begin cmd-back-to-top-button -->
        <CmdBackToTopButton
            href="#anchor-back-to-top"
            :iconBackToTop="iconBackToTop"
            scroll-container=".page-wrapper"
        />
        <!-- end cmd-back-to-top-button -->

        <!-- begin fancy-box ------------------------------------------------------------------------------------------------------------------------------------------------------->
        <CmdFancyBox
            v-if="cmdCookieDisclaimer"
            :show="fancyBoxCookieDisclaimer"
            :fancyboxOptions="{}"
            :allowEscapeKey="false"
            :cmdHeadline="{show: true, headlineText: 'Cookie Disclaimer', headlineLevel: 2}"
            ariaLabelText="Cookie Disclaimer"
        >
            <!-- begin cookie-disclaimer ------------------------------------------------------------------------------------------------------------------------------------------------------->
            <CmdCookieDisclaimer
                :cookieOptions="cmdCookieDisclaimer.options"
                buttonLabelAcceptAllCookies="Accept all cookies"
                buttonLabelAcceptCurrentSettings="Accept current settings"
                @closeCookieDisclaimer="closeCookieDisclaimer"
                v-model="acceptedCookies"
                :cmdHeadlineCookieDisclaimer="{ show: false }">
                <template #privacy-text>
                    <p>
                        <strong>
                            By browsing this web site you accept the usage and saving of anonymous data!
                        </strong>
                    </p>
                </template>
            </CmdCookieDisclaimer>
            <!-- end cookie-disclaimer ------------------------------------------------------------------------------------------------------------------------------------------------------->
        </CmdFancyBox>
        <!-- end fancy-box ------------------------------------------------------------------------------------------------------------------------------------------------------->
    </div>
</template>

<script>
// import functions
import {openFancyBox} from "@/components/CmdFancyBox.vue"

export default {
    name: "PageWrapper",
    data() {
        return {
            offCanvasOpen: false,
            heightSiteHeader: 150,
            acceptedCookies: [],
            fancyBoxCookieDisclaimer: true
        }
    },
    props: {
        templateId: {
            type: String,
            default: null
        },
        topHeaderNavigationEntries: {
            default: []
        },
        mainNavigationEntries: {
            default: []
        },
        mainContent: {
            leftColumn: {
                show: true
            },
            rightColumn: {
                show: true
            }
        },
        cmdSiteHeader: {
            default: null
        },
        cmdCompanyLogo: {
            default: null
        },
        cmdBreadcrumbs: {
            default: null
        },
        cmdHeadline: {
            default: null
        },
        cmdSocialNetworks: {
            default: null
        },
        cmdSiteFooter: {
            default: null
        },
        cmdCookieDisclaimer: {
            default: null
        }
    },
    mounted() {
        const siteHeader = document.getElementsByClassName("cmd-site-header")

        if (siteHeader.length > 0) {
            const resizeObserver = new ResizeObserver(entries => {
                // get height of site-header to set scroll-padding on .page-wrapper
                this.heightSiteHeader = entries[0].target.offsetHeight
            })
            resizeObserver.observe(siteHeader[0])
        }
    },
    computed: {
        iconBackToTop() {
            return {
                iconClass: "icon-chevron-one-stripe-up",
                tooltip: this.label("back_to_top_button.tooltip")
            }
        }
    },
    methods: {
        offcanvasToggled(event) {
            this.offCanvasOpen = event.open
        },
        handlers(component) {
            if (component.handlers === "toggleSection") {
                return {
                    "click": this.toggleSection
                }
            }
            return {}
        },
        openFancybox(event) {
            openFancyBox({url: event.target.href})
        },
        closeCookieDisclaimer() {
            this.fancyBoxCookieDisclaimer = false
            localStorage.setItem("onepagerPrivacySettingsAccepted", "true")
        }
    }
}
</script>

<style>
.inner-content-wrapper {
    display: flex;

    &:has(> aside) {
        aside {
            flex: 1;

            &:first-child {
                & + .main-content-wrapper {
                    flex: 2;

                    &:last-child {
                        flex: 3;
                    }
                }
            }
        }
    }

    .main-content-wrapper {
        width: 100%;
    }

}
</style>