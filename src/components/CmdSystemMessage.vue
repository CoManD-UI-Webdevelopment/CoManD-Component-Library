<template>
    <!-- begin CmdSystemMessage ---------------------------------------------------------------------------------------- -->
    <transition :name="transition">
        <div v-if="showSystemMessage"
            :class="['cmd-system-message', 'system-message', 'flex-container', 'flex-direction-column', { 'full-width': fullWidth }, systemMessageTextAlign, validationStatus]"
            :role="validationStatus === 'error' ? 'alert' : 'dialog'" :aria-labelledby="ariaId">
            <!-- begin slot-content -->
            <slot>
                <!-- begin CmdHeadline -->
                <CmdHeadline 
                    class="message-headline" 
                    v-bind="cmdHeadlineProperties"
                    :id="ariaId" />
                <!-- end CmdHeadline -->
            </slot>
            <!-- end slot-content -->

            <!-- begin close-icon -->
            <CmdLink 
                v-if="cmdLinkCloseIconProperties.show" 
                v-bind="cmdLinkCloseIconProperties" 
                class="close-button"
                @click="hideSystemMessage" 
            />
            <!-- end close-icon -->
        </div>
    </transition>
    <!-- end CmdSystemMessage ---------------------------------------------------------------------------------------- -->
</template>

<script>
// import mixins
import Identifier from "../mixins/Identifier"

export default {
    name: "CmdSystemMessage",
    mixins: [Identifier],
    emits: ["hide-system-message"],
    data() {
        return {
            showSystemMessage: true,
            ariaId: this.ariaReferenceId || this.buildHtmlId("system-message") // mixin requires id to be defined
        }
    },
    props: {
        /**
         * set if user should be allowed to close the message (by close-icon)
         */
        allowUserToCloseMessage: {
            type: Boolean,
            default: true
        },
        /**
         * define the text-align for the system message (will be inherited to CmdHeadline in slot)
         * 
         * @allowedValues: "left", "center", "right"
         */
        textAlign: {
            type: String,
            default: "center",
            validator(value) {
                return value === "left" ||
                    value === "center" ||
                    value === "right"
            }
        },
        /** 
         * define the aria-reference-id for the system message (will be used as aria-labelledby)
         */
        ariaReferenceId: {
            type: String,
            required: false
        },
        /**
         * define the transition when system message disappears
         * 
         * @allowedValues: "none", "fade", "scroll" 
         */
        transition: {
            type: String,
            default: "fade"
        },
        /**
         * validation-status for the message-box
         *
         * @allowedValues: error, warning, success, info
         * @affectsStyling: true
         */
        validationStatus: {
            type: String,
            required: true,
            validator(value) {
                return value === "error" ||
                    value === "warning" ||
                    value === "success" ||
                    value === "info"
            }
        },
        /**
         * activate to stretch message-box as wide as parent container (else message-box is as wide as message (+ padding))
         */
        fullWidth: {
            type: Boolean,
            default: true
        },
        /**
         * the system-message-text
         */
        systemMessage: {
            type: String,
            required: false
        },
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdIcon-component shown before headline
         */
         cmdIconWarning: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-warning"
                }
            }
        },
        /**
         * icon to close system-message
         *
         * @requiredForAccessibility: partial
         */
        cmdLinkCloseIcon: {
            type: Object,
            required: false
        }
    },
    computed: {
        cmdHeadlineProperties() {
            return {
                show: true,
                headlineText: this.systemMessage,
                headlineLevel: 4,
                textAlign: this.textAlign,
                cmdIcon: this.cmdIconWarning,
                ...this.cmdHeadline
            }
        },
        cmdLinkCloseIconProperties() {
            return {
                show: this.allowUserToCloseMessage,
                highlightLevel: null,
                icon: {
                    iconClass: "icon-cancel-circle",
                    tooltip: "Close this message"
                },
                ...this.cmdLinkCloseIcon
            }
        },
        systemMessageTextAlign() {
            if (this.textAlign) {
                switch (this.textAlign) {
                    case "right":
                        return "align-items-flex-end"
                    case "center":
                        return "align-items-center"
                    default:
                        return "align-items-flex-start"
                }
            }
            return null
        }
    },
    methods: {
        hideSystemMessage(event) {
            this.showSystemMessage = false
            this.$emit("hide-system-message", event)
        }
    },
    watch: {
        message() {
            this.showSystemMessage = true
        }
    }
}
</script>

<style>
/* begin cmd-system-message ---------------------------------------------------------------------------------------- */
.cmd-system-message {
    display: inline-flex;
    margin: var(--default-margin) 0;
    align-self: flex-start;
    /* if used in flex-container component should not be stretched */

    .message-headline {
        margin: 0;
        /* overwrite default-settings from frontend-framework */
    }

    > :last-child {
        margin-bottom: 0;
    }

    ul {
        display: flex;
        flex-direction: column;

        li {
            margin-left: 0;
        }
    }

    >a.close-button {
        display: flex;
        position: absolute;
        width: auto;
        /* avoids stretching by flex-containers */
        top: var(--system-message-padding-top-bottom);
        right: calc(var(--system-message-padding-left-right) / 2);
        text-decoration: none;
        z-index: 10;
        line-height: 1;
        background: var(--color-white);
        border-radius: var(--full-circle);

        [class*="icon-"] {
            color: var(--default-text-color);
            font-size: var(--icon-size-large);
        }

        &:hover,
        &:active,
        &:focus {
            background: none;

            [class*="icon-"] {
                color: var(--color-white);
            }
        }
    }

    &.warning {
        >a.close-button {
            border-color: var(--default-text-color);

            [class*="icon-"] {
                color: var(--default-text-color);
            }

            &:hover,
            &:active,
            &:focus {
                border-color: var(--hyperlink-color);

                [class*="icon-"] {
                    color: var(--color-white);
                }
            }
        }
    }
}

/* end cmd-system-message ------------------------------------------------------------------------------------------ */
</style>
