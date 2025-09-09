
<template>
    <div :class="['cmd-code-output', {box : styleAsBox}]" style="max-height: maxHeight">
        <a v-if="allowCopyByClick" href="#" @click.prevent="copyToClipboard()" :title="cmdIcon.tooltip">
            <!-- begin CmdIcon -->
            <CmdIcon :iconClass="cmdIcon.iconClass" :type="cmdIcon.iconType"/>
            <!-- end CmdIcon -->
        </a>
        <!-- begin preformatted code (keep in one line) -->
        <pre v-if="preformatted"><code ref="code">
            <slot></slot>
        </code></pre>
        <!-- end preformatted code (keep in one line) -->

        <!-- begin unformatted code -->
        <code v-else ref="code">
            <!-- begin slot-content -->
            <slot></slot>
            <!-- end slot-content -->
        </code>
        <!-- end unformatted code -->
    </div>
</template>

<script>
import { ref } from "vue"

export default {
    name: "CmdCodeOutput",
    props: {
        /**
         * preformat code (keeps spaces, tabs, and line breaks exactly as written)
         *
         * @affectsStyling: true
         */
         preformatted: {
            type: Boolean,
            default: true
        },
        /**
         * style component like a box
         *
         * @affectsStyling: true
         */
         styleAsBox: {
            type: Boolean,
            default: true
        },
        /**
         * enable if data can be copied by click on icon
         */
        allowCopyByClick: {
            type: Boolean,
            default: true
        },
        /**
         * set max-height (content will scroll vertically)
         */
         maxHeight: {
            type: String,
            default: "20rem"
        },
        /**
         * icon 'copy'
         *
         * @requiredForAccessibility: partial
         */
        cmdIcon: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-file-copy",
                    tooltip: "Copy data to clipboard!",
                    iconType: "auto"
                }
            }
        }
    },
    methods: {
        copyToClipboard() {
            // get data, remove spaces and copy to clipboard
            const code = this.$refs.code
            const output = code.innerText.replace(/\t/g, '    ')
            navigator.clipboard.writeText(output)
            alert(output + " was copied to clipboard")
        }
    }
}
</script>

<style>
    .cmd-code-output {
        overflow-y: scroll;

        &.box {
            padding-right: calc(var(--default-padding) * 3);

        }

        > a {
            position: absolute;
            top: var(--default-padding);
            right: var(--default-padding);
        }
    }
</style>