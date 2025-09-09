<template>
    <ol :class="['cmd-multistep-form-progress-bar', {'use-gap': useGap, 'full-width': fullWidth}]">
        <li v-for="(step, index) in multisteps" :key="index" :class="{active : activeLink === index}">
            <!-- begin CmdLink -->
            <CmdLink
                :linkType="step.linkType"
                :class="['stretch-on-small-devices', activeLinkClass(step.linkTyp, index)]"
                :styleAsButton="usePrimaryButtons"
                :primaryButton="usePrimaryButtons"
                :path="step.path"
                :title="step.tooltip"
                :disabled="step.disabled"
                @click="clickedStep($event, index)"
            >
                <span v-if="showStepNumber" class="number">{{ index + 1 }}</span>
                <!-- begin CmdIcon -->
                <CmdIcon v-if="step.iconClass" :iconClass="step.iconClass" :type="step.iconType" />
                <!-- end CmdIcon -->
                <span v-if="step.text">{{ step.text }}</span>
            </CmdLink>
            <!-- end CmdLink -->
            <span v-if="index + 1 !== multisteps.length && useGap" :class="['separator', separatorIconClass]"></span>
        </li>
    </ol>
</template>

<script>
// import functions
import {getRoute} from "../utilities.js"

export default {
    emits: ["click"],
    name: "CmdMultistepFormProgressBar",
    data() {
        return {
            activeLink: 0
        }
    },
    props: {
        /**
         * toggle if steps should be stretched to full-width of parent container (else steps will be centered)
         */
        fullWidth: {
            type: Boolean,
            default: false
        },
        /**
         * toggle visibility of step-number in front/left of link-icon and -name
         */
        showStepNumber: {
            type: Boolean,
            default: false
        },
        /**
         * activate if step-buttons should be primary-buttons (linkType for steps must be "button" or styleAsButton-property must be activated=)
         */
        usePrimaryButtons: {
            type: Boolean,
            default: true
        },
        /**
         * list of multisteps
         */
        multisteps: {
            type: Array,
            required: true
        },
        /**
         * icon-class for separator shown between multisteps
         */
        separatorIconClass: {
            type: String,
            default() {
                return "icon-chevron-one-stripe-right"
            }
        },
        useGap: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        activeLinkClass(linkType, index) {
            if(this.activeLink === index) {
                if(linkType === "router") {
                    return "router-link-exact-active"
                } else {
                    return "active"
                }
            }
        },
        clickedStep(event, index) {
            this.activeLink = index;
            this.$emit("click", {event: event, index: index, stepPath: this.multisteps[index].path})
        },
        getRoute(step) {
            return getRoute(step)
        }
    }
}
</script>

<style>
/* begin cmd-multistep-form-progress-bar ---------------------------------------------------------------------------------------- */

.cmd-multistep-form-progress-bar {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    border-radius: var(--default-border-radius);

    &.full-width {
        justify-content: stretch;

        li {
            flex: 1 !important;
        }
    }

    &.use-gap {
        gap: calc(var(--default-gap) / 2);

        li {
            a:not(.button), a.active:not(.button) {
                border: 0;
                border-radius: inherit;

                :is(span, [class*="icon-"]) + [class*="icon-"]:last-child {
                    border: 0;
                    right: -1rem;
                    background: none;
                }
            }

            a {
                :is(span, [class*="icon-"]) + [class*="icon-"]:last-child {
                    color: var(--color-scheme-text-color) !important;
                }
            }

            .separator {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            &.active {
                .separator {
                    color: var(--color-scheme-text-color); /* overwrite icon-color inside active links */
                }
            }
        }
    }

    li {
        display: flex;
        flex: 1;
        list-style-type: none;
        margin: 0;
        gap: calc(var(--default-gap) / 2);

        &:first-child, &:first-child > a {
            border-top-left-radius: inherit;
            border-bottom-left-radius: inherit;
        }

        &:has(:not(.button)) {
            flex: none;

            &:is(:hover, :active, :focus) {
                span, span[class*="icon-"] {
                    color: var(--hyperlink-color);
                }
            }
        }

        a, button {
            display: flex;
            text-decoration: none;
            align-items: center;
            justify-content: center;
            width: 100%;

            &.button {
                flex: 1;
                max-height: none;
            }

            :is(span, [class*="icon-"]) {
                font-size: var(--icon-size-medium) !important;

                & + [class*="icon-"] {
                    &:last-child {
                        border: var(--default-border);
                        border-radius: var(--full-circle);
                        color: var(--color-scheme-text-color);
                        margin: 0;
                        position: absolute;
                        right: 0;
                        transform: translateX(50%);
                        padding: calc(var(--default-padding) / 2);
                        display: flex;
                        justify-content: center;
                        z-index: 1;

                        &::before {
                            font-size: var(--font-size-small);
                        }
                    }
                }
            }

            &:hover, &:active, &:focus {
                .number {
                    color: var(--hyperlink-color);
                }
            }

            .number {
                margin-right: calc(var(--default-margin) / 2);
                line-height: 100%;
                width: 2rem;
                height: 2rem;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: var(--full-circle);
                border: var(--default-border);
                background: var(--color-white);
                text-decoration: none !important;
                color: var(--primary-color);
            }
        }

        &:last-child {
            a {
                [class*="icon-"] {
                    &:last-of-type {
                        display: none;
                    }
                }
            }
        }

        &.active {
            a {
                background: var(--button-primary-background-highlighted);
            }

            .number {
                background: var(--primary-color);
                border-color: var(--color-white);
                color: var(--color-white) !important;
            }

            & ~ li {
                a {
                    &:hover, &:active, &:focus {
                        .number {
                            border-color: var(--hyperlink-color);
                        }
                    }
                }

                .number {
                    background: none;
                    border-color: var(--border-color);
                }
            }
        }
    }
}
</style>

<style lang="scss">
@import '../assets/styles/variables';

@media only screen and (width < #{$small-max-width}) {
    .cmd-multistep-form-progress-bar {
        flex-direction: column;

        li {
            width: 100%;
            flex-direction: column;

            a {
                width: 100% !important;

                :is(span, [class*="icon-"]) {
                    & + [class*="icon-"] {
                        &:last-child {
                            left: auto;
                            right: auto;
                            bottom: 0;
                            transform: translateY(50%);
                        }
                    }
                }
            }

            .separator {
                &::before {
                    transform: rotate(90deg);
                }
            }
        }
    }
}

/* end cmd-multistep-form-progress-bar ------------------------------------------------------------------------------------------ */
</style>
