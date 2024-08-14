<template>
    <!-- begin CmdLink -->
    <!-- begin href -->
    <a v-if="linkType === 'href'" :href="path" :target="target" :class="['cmd-link', {'button': styleAsButton, 'primary': primaryButton}]" @click.prevent="emitClick($event, 'href')">
        <span v-if="icon.iconClass && icon.position !== 'right'" :class="icon.iconClass" :title="icon.tooltip"></span>
        <span v-if="text">{{ text }}</span>
        <span v-if="icon.iconClass && icon.position === 'right'" :class="icon.iconClass" :title="icon.tooltip"></span>
    </a>
    <!-- end href -->

    <!-- begin router -->
    <router-link v-else-if="linkType === 'router'" :to="path" :class="['cmd-link', {'button': styleAsButton, 'primary': primaryButton}]" @click.prevent="emitClick($event, 'router')">
        <span v-if="icon.iconClass && icon.position !== 'right'" :class="icon.iconClass" :title="icon.tooltip"></span>
        <span v-if="text">{{ text }}</span>
        <span v-if="icon.iconClass && icon.position === 'right'" :class="icon.iconClass" :title="icon.tooltip"></span>
    </router-link>
    <!-- end router -->

    <!-- begin button -->
    <button v-else-if="linkType === 'button'" :class="['cmd-link button', {'primary': primaryButton}]" type="submit" @click.prevent="emitClick($event, 'button')">
        <span v-if="icon.iconClass && icon.position !== 'right'" :class="icon.iconClass" :title="icon.tooltip"></span>
        <span v-if="text">{{ text }}</span>
        <span v-if="icon.iconClass && icon.position === 'right'" :class="icon.iconClass" :title="icon.tooltip"></span>
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
                    value === "button"
            }
        },
        /**
         * set a path
         * 
         * linkType-property must be 'href', 'router'
         */
        path: {
            type: String,
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
         * activate if button should be styled as primary-button
         *
         * (type must be 'button' or styleAsButton-property must be activated)
         */
        primaryButton: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        emitClick(event, linkType) {
            this.$emit('click', {originalEvent: event, linkType: linkType})
        }
    }
}
</script>

<style>
.cmd-link {
    span[class*="icon"]:not(:only-child) {
        font-size: 1rem;
    }
}
</style>