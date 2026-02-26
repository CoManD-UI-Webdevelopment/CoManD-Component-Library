<template>
    <!-- begin CmdTag ---------------------------------------------------------------------------------------- -->
    <small v-if="showTag" :class="['cmd-tag tag', highlightLevel]" ref="tag">
        <slot>
            <span>{{ tagText }}</span>
            <a v-if="removeTagByClick" href="#" @click.prevent="removeTag">
                <!-- begin CmdIcon -->
                <CmdIcon v-bind="cmdIcon" />
                <!-- end CmdIcon -->
            </a>
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
         removeTagByClick: {
            type: Boolean,
            default: false
        },
        /**
         * set highlight-level for tag
         * 
         * @allowedValues: "none", "primary", "secondary", "tertiary"
         */
         highlightLevel: {
            type: String,
            default: "none",
            validator(value) {
                return value === "none" ||
                    value === "primary" ||
                    value === "secondary" ||
                    value === "tertiary"
            }
        },
        /**
         * properties for CmdIcon-component
         */
         cmdIcon: {
            type: Object,
            default: function () {
                return {
                    iconClass: "icon-cancel-circle",
                    tooltip: "Back to top",
                    iconType: "auto"
                }
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
    align-self: start; /* if used in vertical flex-container */
    gap: var(--default-gap-half);

    > span:only-child {
        margin: 0 auto;
    }

    &.primary, &.secondary, &.tertiary {
        span[class*="icon-"] {
            color: var(--color-white);
        }
    }
}
/* end cmd-tag ------------------------------------------------------------------------------------------ */
</style>