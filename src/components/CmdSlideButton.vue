<template>
    <a href="#"
       @click.prevent
       :class="['cmd-slide-button', 'button', 'keep-behavior-on-small-devices', slideButtonType]"
       :title="getDirection.tooltip">
        <!-- begin CmdIcon -->
        <CmdIcon :type="getDirection.iconType || 'auto'" :iconClass="getDirection.iconClass || 'next'" />
        <!-- end CmdIcon -->
    </a>
</template>

<script>
export default {
    name: "CmdSlideButton",
    props: {
        /**
         * set slide-button-type
         *
         * @allowedValues: next, prev, up, down
         * @affectsStyling: true
         */
        slideButtonType: {
          type: String,
          default: "next",
            validator(value) {
                return value === "next" ||
                    value === "prev" ||
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
            default: function() {
                return {
                    prev: {
                        iconClass: "icon-chevron-one-stripe-left",
                        tooltip: "Previous"
                    },
                    next: {
                        iconClass: "icon-chevron-one-stripe-right",
                        tooltip: "Next"
                    },
                    up: {
                        iconClass: "icon-chevron-one-stripe-up",
                        tooltip: "Previous"
                    },
                    down: {
                        iconClass: "icon-chevron-one-stripe-down",
                        tooltip: "Next"
                    }
                }
            }
        }
    },
    computed: {
        getDirection() {
            if(this.slideButtons[this.slideButtonType]) {
                return this.slideButtons[this.slideButtonType]
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

        &.prev {
            left: 0;
            top: 0;
        }

        &.next {
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