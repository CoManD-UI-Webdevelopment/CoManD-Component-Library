<template>
    <!-- begin CmdSection ---------------------------------------------------------------------------------------- -->
    <section :class="['cmd-section flex-container', {box: styleAsBox, 'vertical': orientation === 'vertical'}]">
        <!-- begin CmdHeadline -->
        <CmdHeadline
            v-if="cmdHeadline?.headlineText"
            v-bind="cmdHeadlineProperties"
        />
        <!-- end CmdHeadline -->

        <!-- begin content provided by property -->
        <div v-if="content && !useSlot" v-html="content"></div>
        <!-- end content provided by property -->

        <!-- begin slot -->
        <slot v-else></slot>
        <!-- end slot -->
    </section>
    <!-- end CmdSection ---------------------------------------------------------------------------------------- -->
</template>

<script>
export default {
    name: "CmdSection",
    props: {
        /**
         * provide content for section
         */
        content: {
            type: String,
            required: false
        },
        /**
         * define if (default) slot should be used
         */
         useSlot: {
            type: Boolean,
            default: false
        },
        /**
         * set if section should be styled as box
         */
         styleAsBox: {
            type: Boolean,
            default: false
        },
        /**
         * set orientation for content
         * 
         * @allowedValues: horizontal, vertical
         */
         orientation: {
            type: String,
            default: "vertical"
        },
        /**
         * set properties for CmdHeadline-component
         * 
         * @requiredForAccessibility: true
         */
        cmdHeadline: {
            type: Object,
            default: false
        }
    },
    computed: {
        cmdHeadlineProperties() {
            return {
                headlineLevel: 2,
                ...this.cmdHeadline
            }
        }
    }
}
</script>

<style>
.cmd-section {
    &:not(.box) {
        padding: 0;
    }
}
</style>
