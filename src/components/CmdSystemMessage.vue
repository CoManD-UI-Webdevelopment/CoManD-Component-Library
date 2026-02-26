<template>
    <!-- begin CmdSystemMessage ---------------------------------------------------------------------------------------- -->
    <transition :name="transition">
        <div
            v-if="showSystemMessage"
            :class="['cmd-system-message', 'system-message', 'flex-container', 'flex-direction-column', { 'full-width': fullWidth }, systemMessageTextAlign, validationStatus]"
            :role="validationStatus === 'error' ? 'alert' : 'dialog'"
            :aria-labelledby="ariaId"
        >
            <!-- begin slot-content -->
            <slot>
                <!-- begin CmdHeadline -->
                <CmdHeadline
                    class="message-headline"
                    :cmdIcon="headlineIcon"
                    :headlineText="systemMessage"
                    :headlineLevel="messageHeadlineLevel"
                    :textAlign="textAlign"
                    :id="ariaId"
                />
                <!-- end CmdHeadline -->
            </slot>
            <!-- end slot-content -->

            <!-- begin close-icon -->
            <a
                v-if="iconClose.show && iconClose.iconClass"
                href="#"
                class="close-button"
                @click.prevent="hideSystemMessage"
                :title="iconClose.tooltip"
            >
                <!-- begin CmdIcon -->
                <CmdIcon :iconClass="iconClose.iconClass" :type="iconClose.iconType" />
                <!-- end CmdIcon -->
            </a>
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
    data() {
        return {
            showSystemMessage: true,
            ariaId: this.ariaReferenceId || this.buildHtmlId("system-message") // mixin requires id to be defined
        }
    },
    props:  {
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
         * set icon-class for message (will be displayed left from message)
         */
        iconMessage: {
            type: Object,
            default: function() {
                return {
                    show: true,
                    iconClass: "icon-warning",
                    type: "auto"
                }
            }
        },
        /**
         * the system-message-text
         */
        systemMessage: {
            type: String,
            required: false
        },
        /**
         * set headline-level for system-message (given to CmdHeadline-component)
         */
        messageHeadlineLevel: {
            type: [Number, String],
            default() {
                return 6
            }
        },
        /**
         * icon to close system-message
         *
         * @requiredForAccessibility: partial
         */
        iconClose: {
            type: Object,
            default() {
                return {
                    show: true,
                    iconClass: "icon-cancel-circle",
                    tooltip: "Close this message"
                }
            }
        }
    },
    computed: {
        headlineIcon() {
            if(this.iconMessage.show) {
                return {
                    iconClass: this.iconMessage.iconClass,
                    type: this.iconMessage.type
                }
            }
            return null
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
            return ""
        }
    },
    methods: {
        hideSystemMessage(event) {
            this.showSystemMessage = false
            this.$emit("hideSystemMessage", event)
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
    align-self: flex-start; /* if used in flex-container component should not be stretched */

    .message-headline {
        margin: 0; /* overwrite default-settings from frontend-framework */
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

    > a.close-button {
        display: flex;
        position: absolute;
        width: auto; /* avoids stretching by flex-containers */
        top: .5rem;
        right: .5rem;
        text-decoration: none;
        z-index: 10;
        line-height: 1;
        background: var(--color-white);
        border-radius: var(--full-circle);

        [class*="icon-"] {
            color: var(--default-text-color);
        }

        &:hover, &:active, &:focus {
            background: none;

            [class*="icon-"] {
                color: var(--color-white);
            }
        }
    }

    &.warning {
        > a.close-button {
            border-color: var(--default-text-color);

            [class*="icon-"] {
                color: var(--default-text-color);
            }

            &:hover, &:active, &:focus {
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
