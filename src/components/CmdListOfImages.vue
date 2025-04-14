<template>
    <div :class="['cmd-list-of-images',
        {
            box: styleAsBox
        }
    ]">
        <!-- begin cmd-headline -->
        <CmdHeadline
            v-if="cmdHeadline?.headlineText"
            v-bind="cmdHeadline"
        />
        <!-- end cmd-headline -->

        <!-- begin list of images -->
        <ul :class="['list-of-images', {vertical: orientation === 'vertical'}]">
            <li v-for="(image, index) in images" :key="index">
                <!-- begin CmdImage with link-->
                <a v-if="image.image.url" href="#">
                    <CmdImage v-bind="image" />
                </a>
                <!-- end CmdImage with link-->

                <!-- begin CmdImage without link-->
                <CmdImage v-else v-bind="image" />
                <!-- end CmdImage without link-->
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
// import {buildComponentPath, updateHandlerProvider} from "../utils/editmode.js"

export default {
    name: "CmdListOfImages",
    emits: ["click"],
    //mixins: [EditMode],
    props: {
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
         * list of displayed images
         */
        images: {
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
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        }
    },
    methods: {
/*
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
*/
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