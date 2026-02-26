<template>
    <!-- begin CmdToast ---------------------------------------------------------------------------------------- -->
    <div v-if="showToast" class="cmd-toast box" role="status" aria-live="assertive" aria-atomic="true">
        <slot>
            <header>
                <CmdHeadline v-if="cmdHeadlineProps" v-bind="cmdHeadlineProps" />
                <a href="#" @click.prevent="close" :aria-label="cmdIconProps.tooltip">
                    <CmdIcon v-bind="cmdIconProps" />
                </a>
            </header>
            <p>{{ message }}</p>
        </slot>
    </div>
    <!-- end CmdToast ---------------------------------------------------------------------------------------- -->
</template>

<script>
export default {
    name: 'CmdToast',
    data() {
        return {
            showToast: false
        }
    },
    props: {
        /**
         * message shown inside the toast
         */
        message: {
            type: String,
            required: true
        },
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdIcon-component
         */
        cmdIcon: {
            type: Object,
            required: false
        }
    },
    computed: {
        cmdHeadlineProps() {
            return {
                headlineLevel: 6,
                headlineText: "Information",
                ...this?.cmdHeadline
            }
        },
        cmdIconProps() {
            return {
                iconClass: "icon-cancel",
                tooltip: "Close Toast",
                ...this?.cmdIcon
            }
        }
    },
    methods: {
        show() {
            this.showToast = true
        },
        close() {
            this.showToast = false
        },
        toggleToast() {
            this.showToast = !this.showToast
        }
    },
    watch: {
        showToast() {
            this.$emit("status-changed", this.showToast)
        }
    }
}
</script>

<style>
/* begin cmd-toast ---------------------------------------------------------------------------------------- */
.cmd-toast {
    position: fixed;
    right: 2rem;
    left: auto;
    top: auto;
    bottom: 7rem;
    z-index: 1000;

    header {
        display: flex;

        a {
            margin-left: auto;
        }
    }
}

/* end cmd-toast ---------------------------------------------------------------------------------------- */
</style>