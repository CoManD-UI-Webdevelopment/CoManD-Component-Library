<template>
    <div class="cmd-site-footer site-footer">
        <footer :class="['flex-container', {vertical: orientation === 'vertical'}]">
            <slot></slot>
        </footer>
    </div>
</template>

<script>
export default {
    name: "CmdSiteFooter",
    props: {
        /**
         * set to vertical if items inside should be arranged vertically
         *
         * @allowedValues: horizontal, vertical
         */
        orientation: {
            type: String,
            default: "horizontal",
            validator(value) {
                return value === "horizontal" ||
                    value === "vertical"
            }
        }
    }
}
</script>

<style>
/* begin cmd-site-footer ---------------------------------------------------------------------------------------- */
.cmd-site-footer {
    padding: var(--grid-gap) 0;
    margin-top: auto;
    flex: none;

    footer {
        max-width: var(--max-width);
        width: 100%; /* stretch flex-item */
        margin: 0 auto;
        padding: 0 var(--default-padding);
    }

    &.sticky {
        top: auto;
        bottom: 0;
    }

    .cmd-switch-language {
        width: 100%;
        flex: none;
    }

    + .cmd-copyright-information {
        margin-top: 0;
    }
}
</style>

<style lang="scss">
@import '../assets/styles/variables';

@media only screen and (max-width: $medium-max-width) {
    .cmd-site-footer {
        footer {
            li {
                margin-bottom: calc(var(--default-margin) * 2);
            }
        }

        @media only screen and (max-width: $small-max-width) {
            a {
                text-decoration: underline;

                &:active {
                    text-decoration: none;
                }
            }

            h4, h5, h6 {
                margin-top: var(--default-margin);
            }
        }
    }
}

/* end cmd-site-footer ---------------------------------------------------------------------------------------- */
</style>