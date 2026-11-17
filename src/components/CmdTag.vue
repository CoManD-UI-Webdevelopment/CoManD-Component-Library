<template>
    <!-- begin CmdTag ---------------------------------------------------------------------------------------- -->
    <small v-if="showTag" :class="['cmd-tag tag', highlightLevel]" ref="tag">
        <slot>
            <span>{{ tagText }}</span>
            <CmdLink v-if="userCanRemoveTagByClick" v-bind="cmdLinkRemoveTagProperties" @click="removeTag" />
        </slot>
    </small>
    <!-- end CmdTag ---------------------------------------------------------------------------------------- -->
</template>

<script>
export default {
    name: "CmdTag",
    emits: ["click"],
    data() {
        return {
            showTag: true
        }
    },
    props: {
        /**
         * the displayed text of the tag
         */
        tagText: {
            type: String,
            required: true
        },
        /**
         * enable removing the tag by click
         */
        userCanRemoveTagByClick: {
            type: Boolean,
            default: false
        },
        /**
         * set highlight-level for tag
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
         * properties for CmdLink-component
         */
        cmdLinkRemoveTag: {
            type: Object,
            required: false
        }
    },
    computed: {
        cmdLinkRemoveTagProperties() {
            return {
                icon: {
                    iconClass: "icon-cancel-circle",
                    tooltip: "Remove tag",
                },
                ...this.cmdLinkRemoveTag
            }
        }
    },
    methods: {
        removeTag() {
            const event = {
                prevented: false,
                preventDefault() {
                    this.prevented = true
                }
            }

            this.$emit("click", event)

            if (!event.prevented) {
                this.showTag = false
            }
        }
    }
}
</script>

<style>
/* begin cmd-tag ------------------------------------------------------------------------------------------ */
.cmd-tag {
    align-self: start;
    /* if used in vertical flex-container */
    gap: var(--gap-small);

    >span:only-child {
        margin: 0 auto;
    }

    &.primary,
    &.secondary,
    &.tertiary {
        span[class*="icon-"] {
            color: var(--tag-text-color);
        }
    }
}

/* end cmd-tag ------------------------------------------------------------------------------------------ */
</style>