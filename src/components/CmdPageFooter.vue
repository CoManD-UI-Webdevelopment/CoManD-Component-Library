<template>
    <!-- begin CmdPageFooter ---------------------------------------------------------------------------------------- -->
    <footer :class="['cmd-page-footer flex-container', {'small-buttons': useSmallButtons}]">
        <slot>
            <CmdSocialNetworks v-if="cmdSocialNetworks" v-bind="cmdSocialNetworks">
                <!-- begin named slot for cmd-social-networks -->
                <slot name="cmd-social-networks"></slot>
                <!-- end named slot for cmd-social-networks -->
            </CmdSocialNetworks>

            <div class="button-wrapper">
                <!-- begin slot-content -->
                <slot name="button-wrapper"></slot>
                <!-- end slot-content -->

                <!-- begin button print-preview -->
                <CmdLink
                    v-if="cmdLinkPrintViewProperties?.show"
                    v-bind="cmdLinkPrintViewProperties"
                    id="print-view-button"
                    @click="showFancyBox"
                />
                <!-- end button print-preview -->
            </div>
        </slot>
    </footer>
    <!-- end CmdPageFooter ---------------------------------------------------------------------------------------- -->
</template>

<script>
import { openFancyBox } from "./CmdFancyBox.vue"

export default {
    name: "CmdPageFooter",
    props: {
        /**
         * activate to use small buttons
         */
        useSmallButtons: {
            type: Boolean,
            default: true
        },
        /**
         * define container/selector to show in print-preview
         */
        containerToPrint: {
            type: String,
            default: "main"
        },
                /**
         * properties for CmdLink-component for print-preview
         */
         cmdLinkPrintView: {
            type: Object,
            required: false
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
            required: false
        }
    },
    computed: {
        cmdLinkPrintViewProperties() {
            return {
                show: false,
                linkType: "button",
                highlightLevel: null,
                icon: {
                    show: true,
                    iconClass: "icon-print-preview",
                    tooltip: "Open print preview"
                },
                text: "Print preview",
                ...this.cmdLinkPrintView
            }
        }
    },
    methods: {
        showFancyBox() {
            let elements = []
            if(typeof this.cmdFancyBox?.elements === "function") {
                elements = this.cmdFancyBox.elements()
            } else {
                elements = [document.querySelector(this.containerToPrint)]
            }

            openFancyBox({
                showPrintButtons: true,
                id: "print-preview",
                defaultAriaLabelText: "print-preview",
                ...this.cmdFancyBox,
                elements: elements
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
/* begin cmd-page-footer -------------------------------------------------------------------------------------------- */
@import "../assets/styles/variables";

@media only screen and (width <= $small-max-width) {
    .cmd-page-footer {
        align-items: flex-start;

        > .button-wrapper {
            margin-left: 0;

            #print-view-button {
                display: none;
            }
        }
    }
}
/* end cmd-page-footer -------------------------------------------------------------------------------------------- */
</style>