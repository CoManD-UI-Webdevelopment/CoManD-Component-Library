<template>
    <div class="cmd-mail-tool-filter">
        <!-- begin CmdHeadline -->
        <CmdHeadline v-if="headlineText" :headlineText="headlineText" :headlineLevel="headlineLevel"/>
        <!-- end CmdHeadline -->

        <div class="flex-container align-items-center">
            <!-- begin CmdFormElement -->
            <CmdFormElement
                element="input"
                type="search"
                :placeholder="'Search ' + boxType"
                :showSearchButton="false"
                :id="'search-' + boxType"
                :labelText="'Search ' + boxType"
                :showLabel="false"
                v-model="searchFilterText"
            />
            <!-- end CmdFormElement -->

            <div class="flex-container reset-flex">
                <!-- begin CmdFormElement -->
                <CmdFormElement
                    element="input"
                    type="checkbox"
                    name="search-filters"
                    id="search-subject"
                    labelText="Search subjects"
                    v-model="searchFilterOptions"
                    inputValue="subjects"
                />
                <!-- end CmdFormElement -->

                <!-- begin CmdFormElement -->
                <CmdFormElement
                    element="input"
                    type="checkbox"
                    name="search-filters"
                    :id="'search-' + senderReceiver"
                    :labelText="'Search ' + senderReceiver"
                    v-model="searchFilterOptions"
                    :inputValue="senderReceiver"
                />
                <!-- end CmdFormElement -->
            </div>
        </div>
        <div class="flex-container sort-wrapper">
            <!-- begin link sort ascending -->
            <a v-if="sortOrderAsc" href="#" @click.prevent="sortByDate('asc')" :title="linkSortAscending.title">
                <span v-if="linkSortAscending.text">{{ linkSortAscending.text }}</span>
                <span v-if="linkSortAscending.iconClass" :class="linkSortAscending.iconClass"></span>
            </a>
            <!-- end link sort ascending -->

            <!-- begin link sort descending -->
            <a v-else href="#" @click.prevent="sortByDate('desc')" :title="linkSortDescending.title">
                <span v-if="linkSortDescending.text">{{ linkSortDescending.text }}</span>
                <span v-if="linkSortDescending.iconClass" :class="linkSortDescending.iconClass"></span>
            </a>
            <!-- end link sort descending -->
        </div>
    </div>
</template>

<script>
export default {
    name: "CmdMailToolFilter",
    data() {
        return {
            searchFilterText: "",
            searchFilterOptions: [],
            sortOrderAsc: Boolean
        }
    },
    props: {
        modelValue: {
            type: Object,
        },
        /**
         * define boxType
         *
         * @allowedValues: "inbox", "outbox"
         */
        boxType: {
            type: String,
            default: "inbox"
        },
        /**
         * define link for sorting mails ascending
         */
        linkSortAscending: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-sort-asc-arrows",
                    text: "asc (0-9)",
                    title: "Sort mails by date/time ascending"
                }
            }
        },
        /**
         * define link for sorting mails descending
         */
        linkSortDescending: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-sort-desc-arrows",
                    text: "desc (9-0)",
                    title: "Sort mails by date/time descending"
                }
            }
        },
        /**
         * define properties for CmdHeadline-component for inbox
         */
        cmdHeadlineInbox: {
            type: Object,
            default() {
                return {
                    headlineText: "Inbox",
                    headlineLevel: 3
                }
            }
        },
        /**
         * define properties for CmdHeadline-component for outbox
         */
        cmdHeadlineOutbox: {
            type: Object,
            default() {
                return {
                    headlineText: "Outbox",
                    headlineLevel: 3
                }
            }
        }
    },
    computed: {
        headlineText() {
            return this.boxType === "inbox" ? this.cmdHeadlineInbox?.headlineText : this.cmdHeadlineOutbox?.headlineText
        },
        headlineLevel() {
            return this.boxType === "inbox" ? this.cmdHeadlineInbox?.headlineLevel : this.cmdHeadlineOutbox?.headlineLevel
        },
        senderReceiver() {
            return this.boxType === "inbox" ? "senders" : "receivers"
        }
    },
    methods: {
        sortByDate(sortOrder) {
            this.sortOrderAsc = !this.sortOrderAsc
            // todo build watcher
        }
    },
    watch: {
        modelValue: {
            handler() {
                this.searchFilterText = this.modelValue?.searchFilterText || ""
                this.searchFilterOptions = this.modelValue?.searchFilterOptions || ["subjects", "senders"]
            },
            deep: true,
            immediate: true
        },
        searchFilterText: {
            handler() {
                this.$emit("update:modelValue", {
                    searchFilterOptions: this.searchFilterOptions,
                    searchFilterText: this.searchFilterText
                })
            },
            immediate: true
        },
        searchFilterOptions: {
            handler() {
                this.$emit("update:modelValue", {
                    searchFilterText: this.searchFilterText,
                    searchFilterOptions: this.searchFilterOptions
                })
            },
            immediate: true
        }
    }
}
</script>

<style>
/* begin cmd-mail-tool-filter-------------------------------------------------------------------------------------------- */
.cmd-mail-tool-filter {
    display: flex;
    padding: var(--default-padding);
    background: var(--color-light-gray);
    align-items: center;
    justify-content: space-between;

    .cmd-headline {
        margin: 0;
    }

    .label-text {
        white-space: nowrap;


    }

    .sort-wrapper {
        text-align: right;

        a {
            text-decoration: none;
        }
    }
}

/* end cmd-mail-tool-filter-------------------------------------------------------------------------------------------- */
</style>