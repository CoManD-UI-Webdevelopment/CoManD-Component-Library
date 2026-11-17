<template>
    <!-- begin CmdHeadline ---------------------------------------------------------------------------------------- -->
    <!-- begin default-view -->
    <HeadlineWrapper v-if="(!editModeContext && (headlineText || $slots.default)) || settingsContext || mainSidebarContext || headlineText"
         :without-wrapper="withoutWrapper" :wrapper-attributes="wrapperAttributes">
        <!-- begin headline with pre-headline-text -->
        <template v-if="preHeadlineText">
            <component v-if="headlineText" :is="headlineTag" :class="[highlightLevel, headlineTextAlign]">
                <!-- begin CmdIcon -->
                <CmdIcon v-if="cmdIcon" v-bind="cmdIcon"/>
                <!-- end CmdIcon -->

                <span :class="['pre-headline-text-wrapper', 'text-align-' + textAlign]">
                    <!-- begin pre-headline-text -->
                    <span class="pre-headline-text" v-html="preHeadlineText"></span>
                    <!-- end pre-headline-text -->

                    <!-- begin default headline-text without slot -->
                    <span v-if="headlineText" v-html="headlineText"></span>
                    <!-- end default headline-text without slot -->

                    <!-- begin headline-text with slot -->
                    <span v-else>
                        <!-- begin slot -->
                        <slot></slot>
                        <!-- end slot -->
                    </span>
                    <!-- end headline-text with slot -->
                </span>
            </component>
        </template>
        <!-- end headline with pre-headline-text -->

        <!-- begin headline without pre-headline-text -->
        <component v-else :is="headlineTag" :class="[highlightLevel, headlineTextAlign]">
            <!-- begin CmdIcon -->
            <CmdIcon v-if="cmdIcon" v-bind="cmdIcon"/>
            <!-- end CmdIcon -->

            <!-- begin default headline-text without slot -->
            <span v-if="headlineText" v-html="headlineText" :class="['text-align-' + textAlign]"></span>
            <!-- end default headline-text without slot -->

            <!-- begin headline-text with slot -->
            <span v-else :class="['text-align-' + textAlign]">
                <!-- begin slot -->
                <slot></slot>
                <!-- end slot -->
            </span>
            <!-- end headline-text with slot -->
        </component>
        <!-- end headline without pre-headline-text -->
    </HeadlineWrapper>
    <!-- end default-view -->

    <!-- begin edit-mode -->
    <EditComponentWrapper
        v-else-if="editModeContext"
        ref="editComponentWrapper"
        class="edit-items"
        :showComponentName="false"
        :allowedComponentTypes="[]"
        componentName="CmdHeadline"
        :componentProps="{headlineText, headlineLevel}"
        :componentPath="headlineComponentPath"
        :allowDeleteComponent="!!headlineText"
    >
        <template v-slot="slotProps">
            <!-- begin CmdFormElement -->
            <CmdFormElement
                v-if="slotProps.editing"
                element="input"
                type="text"
                :class="['edit-mode', 'headline', 'h'+ headlineLevel, headlineTextAlign]"
                labelText="Headline"
                :showLabel="false"
                placeholder="Headline"
                v-model="editableHeadlineText"
            />
            <!-- end CmdFormElement -->

            <template v-else-if="headlineText"
                      :class="['cmd-headline', {'has-pre-headline-text': preHeadlineText, 'has-icon': cmdIcon?.iconClass}, headlineTextAlign]">>
                <CmdIcon v-if="cmdIcon" v-bind="cmdIcon"/>

                <template v-if="preHeadlineText">
                    <component v-if="headlineText" :is="headlineTag">
                        <CmdIcon v-if="cmdIcon" v-bind="cmdIcon"/>

                        <span :class="['pre-headline-text-wrapper', 'text-align-' + textAlign]">
                            <!-- begin pre-headline-text -->
                            <span class="pre-headline-text">{{ preHeadlineText }}</span>
                            <!-- end pre-headline-text -->

                            <!-- begin slot -->
                            <slot>{{ headlineText }}</slot>
                            <!-- end slot -->
                         </span>
                    </component>
                </template>
                <component v-else-if="headlineText" :is="headlineTag">
                    <!-- begin slot -->
                    <slot>{{ headlineText }}</slot>
                    <!-- end slot -->
                </component>
            </template>

            <!-- begin show placeholder if no image exists (and component is not edited) -->
            <button v-else-if="componentActive" type="button" class="button confirm" @click="onAddItem">
                <span class="icon-plus"></span>
                <span>Add new headline</span>
            </button>
            <!-- end show placeholder if no image exists (and component is not edited) -->
        </template>
    </EditComponentWrapper>
    <!-- end edit-mode -->
    <!-- end CmdHeadline ---------------------------------------------------------------------------------------- -->
</template>

<script>
import {h} from "vue"
import EditMode from "../mixins/EditMode.vue"
import {buildComponentPath, findEditComponentWrapper, updateHandlerProvider} from "../utils/editmode.js"

// renders its content with or without the surrounding div (a Fragment cannot be used as dynamic component: it ignores slots)
const HeadlineWrapper = (props, {slots}) => props.withoutWrapper ? slots.default?.() : h("div", props.wrapperAttributes, slots.default?.())
HeadlineWrapper.props = ["withoutWrapper", "wrapperAttributes"]

