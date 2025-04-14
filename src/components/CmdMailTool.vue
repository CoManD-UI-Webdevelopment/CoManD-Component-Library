<template>
    <CmdTabs class="cmd-mail-tool" v-bind="cmdTabs">
        <!-- begin tab "inbox" -->
        <template v-slot:tab-content-0>
            <!-- begin CmdMailToolFilter (for inbox) -->
            <CmdMailToolFilter v-bind="cmdMailToolFilterInbox" v-model="searchFilters"/>
            <!-- end CmdMailToolFilter -->

            <!-- begin CmdMailToolEntry -->
            <CmdMailToolEntry :mails="filteredMailsInbox"/>
            <!-- end CmdMailToolEntry (for inbox) -->
        </template>
        <!-- end tab "inbox" -->

        <!-- begin tab "outbox" -->
        <template v-slot:tab-content-1>
            <!-- begin CmdMailToolFilter (for outbox) -->
            <CmdMailToolFilter v-bind="cmdMailToolFilterOutbox" boxType="outbox"/>
            <!-- end CmdMailToolFilter (for outbox) -->

            <!-- begin CmdMailToolEntry -->
            <CmdMailToolEntry boxType="outbox" :mails="mailsOutbox"/>
            <!-- end CmdMailToolEntry -->
        </template>
        <!-- end tab "outbox" -->
    </CmdTabs>
</template>

<script>

export default {
    name: "CmdMailTool",
    data() {
        return {
            searchFilters: {
                searchFilterText: "",
                searchFilterOptions: ["senders", "subjects"]
            }
        }
    },
    props: {
        /**
         * array of mails for inbox
         *
         * required-structure for entries:
         * {
         *     cmdImage: Object (structure for CmdImage-component used for image of contact)
         *     contactFullName: String
         *     subject: String
         *     isoDate: String (formatted as iso-date: YYYY-MM-DD)
         *     time: String (formatted as time: HH:MM)
         * }
         */
        mailsInbox: {
            type: Array,
            required: true
        },
        /**
         * array of mails for outbox
         *
         * required-structure for entries:
         * {
         *     cmdImage: Object (structure for CmdImage-component used for image of contact)
         *     contactFullName: String
         *     subject: String
         *     isoDate: String (formatted as iso-date: YYYY-MM-DD)
         *     time: String (formatted as time: HH:MM)
         * }
         */
        mailsOutbox: {
            type: Array,
            required: true
        },
        /**
         * properties for CmdTabs-component
         */
        cmdTabs: {
            type: Object,
            default() {
                return {
                    tabs: [
                        {
                            "text": "Inbox",
                            "headlineText": "Inbox",
                            "headlineLevel": 4,
                            "iconClass": "icon-inbox"
                        },
                        {
                            "text": "Outbox",
                            "headlineText": "Outbox",
                            "headlineLevel": 4,
                            "iconClass": "icon-outbox"
                        }
                    ],
                    useSlot: true,
                    stretchTabs: true,
                    useDefaultPadding: false
                }
            }
        },
        cmdMailToolFilterInbox: {
            type: Object,
            default() {
                return {}
            }
        },
        /**
         * define properties for CmdHeadline-component for inbox
         */
        cmdMailToolFilterOutbox: {
            type: Object,
            default() {
                return {
                    headlineText: "Outbox",
                    headlineLevel: 4,
                }
            }
        }
    },
    computed: {
        filteredMailsInbox() {
            if (this.searchFilters.searchFilterText === "") {
                return this.mailsInbox
            }

            if (this.searchFilters.searchFilterOptions.length) {
                return this.mailsInbox.filter((mail) => {
                    let s1 = false
                    let s2 = false

                    if (this.searchFilters?.searchFilterOptions?.includes("senders")) {
                        s1 = mail.contactFullName.toLowerCase().includes(this.searchFilters?.searchFilterText?.toLowerCase())
                    }
                    if (this.searchFilters?.searchFilterOptions?.includes("subjects")) {
                        s2 = mail.subject.toLowerCase().includes(this.searchFilters?.searchFilterText?.toLowerCase())
                    }

                    return s1 || s2
                })
            }
            return []
        }
    }
}
</script>