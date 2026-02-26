<template>
    <!-- begin CmdList ---------------------------------------------------------------------------------------- -->
    <transition :name="transition">
        <div :class="['cmd-list',
            {
                box: styleAsBox,
                'section-anchors': sectionAnchors,
                'large-icons': largeIcons,
                'show-list-style-items': showListStyleItems,
            },
            'list-content-type-' + listContentType
        ]">
            <!-- begin cmd-headline -->
            <CmdHeadline v-if="cmdHeadline?.headlineText || editModeContext" v-bind="cmdHeadlineProperties" />
            <!-- end cmd-headline -->

            <!-- begin list of links ordered/unordered -->
            <component v-if="listType !== 'description'" :is="listTag"
                :class="['flex-container', { 'no-gap': !useGap }, 'align-' + align, setStretchClass, { horizontal: orientation === 'horizontal' }]">
                <template v-if="listContentType === 'links'">
                    <slot>
                        <!-- begin CmdListOfLinksItem-->
                        <CmdListOfLinksItem v-if="!editModeContext" v-for="(link, index) in items" :key="index"
                            :class="{ 'active': sectionAnchors && activeSection === index }" :link="link"
                            @click="emitClick($event, linkType)" />
                        <!-- end CmdListOfLinksItem-->

                        <!-- begin edit-mode -->
                        <li v-else>
                            <EditComponentWrapper v-for="(link, index) in links" :key="'x' + index" class="edit-items"
                                :showComponentName="false" componentTag="ul" componentName="CmdLinkItem"
                                :componentProps="link" :allowedComponentTypes="[]"
                                :componentPath="['props', 'links', index]" :itemProvider="itemProvider">
                                <!-- begin CmdListOfLinksItem-->
                                <CmdListOfLinksItem :class="{ 'active': sectionAnchors && activeSection === index }"
                                    :link="link" />
                                <!-- end CmdListOfLinksItem-->
                            </EditComponentWrapper>

                            <button v-if="links.length === 0" type="button" class="button confirm small"
                                @click="onAddItem">
                                <span class="icon-plus"></span>
                                <span>Add new entry</span>
                            </button>
                        </li>
                        <!-- end edit-mode -->
                    </slot>
                </template>

                <!-- begin list of images -->
                <template v-if="listContentType === 'images'">
                    <slot>
                        <li v-for="(image, index) in items" :key="index">
                            <!-- begin CmdImage with link-->
                            <a v-if="image.image.url" :href="image.image.url">
                                <CmdImage v-bind="image" />
                            </a>
                            <!-- end CmdImage with link-->

                            <!-- begin CmdImage without link-->
                            <CmdImage v-else v-bind="image" />
                            <!-- end CmdImage without link-->
                        </li>
                    </slot>
                </template>
                <!-- end list of images -->

                <!-- begin tags -->
                <template v-if="listContentType === 'tags'">
                    <slot>
                        <li v-for="(tag, index) in listOfTagItems" :key="index">
                            <!-- begin CmdTag -->
                            <CmdTag 
                                :tagText="tag"
                                :highlightLevel="highlightLevel" 
                                :removeTagByClick="removeTagByClick" 
                                @click.prevent="removeTag(event, index)" 
                            />
                            <!-- end CmdTag -->
                        </li>
                    </slot>
                </template>
                <!-- end tags -->
            </component>
            <!-- end list of links ordered/unordered -->

            <!-- begin description list -->
            <dl v-else>
                <template v-for="(entry, index) in items" :key="index">
                    <dt v-if="!alignDescriptionTermRight">
                        <CmdIcon 
                            v-if="entry.descriptionTerm?.cmdIcon?.iconClass" 
                            v-bind="entry.descriptionTerm.cmdIcon"
                        />
                        <span v-if="entry.descriptionTerm?.text">{{ entry.descriptionTerm?.text }}</span>
                    </dt>
                    <dd>
                        <CmdLink 
                            v-if="entry.descriptionData.cmdLink !== undefined" 
                            v-bind="entry.descriptionData.cmdLink">
                        </CmdLink>
                        <template v-else>
                            {{ entry.descriptionData.text }}
                        </template>
                    </dd>
                    <dt v-if="alignDescriptionTermRight">
                        <CmdIcon 
                            v-if="entry.descriptionTerm?.cmdIcon?.iconClass" 
                            v-bind="entry.descriptionTerm.cmdIcon"
                        />
                        <span v-if="entry.descriptionTerm?.text">{{ entry.descriptionTerm?.text }}</span>
                    </dt>
                </template>
            </dl>
            <!-- end description list -->
        </div>
    </transition>
    <!-- end CmdList ---------------------------------------------------------------------------------------- -->
