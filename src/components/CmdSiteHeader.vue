<template>
    <!-- begin CmdSiteHeader ---------------------------------------------------------------------------------------- -->
    <div
        ref="site-header"
        :class="[
            'cmd-site-header site-header',
            {
                sticky: sticky,
                'navigation-inline': navigationInline,
                'off-canvas-right': cmdMainNavigation?.offcanvasPosition === 'right'
            }
        ]"
        role="banner">
        <!-- begin slot for elements above header -->
        <div v-if="$slots.topheader" class="top-header">
            <slot name="topheader"></slot>
        </div>
        <!-- end slot for elements above header -->

        <!-- begin (inner) header -->
        <header
            :class="[
                useGrid ? 'grid-container-create-columns': 'flex-container',
                {'has-navigation': (cmdMainNavigation?.navigationEntries?.length && navigationInline) || $slots.navigation}
            ]">
            <!-- begin slots for logo and other header elements -->
            <template v-if="$slots.logo || $slots.header || $slots.navigation">
                <slot name="logo"></slot>
                <slot name="header"></slot>
                <slot name="navigation"></slot>
            </template>
            <!-- end slots for logo and other header elements -->

            <!-- begin content given by data -->
            <template v-if="cmdCompanyLogo || cmdMainNavigation?.navigationEntries?.length">
                <!-- begin CmdCompanyLogo -->
                <CmdCompanyLogo
                    v-if="cmdCompanyLogo"
                    v-bind="cmdCompanyLogo"
                    @image-loaded="onImageLoaded"
                />
                <!-- end CmdCompanyLogo -->

                <!-- begin CmdMainNavigation -->
                <CmdMainNavigation
                    v-if="cmdMainNavigation?.navigationEntries?.length && navigationInline"
                    v-bind="cmdMainNavigation"
                    :closeOffcanvas="closeOffcanvas"
                    @offcanvas="emitOffcanvasStatus"
                />
                <!-- end CmdMainNavigation -->
            </template>
            <!-- end content given by data -->
        </header>
        <!-- end (inner) header -->

        <!-- begin CmdMainNavigation -->
        <CmdMainNavigation
            v-if="cmdMainNavigation?.navigationEntries?.length && !navigationInline"
            v-bind="cmdMainNavigation"
            :closeOffcanvas="closeOffcanvas"
            @offcanvas="emitOffcanvasStatus"
        />
        <!-- end CmdMainNavigation -->
    </div>
    <!-- end CmdSiteHeader ---------------------------------------------------------------------------------------- -->
</template>

<script>
export default {
    name: "CmdSiteHeader",
    emits: ["offcanvas"],
    data() {
        return {
            defaultLogoHeight: ""
        }
    },
    props: {
        /**
         * use only if default-button of inner navigation-component should not be used
         */
        closeOffcanvas: {
            type: Object,
            required: false
        },
        /**
         * activated sticky-header (stays on top if page is scrolled)
         */
        sticky: {
            type: Boolean,
            default: true
        },
        /**
         * activate if navigation should be displayed inline to logo (otherwise it will be displayed below)
         *
         * @affectsStyling: true
         */
        navigationInline: {
            type: Boolean,
            default: false
        },
        /**
         * set if header (incl. logo) should be resized if user scrolls page
         *
         * scrollContainerToResizeHeader-property must be defined
         */
        resizeHeaderOnScroll: {
            type: Boolean,
            default: true
        },
        /**
         * set selector for element that scrolls content to resize header
         *
         * resizeHeaderOnScroll-property must be activated
         */
        scrollContainerToResizeHeader: {
            type: String,
            default: ".page-wrapper"
        },
        /**
         * use a grid for positioning of inner-elements (else a flex-container will be used)
         *
         * @affectsStyling: true
         */
        useGrid: {
            type: Boolean,
            default: true
        },
        /**
         * properties for CmdCompanyLogo-component
         */
        cmdCompanyLogo: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdMainNavigation-component
         */
        cmdMainNavigation: {
            type: Object,
            required: false
        }
    },
    mounted() {
        if (this.resizeHeaderOnScroll) {
            const scrollContainer = document.querySelector(this.scrollContainerToResizeHeader);

            scrollContainer.addEventListener("scroll", function () {
                const header = document.querySelector(".cmd-site-header > header");

                if (scrollContainer.scrollTop > 0) {
                    header.classList.add("resize-on-scroll");
                } else {
                    header.classList.remove("resize-on-scroll");
                }
            });
        }
    },
    methods: {
        onImageLoaded(event) {
            this.defaultLogoHeight = (event.target.height / 10) + "rem"
        },
        emitOffcanvasStatus(event) {
            this.$emit("offcanvas", event)
        }
    },
    watch: {
        defaultLogoHeight() {
            const logo = this.$refs["site-header"].querySelector(".cmd-company-logo img")
            logo.style.height = this.defaultLogoHeight
        }
    }
}
</script>

