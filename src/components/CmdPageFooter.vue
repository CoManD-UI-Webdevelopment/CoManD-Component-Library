<template>
    <footer :class="['cmd-page-footer flex-container', {'small-buttons': useSmallButtons}]">
        <!-- begin CmdSocialNetworks -->
        <CmdSocialNetworks v-if="cmdSocialNetworks" v-bind="cmdSocialNetworks">
            <!-- begin named slot for cmd-social-networks -->
            <slot name="cmd-social-networks"></slot>
            <!-- end named slot for cmd-social-networks -->
        </CmdSocialNetworks>
        <!-- end CmdSocialNetworks -->
        <div class="button-wrapper">
            <!-- begin slot-content -->
            <slot></slot>
            <!-- end slot-content -->

            <!-- begin button print-preview -->
            <button
                v-if="buttonPrintViewOptions?.show"
                :class="['button', {'primary': buttonPrintViewOptions.primary}]"
                :title="buttonPrintViewOptions.text ? buttonPrintViewOptions.icon?.tooltip : null"
                @click="showFancyBox"
            >
                <span v-if="buttonPrintViewOptions.icon?.show" :class="buttonPrintViewOptions.icon?.iconClass"></span>
                <span v-if="buttonPrintViewOptions.text">{{buttonPrintViewOptions.text}}</span>
            </button>
            <!-- end button print-preview -->
        </div>
    </footer>
</template>

<script>
import { openFancyBox } from "./CmdFancyBox.vue"

export default {
    name: "CmdPageFooter",
    props: {
        /**
         * define button for print-preview
         */
        buttonPrintView: {
            type: Object,
            default() {
                return {
                    show: true,
                    primary: false,
                    icon: {
                        show: true,
                        iconClass: "icon-print-preview",
                        tooltip: "Open print preview"
                    },
                    text: "Print preview"
                }
            }
        },
        /**
         * activate to use small buttons
         */
        useSmallButtons: {
            type: Boolean,
            default: true
        },
        /**
         * properties for CmdSocialNetworks-component
         */
        cmdSocialNetworks: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdFancyBox-component
         */
        cmdFancyBox: {
            type: Object,
            default() {
                return {
                    showPrintButtons: true,
                    defaultAriaLabelText: "print-preview"
                }
            }
        }
    },
    computed: {
        buttonPrintViewOptions() {
            const defaultOptions = {
                show: true,
                primary: false,
                icon: {
                    show: true,
                    iconClass: "icon-print-preview",
                    tooltip: "Open print preview"
                },
                text: "Print preview",
            }

            return { ...defaultOptions, ...this.buttonPrintView, icon: { ...defaultOptions.icon, ...this.buttonPrintView?.icon } }
        }
    },
    methods: {
        showFancyBox() {
            let elements = []
            if(typeof this.cmdFancyBox.elements === "function") {
                elements = this.cmdFancyBox.elements()
            } else {
                elements = [document.querySelector("main")]
            }

            openFancyBox({
                elements: elements,
                showPrintButtons: this.cmdFancyBox.showPrintButtons,
                defaultAriaLabelText: this.cmdFancyBox.defaultAriaLabelText,
                cmdHeadline: this.cmdFancyBox.cmdHeadline,
                showOverlay: this.cmdFancyBox.showOverlay,
                showSubmitButtons: this.cmdFancyBox.showSubmitButtons,
                allowEscapeKey: this.cmdFancyBox.allowEscapeKey
            })
        }
    }
}
</script>

<style>
/* begin cmd-page-footer -------------------------------------------------------------------------------------------- */
.cmd-page-footer {
    margin-top: auto; /* keep page-footer at bottom if parent is (vertical) flex-container */
    align-items: flex-end;

    &.small-buttons {
        button, .button {
            padding: var(--button-padding-small);
            min-height: var(--button-min-height-small);

            span {
                font-size: var(--font-size-small);
            }
        }
    }

    .cmd-social-networks {
        container-type: normal !important; /* do not set to 'inline-size' to avoid to be stretched vertically on small devices */
    }

    > .button-wrapper {
        flex-direction: row;
        justify-content: flex-end;
        margin-left: auto;
        gap: calc(var(--default-gap) / 2);
        flex: none;
    }
}
/* end cmd-page-footer -------------------------------------------------------------------------------------------- */
</style>

<style lang="scss">
@import "../assets/styles/variables";

@media only screen and (max-width: $small-max-width) {
    .cmd-page-footer {
        align-items: flex-start;

        > .button-wrapper {
            margin-left: 0;
        }
    }
}
</style>