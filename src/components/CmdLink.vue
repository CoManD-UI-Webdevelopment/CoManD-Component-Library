<template>
    <!-- begin CmdLink -->
    <!-- begin href -->
    <a v-if="linkType === 'href'"
       :href="!disabled ? path : null"
       :target="target"
       :class="['cmd-link', {'button': styleAsButton, 'primary': primaryButton, 'disabled': disabled, 'box': styleAsBox, 'fancybox': fancybox}]"
       @click.prevent="emitClick($event, 'href')"
       :title="icon?.tooltip"
    >
        <!-- begin CmdInnterLink -->
        <CmdInnerLink :text="text" :icon="icon" :image="image">
            <!-- begin slot-content of CmdInnterLink -->
            <slot></slot>
            <!-- end slot-content of CmdInnterLink -->
        </CmdInnerLink>
        <!-- end CmdInnterLink -->
    </a>
    <!-- end href -->

    <!-- begin router-link -->
    <router-link v-else-if="linkType === 'router'" 
        :to="!disabled ? path : {}" 
        :class="['cmd-link', {'button': styleAsButton, 'primary': primaryButton, 'disabled': disabled, 'box': styleAsBox, 'fancybox': fancybox}]" 
        @click="emitClick($event, 'router')" 
        :title="icon?.tooltip">
        <!-- begin CmdInnterLink -->
        <CmdInnerLink :text="text" :icon="icon" :image="image">
            <!-- begin slot-content of CmdInnterLink -->
            <slot></slot>
            <!-- end slot-content of CmdInnterLink -->
        </CmdInnerLink>
        <!-- end CmdInnterLink -->
    </router-link>
    <!-- end router-link -->

    <!-- begin button -->
    <button v-else-if="linkType === 'button' || linkType === 'submit'" 
        :class="['cmd-link button', {'primary': primaryButton, 'disabled': disabled, 'box': styleAsBox, 'fancybox': fancybox}]" 
        type="submit"
        :disabled="disabled" 
        @click="emitClick($event, 'button')" 
        :title="icon?.tooltip"
        >
        <!-- begin CmdInnterLink -->
        <CmdInnerLink :text="text" :icon="icon" :image="image">
            <!-- begin slot-content of CmdInnterLink -->
            <slot></slot>
            <!-- end slot-content of CmdInnterLink -->
        </CmdInnerLink>
        <!-- end CmdInnterLink -->
    </button>
    <!-- end button -->
    <!-- end CmdLink -->
</template>

<script>
export default {
    name: "CmdLink",
    emits: ["click"],
    props: {
        /**
         * set type of link
         *
         * @allowedValues: 'href', 'router', 'button'
         */
        linkType: {
            type: String,
            default: "href",
            validator(value) {
                return value === "href" ||
                    value === "router" ||
                    value === "button" ||
                    value === "submit"
            }
        },
        /**
         * set a path
         * 
         * linkType-property must be 'href', 'router'
         */
        path: {
            type: [String, Object],
            default: "#"
        },
        /**
         * set target
         *
         * linkType-property must be set to 'href'
         */
        target: {
            type: String,
            default: ""
        },
        /**
         * icon to display
         */
        icon: {
            type: Object,
            default: {}
        },
        /**
         * displayed text
         */
        text: {
            type: String,
            default: ""
        },
        /**
         * toggle if link should be styled as button
         *
         * (type 'button' will always be styles as button)
         */
        styleAsButton: {
            type: Boolean,
            default: false
        },
        /**
         * toggle if link should be styled as box
         */
        styleAsBox: {
            type: Boolean,
            default: false
        },
        /**
         * activate if button should be styled as primary-button
         *
         * (type must be 'button' or styleAsButton-property must be activated)
         */
        primaryButton: {
            type: Boolean,
            default: false
        },
        /**
         * activate if link/button should be disabled
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * set if path should be opened in fancybox
         */
        fancybox: {
            type: Boolean,
            default: false
        },
        /**
         * set image for inner link
         */
        image: {
            type: Object,
            required: false
        }
    },
    methods: {
        emitClick(event, linkType) {
            this.$emit("click", {originalEvent: event, linkType: linkType})
        }
    }
}
</script>

<style>
/* begin cmd-link -------------------------------------------------------------------------------------------- */
.cmd-link {
    display: inline-flex;
    gap: var(--icon-and-text-gap);
    align-items: center;

    &.active, &.router-link-active:not(.button) {
        background: var(--button-primary-background-highlighted); /* overwrite background for active links/buttons */
        
        &.button {
            padding: var(--button-padding); /* overwrite padding for active links/buttons */
        }
    }

    img {
        max-height: 4rem;
        aspect-ratio: 1/1;
        border-radius: var(--full-circle);
        margin: 0;
    }

    span {
        margin: 0;
    }

    &.box {
        display: inline-flex;
        flex-direction: column;
        gap: calc(var(--default-gap) / 2);
        align-items: center;
        justify-content: center;
        border-color: var(--hyperlink-color);
        text-decoration: none;
        border-radius: var(--box-border-radius);

        span {
            margin: 0 auto;

            &[class*="icon"] {
                font-size: 4rem;
            }
        }

        &:hover, &:active, &:focus {
            border-color: var(--hyperlink-color-highlighted)M
        }
    }
}
/* end cmd-link -------------------------------------------------------------------------------------------- */
</style>