<style>
/* begin cmd-site-header ---------------------------------------------------------------------------------------- */
.cmd-site-header {
    --logo-width-on-scroll: 50%;

    grid-area: site-header;
    display: flex;
    flex-direction: column;
    flex: none;

    &.sticky {
        position: sticky;
        z-index: 300;

        header {
            --header-scroll-animation: var(--default-transition);
            transition: var(--header-scroll-animation);

            .cmd-company-logo {
                figure {
                    img {
                        transform-origin: top left;
                        transition: var(--header-scroll-animation);
                        margin: 0;
                        width: 100%;
                    }
                }
            }

            &.resize-on-scroll {
                padding-top: var(--default-padding);
                padding-bottom: var(--default-padding);
                transition: var(--header-scroll-animation);

                .cmd-company-logo {
                    figure {
                        img {
                            transition: var(--header-scroll-animation);
                            width: var(--logo-width-on-scroll);
                        }
                    }
                }
            }
        }
    }

    li a {
        text-decoration: none;
    }

    header, .cmd-main-navigation nav, .cmd-list-of-links {
        max-width: var(--max-width);
        width: 100%; /* stretch flex-item */
        padding: 0 var(--default-padding);
    }

    .cmd-main-navigation nav {
        width: auto;
        margin: 0 0 0 auto; /* align nav to right */
    }

    .top-header {
        .cmd-list-of-links {
            padding-top: calc(var(--default-padding) / 2);
            padding-bottom: calc(var(--default-padding) / 2);
        }
    }

    .main-navigation-wrapper {
        grid-column: span var(--grid-columns);
        border-bottom: 0;
    }

    & + .main-navigation-wrapper {
        nav {
            border-left: 0;
            border-right: 0;
        }
    }

    /* use id to ensure high specificity */
    > .cmd-main-navigation.main-navigation-wrapper:last-child {
        border-bottom: 0;
    }

    header {
        padding-top: var(--default-padding);
        padding-bottom: var(--default-padding);
        row-gap: 0;

        &.has-navigation {
            grid-template-rows: 1fr min-content;
            grid-template-areas: "company-logo" "main-navigation";
            padding-bottom: 0;
        }

        &.flex-container {
            width: 100%;

            .cmd-company-logo {
                grid-area: company-logo;
                flex: none;
            }
        }

        .cmd-main-navigation nav {
            padding: 0;
        }

        .cmd-main-navigation,
        nav ul li {
            border-bottom: 0;
        }
    }

    /* begin inline-navigation (shares spaces with company-logo) */
    &.navigation-inline {
        header {
            &.has-navigation {
                grid-template-rows: 1fr;
                grid-template-areas: "company-logo main-navigation";
                padding-bottom: var(--default-padding);
            }

            .cmd-company-logo {
                grid-area: company-logo;
                grid-column: span var(--grid-small-span);
            }

            .main-navigation-wrapper {
                grid-area: main-navigation;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                grid-column: span var(--grid-large-span);

                &:not(.persist-on-mobile) {
                    padding-left: 0 !important;
                }
            }
        }

        &.off-canvas-right {
            header {
                &.has-navigation {
                    grid-template-areas: "company-logo main-navigation";
                }
            }
        }
    }

    /* end inline-navigation (shares spaces with company-logo */
}
</style>

<style lang="scss">
@import '../assets/styles/variables';

@media only screen and (max-width: $medium-max-width) {
    .cmd-site-header {
        header {
            grid-auto-rows: auto; /* items should be as large as their content */

            .cmd-main-navigation.main-navigation-wrapper {
                &:not(.persist-on-mobile) {
                    padding: 0;
                }
            }

            /* main-navigation below logo */
            & + .cmd-main-navigation.main-navigation-wrapper {
                padding-bottom: var(--default-padding);
            }
        }

        /* main-navigation inline with logo */
        &.navigation-inline {
            .cmd-main-navigation.main-navigation-wrapper {
                &:not(.persist-on-mobile) {
                    padding-left: var(--default-padding);
                }
            }

            &.off-canvas-right {
                .cmd-main-navigation.main-navigation-wrapper {
                    &:not(.persist-on-mobile) {
                        padding: 0;
                    }
                }
            }
        }
    }
}

@media only screen and (max-width: $small-max-width) {
    .cmd-site-header {
        gap: calc(var(--default-gap) / 2);

        .top-header {
            .cmd-list-of-links {
                padding: 0;
            }
        }

        &.navigation-inline {
            header {
                .cmd-company-logo, .main-navigation-wrapper {
                    grid-column: span calc(var(--grid-small-span) / 2);
                }
            }
        }

        header {
            --header-scroll-animation: none;
            --logo-width-on-scroll: 100%;
        }
    }
}

/* end cmd-site-header ------------------------------------------------------------------------------------------ */
</style>
