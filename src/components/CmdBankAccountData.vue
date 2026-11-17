<template>
    <!-- begin CmdBankAccountData ---------------------------------------------------------------------------------------- -->
    <div :class="['cmd-bank-account-data', {box: styleAsBox}]">
        <slot>
            <CmdHeadline v-if="(cmdHeadlineProperties?.show && cmdHeadlineProperties?.headlineText) || editModeContext"
                v-bind="cmdHeadlineProperties" />

            <!-- begin account data -->
            <dl>
                <template v-for="(entry, index) in accountData" :key="index">
                    <dt>{{ entry.text }}</dt>

                    <!-- begin icon to copy data -->
                    <dd v-if="allowCopyByClick && entry.allowCopy">
                        <span>{{ entry.value }}</span>
                        <CmdLink 
                            @click="copyToClipboard(entry.value)"
                            v-bind="cmdLinkCopyDataProperties"
                        />
                    </dd>
                    <!-- end icon to copy data -->

                    <dd v-else :key="index">{{ entry.value }}</dd>
                </template>
            </dl>
            <!-- end account data -->

            <!-- begin additional information -->
            <CmdParagraph 
                v-if="cmdParagraphAdditionalInformationProperties.show && cmdParagraphAdditionalInformationProperties.text" 
                v-bind="cmdParagraphAdditionalInformationProperties" 
            />
            <!-- end additional information -->
        </slot>
    </div>
    <!-- end CmdBankAccountData ---------------------------------------------------------------------------------------- -->
</template>

<script>
export default {
    name: "CmdBankAccountData",
    inject: {
        editModeContext: {
            default: null
        }
    },
    props: {
        /**
         * style component as a box
         */
         styleAsBox: {
            type: Boolean,
            default: false
        },
        /**
         * bank account data
         *
         * must contain: owner, name of bank, IBAN, SWIFT/BIC
         */
        accountData: {
            type: Array,
            required: true
        },
        /**
         * enable if data can be copied by click on icon
         */
        allowCopyByClick: {
            type: Boolean,
            default: true
        },
        /**
         * additional information shown in a paragraph below account data
         */
        additionalInformation: {
            type: String,
            required: false
        },
        /**
         * properties for CmdLink to copy data to dashboard
         *
         * @requiredForAccessibility: partial
         */
         cmdLinkCopyData: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdParagraph for additional information shown at bottom
         */
         cmdParagraphAdditionalInformation: {
            type: Object,
            required: false
         },
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        }
    },
    computed: {
        cmdHeadlineProperties() {
            return {
                show: true,
                headlineLevel: 2,
                ...this.cmdHeadline
            }
        },
        cmdParagraphAdditionalInformationProperties() {
            return {
                show: true,
                ...this.cmdParagraphAdditionalInformation
            }
        },
        cmdLinkCopyDataProperties() {
            return {
                icon: {
                    iconClass: "icon-file-copy",
                    tooltip: "Copy data to clipboard!"
                },
                ...this.cmdLinkCopyData
            }
        }
    },
    methods: {
        copyToClipboard(entry) {
            // get data, remove spaces and copy to clipboard
            const output = entry.replace(/\s/g, "")
            navigator.clipboard.writeText(output)
            alert(output + " was copied to clipboard")
        }
    }
}
</script>

<style>
/* begin cmd-bank-account-data ---------------------------------------------------------------------------------------- */
.cmd-bank-account-data {
    dd {
        display: flex;
        gap: calc(var(--default-gap) / 2);

        > span {
            &:first-child {
                white-space: nowrap;
            }
        }
    }
}

/* end cmd-bank-account-data ---------------------------------------------------------------------------------------- */
</style>