</template>

<script>
// import mixins (editMode only)
import EditMode from "../mixins/EditMode.vue"

// import utils (editMode only)
import { buildComponentPath, updateHandlerProvider } from "../utils/editmode.js"

export default {
    name: "CmdListOfLinks",
    emits: ["click"],
    mixins: [EditMode],
    data() {
        return {
            listOfTagItems: [...(this.items || [])]
        }
    },
    props: {
        /**
         * define the transition when the list appears/disappears
         * 
         * @allowedValues: "none", "fade", "scroll" 
         */
        transition: {
            type: String,
            default: "fade"
        },
        /**
         * define the highlight-level
         * 
         * @allowedValues: "", "primary", "secondary", "tertiary"
         */
        highlightLevel: {
            type: String,
            default: null,
            validator(value) {
                return value === null ||
                    value === "primary" ||
                    value === "secondary" ||
                    value === "tertiary"
            }
        },
        /**
         * define the list type
         * 
         * @affectsStyling: true
         * @allowedValues: "unordered", "ordered", "description"
         */
        listType: {
            typ: String,
            default: "unordered",
            validator(value) {
                return value === "unordered" ||
                    value === "ordered" ||
                    value === "description"
            }
        },
        /**
         * set list-type
         * 
         * listType-property must be set to "ordered" or "unordered"
         *
         * @allowedValues: links, images, tags
         */
        listContentType: {
            typ: String,
            default: "links",
            validator(value) {
                return value === "links" ||
                    value === "images" ||
                    value === "tags"
            }
        },
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
         * listType-property must be set to "ordered" or "unordered"
         *
         * @affectsStyling: true
         */
        showListStyleItems: {
            type: Boolean,
            default: false
        },
        /**
         * set if description term should be aligned right
         * 
         * @affectsStyling: true
         */
         alignDescriptionTermRight: {
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
         * list of displayed items
         */
        items: {
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
        },
        /**
         * allow tags to be removed by click 
         * 
         * listContentType-property must be set to "tags"
         */
        removeTagByClick: {
            type: Boolean,
            default: false
        },
        /**
         * define remove-icon/link for tags
         * 
         * listContentType-property must be set to "tags" and removeTabByClick-property must be set to true
         */
        iconRemoveTag: {
            type: Object,
            default: () => (
                {
                    show: true,
                    title: "Remove this tag",
                    iconClass: "icon-cancel"
                }
            )
        },
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        }
    },
    mounted() {
        this.updateActiveClass()
    },
    computed: {
        cmdHeadlineProperties() {
            return {
                headlineLevel: 3,
                ...this.cmdHeadline
            }
        },
        setStretchClass() {
            if (this.largeIcons && this.orientation === "horizontal") {
                return "stretch"
            }
            return null
        },
        listTag() {
            if(this.listType !== "description") {
                return this.listType === "ordered" ? "ol" : "ul"
            }
        }
    },
    methods: {
        removeTag(event, index) {
            this.listOfTagItems.splice(index, 1);
            this.$emit("remove-tag", { originalEvent: event, tagIndex: index })
        },
        onAddItem() {
            this.editModeContext.content.addContent(
                buildComponentPath(this, 'props', 'links', -1),
                this.itemProvider
            )
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
        },
        emitClick(event, linkType) {
            this.$emit("click", { originalEvent: event, linkType: linkType })
        },
        updateActiveClass() {
            // remove "active" from all links first
            document.querySelectorAll(".router-link-exact-active").forEach(el => {
                el.classList.add("active")
            })
        }
    },
    watch: (() => route.fullPath, () => {
        this.updateActiveClass();
    })
}
</script>

<style>
/* begin cmd-list ---------------------------------------------------------------------------------------- */
.cmd-list {
    > ul {
        flex-direction: column;
        gap: var(--default-gap-half);
        margin: 0;

        li {
            list-style: none;
            margin-left: 0 !important;
            /* overwrite default-settings from frontend-framework */

            &:has(.tag) {
                .tag {
                    gap: var(--default-gap-half);

                    &.primary, &.secondary, &.tertiary {
                        [class*="icon-"] {
                            color: var(--color-white);
                        }
                    }
                }

                [class*="icon-"] {
                    font-size: var(--icon-size-small);
                }
            }
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

    .horizontal {
        > li {
            flex: none;
            display: flex;
            flex-direction: column;
            max-width: 100%; /* avoid li to be stretched by large content */
        }

        &.align-right {
            justify-content: flex-end;
        }

        &.stretch {
            justify-content: space-around;
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
    .cmd-list {
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

/* end cmd-list ------------------------------------------------------------------------------------------ */
</style>