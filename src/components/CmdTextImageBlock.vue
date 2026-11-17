<template>
    <!-- begin CmdTextImageBlock ---------------------------------------------------------------------------------------- -->
    <div :class="['cmd-text-image-block flex-container', orientation]">
        <slot>
            <CmdHeadline
                v-if="((cmdHeadlineProperties?.show && cmdHeadlineProperties?.headlineText) || editModeContext) && (headlinePosition === 'aboveImage' && orientation === 'vertical')"
                v-bind="cmdHeadlineProperties"
            />

            <CmdImage
                v-if="cmdImageProperties.show"
                v-bind="cmdImageProperties"
                :editModeConfig="{allowAddItem: false}"
            />

            <div v-if="!editModeContext" class="flex-container vertical" :class="setInnerClass">
                <CmdHeadline
                    v-if="((cmdHeadlineProperties?.show && cmdHeadlineProperties?.headlineText) || editModeContext) && (headlinePosition === 'belowImage' && orientation === 'horizontal')"
                    v-bind="cmdHeadlineProperties"
                />

                <!-- begin continuous text -->
                <CmdParagraph v-if="cmdParagraphProperties.show" v-bind="cmdParagraphProperties" />
                <!-- end continuous text -->
            </div>
        </slot>
        
        <!-- begin edit-mode -->
        <EditComponentWrapper
            v-if="editModeContext"
            ref="editComponentWrapper"
            class="edit-items"
            :showComponentName="false"
            :allowedComponentTypes="[]"
            :componentProps="{htmlContent, textAlign}"
            :componentPath="paragraphComponentPath"
            :allowDeleteComponent="!!htmlContent"
        >
            <template v-slot="slotProps">
                <textarea v-if="slotProps.editing" :class="['edit-mode', textAlign]" v-model="editableHtmlContent" placeholder="Paragraph"></textarea>
                <div v-else-if="htmlContent" v-html="htmlContent" :class="textAlign"></div>
                <!-- begin show placeholder if no image exists (and component is not edited) -->
                <button v-else type="button" class="button confirm" @click="onAddItem">
                    <span class="icon-plus"></span>
                    <span>Add new paragraph</span>
                </button>
                <!-- end show placeholder if no image exists (and component is not edited) -->
            </template>
        </EditComponentWrapper>
        <!-- end edit-mode -->
    </div>
    <!-- end CmdTextImageBlock ---------------------------------------------------------------------------------------- -->
</template>

<script>
// import mixins (editMode only)
import EditMode from "../mixins/EditMode.vue"

// import utils (editMode only)
import {updateHandlerProvider} from "../utils/editmode.js"

export default {
    name: "CmdTextImageBlock",
    mixins: [EditMode],
    inject: {
        editModeContext: {
            default: null
        }
    },
    data() {
        return {
            editableHtmlContent: null
        }
    },
    props: {
        /**
         * orientation for entire component
         *
         * @allowedValues: "vertical", "horizontal"
         */
        orientation: {
            type: String,
            default: "vertical",
            validator(value) {
                return value === "vertical" ||
                value === "horizontal"
            }
        },
        /**
         * set text-align for content
         * 
         * @allowedValues: "left", "center", "right"
         */
         textAlign: {
            type: String,
            default: "left",
            validator(value) {
                return value === "left" ||
                value === "center" ||
                value === "right"
            }
         },
        /**
         * specify class for inner content
         */
        innerClass: {
            type: String,
            required: false
        },
        /**
         * position for headline
         *
         * @allowedValues: "aboveImage", "belowImage"
         */
        headlinePosition: {
            type: String,
            default: "aboveImage",
            validator(value) {
                return value === "aboveImage" ||
                    value === "belowImage"
            }
        },
        /**
         * property for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        },
        /**
         * property for CmdImage-component
         */
        cmdImage: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdParagraph-component
         *
         * @canContainHtml: true
         */
         cmdParagraph: {
            type: Object,
            required: false
        },
        /**
         * editMode only
         */
        editModeContextData: {
            type: Object
        }
    },
    computed: {
        cmdHeadlineProperties() {
            return {
                show: true,
                headlineLevel: 2,
                ...this.cmdHeadline
            }
        },
        cmdImageProperties() {
            return {
                show: true,
                ...this.cmdImage
            }
        },
        cmdParagraphProperties() {
            return {
                show: true,
                ...this.cmdParagraph
            }
        },
        /**
         * html-content of the paragraph (only used in edit-mode)
         */
        htmlContent() {
            return this.cmdParagraph?.content
        },
        paragraphComponentPath() {
            /*  because paragraph is no component on its own, besides the componentPath (for the property),
             an additional flag (here $isComponent-key) is used to let the store identify this edge case.
             the '$'-prefix is set to ensure that the flag is not a generic name, that potentially is used as a property-name in any component */
            return  [{componentPath: ["props", "cmdParagraph", "content"], $isComponent: false}]
        },
        setInnerClass() {
            return "inner-text-wrapper " + this.textAlign + " " + (this.innerClass || "")
        }
    },
    methods: {
        onAddItem() {
            // execute editComponent-function from editComponentWrapper to enter editMode directly on "add"
            this.$refs.editComponentWrapper.editComponent()
        },
        addHandlerProvider() {
            return ""
        },
        updateHandlerProvider() {
            const htmlContent = this.editableHtmlContent
            this.editableHtmlContent = null // reset data-property

            return updateHandlerProvider(this, {
                update(props) {
                    props.cmdParagraph = {...props.cmdParagraph, content: htmlContent}
                }
            })
        }
    },
    watch: {
        htmlContent: {
            handler() {
                this.editableHtmlContent = this.htmlContent
            },
            immediate: true
        }
    }
}
</script>

<style>
/* begin cmd-text-image-block ---------------------------------------------------------------------------------------- */
.cmd-text-image-block {
    > .flex-container {
        gap: calc(var(--default-gap) / 2);
    }
}

.edit-mode .cmd-text-image-block textarea {
    width: 100%;
}
/* end cmd-text-image-block ---------------------------------------------------------------------------------------- */
</style>
