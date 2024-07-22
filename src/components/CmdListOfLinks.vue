<template>
    <div :class="['cmd-list-of-links',
        {
            box: styleAsBox, horizontal: orientation === 'horizontal',
            'section-anchors': sectionAnchors,
            'large-icons': largeIcons,
            'show-list-style-items': showListStyleItems
        }
    ]">
        <!-- begin cmd-headline -->
        <CmdHeadline
            v-if="cmdHeadline?.headlineText || editModeContext"
            v-bind="cmdHeadline"
        />
        <!-- end cmd-headline -->

        <!-- begin list of links -->
        <ul :class="['flex-container', {'no-gap': !useGap}, 'align-' + align, setStretchClass]">
            <!-- begin CmdListOfLinksItem-->
            <CmdListOfLinksItem
                v-if="!editModeContext"
                v-for="(link, index) in links"
                :key="index"
                :class="{'active': sectionAnchors && activeSection === index}"
                :link="link"
            />
            <!-- end CmdListOfLinksItem-->

            <!-- begin edit-mode -->
            <li v-else>
                <EditComponentWrapper
                    v-for="(link, index) in links"
                    :key="'x' + index"
                    class="edit-items"
                    :showComponentName="false"
                    componentTag="ul"
                    componentName="CmdLinkItem"
                    :componentProps="link"
                    :allowedComponentTypes="[]"
                    :componentPath="['props', 'links', index]"
                    :itemProvider="itemProvider"
                >
                    <!-- begin CmdListOfLinksItem-->
                    <CmdListOfLinksItem
                        :class="{'active': sectionAnchors && activeSection === index}"
                        :link="link"
                    />
                    <!-- end CmdListOfLinksItem-->
                </EditComponentWrapper>

                <button v-if="links.length === 0" type="button" class="button confirm small" @click="onAddItem">
                    <span class="icon-plus"></span>
                    <span>Add new entry</span>
                </button>
            </li>
            <!-- end edit-mode -->
        </ul>
        <!-- end list of links -->
    </div>
</template>

<script>
// import mixins (editMode only)
import EditMode from "../mixins/EditMode.vue"

// import utils (editMode only)
import {buildComponentPath, updateHandlerProvider} from "../utils/editmode.js"

export default {
    name: "CmdListOfLinks",
    emits: ["click"],
    mixins: [EditMode],
    props: {
        /**
         * toggle gab between links
         */
        useGap: {
            type: Boolean,
            default: true
        },
        /**
         * style component like a box
         *
         * @affectsStyling: true
         */
        styleAsBox: {
            type: Boolean,
            default: false
        },
        /**
         * activate if large icons should be displayed above link text
         *
         * @affectsStyling: true
         */
        largeIcons: {
            type: Boolean,
            default: false
        },
        /**
         * activate if component should contain a list of anchors for the section within the page
         */
        sectionAnchors: {
            type: Boolean,
            default: false
        },
        /**
         * given active section from outside to set class for styling
         *
         * sectionAnchors-property must be activated
         */
        activeSection: {
            type: Number,
            default: 0
        },
        /**
         * toggle list-style-items visibility
         *
         * @affectsStyling: true
         */
        showListStyleItems: {
            type: Boolean,
            default: false
        },
        /**
         * set horizontal alignment
         *
         * orientation-property must be set to 'horizontal'
         *
         * @allowedValues: left, center, right
         */
        align: {
            type: String,
            default: "left",
            validator(value) {
                return value === "left" ||
                    value === "center" ||
                    value === "right"
            }
        },
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        },
        /**
         * list of displayed links
         */
        links: {
            type: Array,
            required: false
        },
        /**
         * toggle orientation of list
         *
         * @allowedValues: horizontal, vertical
         */
        orientation: {
            type: String,
            default: "vertical",
            validator(value) {
                return value === "horizontal" ||
                    value === "vertical"
            }
        }
    },
    computed: {
        setStretchClass() {
            if(this.largeIcons && this.orientation === "horizontal") {
                return "stretch"
            }
            return null
        }
    },
    methods: {
        onAddItem() {
            this.editModeContext.content.addContent(
                buildComponentPath(this, 'props', 'links', -1),
                this.itemProvider)
        },
        itemProvider() {
            return {
                "iconClass": "icon-user-profile",
                "type": "href",
                "text": "Linktext",
                "path": "#",
                "tooltip": "Tooltip",
                "target": "_blank"
            }
        },
        updateHandlerProvider() {
            return updateHandlerProvider(this, {
                update(props, childUpdateHandlers) {
                    const cmdHeadlineUpdateHandler = childUpdateHandlers?.find(handler => handler.name === "CmdHeadline")
                    if (cmdHeadlineUpdateHandler) {
                        props.cmdHeadline = props.cmdHeadline || {}
                        cmdHeadlineUpdateHandler.update(props.cmdHeadline)
            }
                }
            })
        }
    }
}
</script>

<style>
/* begin cmd-list-of-links ---------------------------------------------------------------------------------------- */
.cmd-list-of-links {
    > ul {
        flex-direction: column;
        gap: calc(var(--default-gap) / 2);
        margin: 0;

        li {
            list-style: none;
            margin-left: 0 !important; /* overwrite default-settings from frontend-framework */
        }

        &.align-center {
            justify-content: center;
        }

        &.align-right li {
            text-align: right;
        }

        ul {
            display: flex;
            flex-direction: column;
            margin-left: calc(var(--default-padding) * 2);
        }
    }

    &.show-list-style-items {
        li {
            list-style-type: disc;
            margin-left: 1.7rem;
        }
    }

    &.horizontal {
        > ul {
            gap: var(--default-gap);
            flex-direction: row;

            > li {
                flex: none;
                display: flex;
                flex-direction: column;
            }

            &.align-right {
                justify-content: flex-end;
            }

            &.stretch {
                justify-content: space-around;
            }
        }

    }

    &.large-icons {
        li {
            list-style-type: none;

            a {
                display: flex;
                flex-direction: column;
                gap: calc(var(--default-gap) / 4);
                text-decoration: none;
                align-items: center;
                justify-content: center;

                span {
                    margin: 0;
                }

                [class*="icon-"] {
                    font-size: 5rem;
                }
            }
        }
    }
}
</style>

<style lang="scss">
@import '../assets/styles/variables';

@media only screen and (max-width: $medium-max-width) {
    .cmd-list-of-links {
        > ul {
            ul {
                gap: calc(var(--default-gap) / 2);

                > li:first-child {
                    margin-top: calc(var(--default-gap) / 2);
                }
            }
        }
    }
}
/* end cmd-list-of-links------------------------------------------------------------------------------------------ */
</style>