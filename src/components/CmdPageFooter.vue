<template>
    <div :class="['cmd-page-footer flex-container', {'small-buttons': useSmallButtons}]">
        <!-- begin button print-preview -->
        <button
            v-if="buttonPrintView.show"
            :class="['button', {'primary': buttonPrintView.primary}]"
            :title="buttonPrintView.text ? buttonPrintView.icon?.tooltip : null"
        >
            <span v-if="buttonPrintView.icon?.show" :class="buttonPrintView.icon?.iconClass"></span>
            <span v-if="buttonPrintView.text">{{buttonPrintView.text}}</span>
        </button>
        <!-- end button print-preview -->

        <!-- begin slot-content -->
        <slot></slot>
        <!-- end slot-content -->

        <!-- begin CmdSocialNetworks -->
        <CmdSocialNetworks v-if="cmdSocialNetworks" :networks="cmdSocialNetworks">
            <slot name="cmd-social-networks"></slot>
        </CmdSocialNetworks>
        <!-- end CmdSocialNetworks -->
    </div>
</template>

<script>
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
            type: Array,
            required: false
        }
    }
}
</script>

<style>
/* begin cmd-page-footer -------------------------------------------------------------------------------------------- */
.cmd-page-footer {
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
}
/* end cmd-page-footer -------------------------------------------------------------------------------------------- */
</style>