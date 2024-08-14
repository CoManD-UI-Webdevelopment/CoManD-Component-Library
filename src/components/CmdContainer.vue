<template>
    <div class="cmd-container" :class="containerClass">
        <div v-if="contentAboveSlot" v-html="contentAboveSlot"></div>
        <slot></slot>
        <div v-if="contentBelowSlot" v-html="contentBelowSlot"></div>
    </div>
</template>

<script>
import EditMode from "../mixins/EditMode.vue"
export default {
    name: "CmdContainer",
    mixins: [EditMode],
    props: {
        /**
         * define html-content to display above slot-content
         */
        contentAboveSlot: {
            type: String,
            required: false
        },
        /**
         * define html-content to display below slot-content
         */
        contentBelowSlot: {
            type: String,
            required: false
        },
        /**
         * define container-type
         *
         * @allowedValues: "grid", "flex"
         */
        containerType: {
            type: String,
            required: false
        }
    },
    methods: {
        addHandlerProvider() {
            return ""
        }
    },
    computed: {
        containerClass() {
            let htmlClass = null
            switch(this.containerType) {
                case "grid":
                    htmlClass = "grid-container-create-columns"
                    break
                case "flex":
                    htmlClass = "flex-container vertical"
                    break
                default:
                    htmlClass = null
                    break
            }
            return htmlClass
        }
    }
}
</script>

<style>
.cmd-container {
    min-height: 5rem;
}
</style>
