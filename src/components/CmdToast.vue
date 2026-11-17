<template>
    <!-- begin CmdToast ---------------------------------------------------------------------------------------- -->
    <div v-if="showToast" class="cmd-toast box flex-container flex-direction-column" role="status" :aria-live="ariaLive" aria-atomic="true">
        <header>
            <CmdHeadline v-if="(cmdHeadlineProperties?.show && cmdHeadlineProperties?.headlineText) || editModeContext"
                v-bind="cmdHeadlineProperties" />
            <CmdLink @click="close" :aria-label="cmdLinkCloseIconProperties?.icon?.tooltip"
                v-bind="cmdLinkCloseIconProperties" />
        </header>
        <slot>
            <CmdParagraph v-bind="cmdParagraphProperties" />
        </slot>
    </div>
    <!-- end CmdToast ---------------------------------------------------------------------------------------- -->
</template>

<script>
export default {
    name: 'CmdToast',
    emits: ["status-changed"],
    inject: {
        editModeContext: {
            default: null
        }
    },
    data() {
        return {
            showToast: false
        }
    },
    props: {
        /**
         * set aria-live-value for accessibility
         * 
         * @requiredForAccessibility
         */
        ariaLive: {
            tpye: String,
            default: "assertive",
            validator(value) {
                return value === "assertive" ||
                value === "alert"
            }
        },
        /**
         * message shown inside the toast
         */
        message: {
            type: String,
            required: true
        },
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdLink-component
         */
        cmdLinkCloseIcon: {
            type: Object,
            required: false
        },
                /**
         * properties for CmdParagraph-component
         * 
         * content will be set by "message"-property
         */
         cmdParagraph: {
            type: Object,
            required: false
        }
    },
    computed: {
        cmdHeadlineProperties() {
            return {
                show: true,
                headlineLevel: 6,
                headlineText: "Information",
                ...this.cmdHeadline
            }
        },
        cmdLinkCloseIconProperties() {
            return {
                icon: {
                    iconClass: "icon-cancel-circle",
                    tooltip: "Close Toast",
                },
                ...this.cmdLinkCloseIcon
            }
        },
        cmdParagraphProperties() {
            return {
                content: this.message,
                ...this.cmdParagraph
            }
        }
    },
    methods: {
        show() {
            this.showToast = true
        },
        close() {
            this.showToast = false
        },
        toggleToast() {
            this.showToast = !this.showToast
        }
    },
    watch: {
        showToast() {
            this.$emit("status-changed", this.showToast)
        }
    }
}
</script>

<style>
/* begin cmd-toast ---------------------------------------------------------------------------------------- */
.cmd-toast {
    position: fixed;
    right: 2rem;
    left: auto;
    top: auto;
    bottom: 7rem;
    z-index: 1000;
    gap: var(--gap-small);

    header {
        display: flex;
        align-items: center;

        .cmd-headline {
            margin: 0;
        }

        .cmd-link {
            margin-left: auto;
        }
    }
}

/* end cmd-toast ---------------------------------------------------------------------------------------- */
</style>