export default {
    name: "CmdHeadline",
    components: {HeadlineWrapper},
    mixins: [EditMode],
    inject: {
        editModeContext: {
            default: null
        }
    },
    data() {
        return {
            editableHeadlineText: null,
            editablePreHeadlineText: null
        }
    },
    props: {
        /**
         * text for headline
         */
        headlineText: {
            type: String,
            required: false
        },
        /**
         * level for headline
         */
        headlineLevel: {
            type: [String, Number],
            default: "2"
        },
        /**
         * set highlight-level for headline
         * 
         * @allowedValues: null, "primary", "secondary", "tertiary"
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
         * small pre-headline-text above main-headline
         *
         * @canContainHtml: true
         */
        preHeadlineText: {
            type: String,
            required: false
        },
        /**
         * text-alignment (has no effect if icon is used)
         *
         * @allowedValues: "left", "center", "right"
         */
        textAlign: {
            type: String,
            required: false,
            validator(value) {
                return value === "left" ||
                    value === "center" ||
                    value === "right"
            }
        },
        /**
         * properties for CmdIcon-component to show icon before headline
         */
        cmdIcon: {
            type: Object,
            required: false
        },
        /**
         * renders the headline-tag without the surrounding div.cmd-headline (needed where a div is not allowed as parent,
         * i.e. inside <summary>, which only permits phrasing content and headings as children)
         */
        withoutWrapper: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        wrapperAttributes() {
            return this.withoutWrapper ? undefined : {class: ['cmd-headline', {'has-pre-headline-text': this.preHeadlineText, 'has-icon': this.cmdIcon?.iconClass}]}
        },
        componentActive() {
            return this.editModeContext?.system.isActiveComponent(buildComponentPath(findEditComponentWrapper(this)))
        },
        headlineComponentPath() {
            return this.componentPath || ["props", "cmdHeadline"]
        },
        headlineTag() {
            if (this.headlineLevel) {
                return "h" + this.headlineLevel
            }
            return ""
        },
        headlineTextAlign() {
            if (this.textAlign) {
                switch (this.textAlign) {
                    case "right":
                        return "justify-content-flex-end"
                    case "center":
                        return "justify-content-center"
                    default:
                        return "justify-content-flex-start"
                }
            }
            return ""
        }
    },
    methods: {
        updateHandlerProvider() {
            const headlineText = this.editableHeadlineText
            const preHeadlineText = this.editablePreHeadlineText
            const headlineLevel = this.headlineLevel

            return updateHandlerProvider(this, {
                update(props) {
                    props.headlineText = headlineText
                    props.preHeadlineText = preHeadlineText
                    props.headlineLevel = headlineLevel
                }
            })
        },
        onAddItem() {
            // execute editComponent-function from editComponentWrapper to enter editMode directly on "add"
            this.$refs.editComponentWrapper.editComponent()
        }
    },
    watch: {
        headlineText: {
            handler() {
                this.editableHeadlineText = this.headlineText
            },
            immediate: true
        },
        preHeadlineText: {
            handler() {
                this.editablePreHeadlineText = this.preHeadlineText
            },
            immediate: true
        }
    }
}
</script>

<style>
/* begin cmd-headline ------------------------------------------------------------------------------------------ */
.cmd-headline {
    margin-bottom: var(--headline-margin-bottom);
    gap: calc(var(--default-gap) / 2);

    &.has-pre-headline-text {
        text-align: inherit;

        > *:first-child {
            display: flex;
            align-items: flex-start;

            span[class*="icon"] {
                bottom: .2rem;
            }
        }

        &.text-center {
            > *:first-child {
                justify-content: center;
            }
        }

        &.text-right {
            > *:first-child {
                justify-content: flex-end;
            }
        }

        &.text-right > * {
            text-align: right;
        }

        &:has(h1) span[class*="icon"] {
            font-size: calc(var(--headline-font-size-h1) * 1.6);
        }

        &:has(h2) span[class*="icon"] {
            font-size: calc(var(--headline-font-size-h2) * 1.8);
        }

        &:has(h3) span[class*="icon"] {
            font-size: calc(var(--headline-font-size-h3) * 1.9);
        }

        &:has(h4) span[class*="icon"] {
            font-size: calc(var(--headline-font-size-h4) * 2);
        }

        &:has(h5) span[class*="icon"] {
            font-size: calc(var(--headline-font-size-h5) * 2.1);
        }

        &:has(h6) span[class*="icon"] {
            font-size: calc(var(--headline-font-size-h6) * 2.2);
        }

        .pre-headline-text-wrapper {
            display: flex;
            flex-direction: column;
        }

        .pre-headline-text {
            font-size: var(--default-font-size);
            font-weight: var(--font-weight-normal);
            line-height: 1;
        }

        &:has(h4, h5, h6) .pre-headline-text {
            font-size: var(--font-size-small);
        }

        &.has-icon {
            h1, h2, h3, h4, h5, h6 {
                display: flex;
                align-items: center;
            }

            &.text-center {
                justify-content: center;

                * {
                    text-align: left;
                }
            }

            &.text-right {
                justify-content: flex-end;

                * {
                    text-align: left;
                }
            }
        }
    }

    span[class*="text-align"] {
        display: block;
    }

    h1, h2, h3, h4, h5, h6 {
        margin: 0;

        &:only-child {
            flex: none;
            width: 100%;
        }
    }
}

.edit-mode label.headline {
    input {
        padding: 0;
        height: auto;
        font-weight: var(--headline-font-weight);
    }

    &.h1 input {
        font-size: var(--headline-font-size-h1);
        text-transform: var(--headline-text-transform);
    }

    &.h2 input {
        font-size: var(--headline-font-size-h2);
    }

    &.h3 input {
        font-size: var(--headline-font-size-h3);
    }

    &.h4 input {
        font-size: var(--headline-font-size-h4);
    }

    &.h5 input {
        font-size: var(--headline-font-size-h5);
    }

    &.h6 input {
        font-size: var(--headline-font-size-h6);
    }
}

/* end cmd-headline ------------------------------------------------------------------------------------------ */
</style>
