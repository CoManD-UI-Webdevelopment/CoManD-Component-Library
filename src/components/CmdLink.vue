<template>
    <!-- begin CmdLink -->
    <!-- begin href -->
    <a v-if="linkType === 'href'"
       :href="path"
       :target="target"
       :class="['cmd-link', {'button': styleAsButton, 'primary': primaryButton, 'box': styleAsBox, 'fancybox': fancybox}]"
       @click.prevent="emitClick($event, 'href')"
       :title="icon?.tooltip"
    >
        <CmdInnerLink :text="text" :icon="icon" :image="image">
            <slot></slot>
        </CmdInnerLink>
    </a>
    <!-- end href -->

    <!-- begin router-link -->
    <router-link v-else-if="linkType === 'router'" :to="path" :class="['cmd-link', {'button': styleAsButton, 'primary': primaryButton, 'box': styleAsBox, 'fancybox': fancybox}]" @click="emitClick($event, 'router')" :title="icon?.tooltip">
        <CmdInnerLink :text="text" :icon="icon" :image="image">
            <slot></slot>
        </CmdInnerLink>
    </router-link>
    <!-- end router-link -->

    <!-- begin button -->
    <button v-else-if="linkType === 'button' || linkType === 'submit'" :class="['cmd-link button', {'primary': primaryButton, 'box': styleAsBox, 'fancybox': fancybox}]" type="submit" @click="emitClick($event, 'button')" :title="icon?.tooltip">
        <CmdInnerLink :text="text" :icon="icon" :image="image">
            <slot></slot>
        </CmdInnerLink>
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
         * linkType must be 'href'
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
         * set if path should be opened in fancybox
         */
        fancybox: {
            type: Boolean,
            default: false
        },
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
    display: flex;
    gap: calc(var(--default-gap) / 2);
    align-items: center;

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