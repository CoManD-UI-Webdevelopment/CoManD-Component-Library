<template>
    <a href="#"
       @click.prevent
       :class="['cmd-slide-button', 'button', 'keep-behavior-on-small-devices', slideButtonType]"
       :title="getDirection.tooltip">
        <!-- begin CmdIcon -->
        <CmdIcon :type="getDirection.iconType || 'auto'" :iconClass="getDirection.iconClass || 'right'" />
        <!-- end CmdIcon -->
    </a>
</template>

<script>
import I18n from "../mixins/I18n.js"
import DefaultMessageProperties from "../mixins/CmdSlideButton/DefaultMessageProperties.js"

export default {
    name: "CmdSlideButton",
    mixins: [I18n, DefaultMessageProperties],
    props: {
        /**
         * set slide-button-type
         *
         * @allowedValues: right, left, up, down
         * @affectsStyling: true
         */
        slideButtonType: {
          type: String,
          default: "right",
            validator(value) {
                return value === "right" ||
                    value === "left" ||
                    value === "up" ||
                    value === "down"
            }
        },
        /**
         * default slide-buttons
         *
         * @requiredForAccessibility: partial
         */
        slideButtons: {
            type: Object,
            required: false
        }
    },
    computed: {
        slideButtonsDefault() {
            return {
                left: {
                    iconClass: this.slideButtons?.left?.iconClass || "icon-chevron-one-stripe-left",
                    tooltip: this.getMessage('slide_buttons.tooltip.left') || "Previous"
                },
                right: {
                    iconClass: this.slideButtons?.right?.iconClass || "icon-chevron-one-stripe-right",
                    tooltip: this.getMessage('slide_buttons.tooltip.right') || "Next"
                },
                up: {
                    iconClass: this.slideButtons?.up?.iconClass || "icon-chevron-one-stripe-up",
                    tooltip: this.getMessage('slide_buttons.tooltip.up') || "Previous"
                },
                down: {
                    iconClass: this.slideButtons?.down?.iconClass || "icon-chevron-one-stripe-down",
                    tooltip: this.getMessage('slide_buttons.tooltip.down') || "Next"
                }
            }
        },
        getDirection() {
            if(this.slideButtonsDefault[this.slideButtonType]) {
                return this.slideButtonsDefault[this.slideButtonType]
            }
            console.warn("Property 'slideButtonType' does not match slideButtons-key")
            return {}
        }
    }
}
</script>

<style lang="scss">
/* begin cmd-slide-button ---------------------------------------------------------------------------------------- */
.cmd-slide-button {
    &.button {
        font-size: 2rem;
        z-index: 10;
        height: 100%;
        position: absolute;
        display: flex;
        justify-content: center;
        text-decoration: none;
        border: 0;
        outline: 0;

        span {
            align-self: center;
        }

        &.left {
            left: 0;
            top: 0;
        }

        &.right {
            right: 0;
            top: 0;
        }

        &.up, &.down {
            width: 100%;
            height: auto;
            left: 0;
            top: 0;
        }

        &.down {
            bottom: 0;
            top: auto;
        }
    }
}
</style>

<style lang="scss">
@import '../assets/styles/variables';

@media only screen and (max-width: $small-max-width) {
    .cmd-slide-button {
        &.button {
            width: auto; /* overwrite button-behavior for small-devices from frontend-framework */
        }
    }
}

/* end cmd-slide-button ------------------------------------------------------------------------------------------ */
</style>