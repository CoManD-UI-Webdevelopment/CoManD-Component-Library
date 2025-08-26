<template>
    <div :class="['cmd-smart-search', {open: showListOfRecommendations, 'open-list-to-top': openListToTop}]">
        <!--  begin CmdFormElement -->
        <CmdFormElement
            element="input"
            type="search"
            v-bind="cmdFormElementOptions"
            v-model="searchTerm"
            @update:modelValue="showRecommendations"
        />
        <!-- end CmdFormElement -->

        <!-- begin list-of-recommendations -->
        <ul v-if="showListOfRecommendations" class="list-of-recommendations no-list-items">
            <li v-for="(item, index) in filteredListOfRecommendations" :key="index">
                <!-- begin CmdLink -->
                <CmdLink v-bind="linkItem(item)" @click="optionSelected(item)">
                    <!-- begin slot -->
                    <slot></slot>
                    <!-- end slot -->
                </CmdLink>
                <!-- end CmdLink -->
            </li>
        </ul>
        <!-- end list-of-recommendations -->
    </div>
</template>

<script>
export default {
    name: "CmdSmartSearch",
    data() {
        return {
            showListOfRecommendations: false,
            searchTerm: "",
            item: {}
        }
    },
    props: {
        /**
         * set default v-model (must be named modelValue in Vue3)
         */
        modelValue: {
            type: [Object, String],
            required: false
        },
        /**
         * provide list for recommendations shown below search-field
         */
        listOfRecommendations: {
            type: Array,
            required: true
        },
        /**
         * define the maximum listed number of recommendations
         */
        maxNumberOfRecommendations: {
            type: Number,
            default: 3
        },
        /**
         * set if list of recommendations will be filtered by first letter (else by any containing letter)
         */
        filterByFirstLetter: {
            Boolean,
            default: false
        },
        /**
         * set properties for CmdFormElement-component (search-field)
         */
        cmdFormElement: {
            type: Object,
            required: false
        },
        // todo: replace property by computed-property that handles position of dropdown-list automatically
        openListToTop: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        cmdFormElementOptions() {
            return {
                labelText: "Search",
                placeholder: "Enter Keyword(s)",
                showSearchButton: false,
                ...this.cmdFormElement
            }
        },
        filteredListOfRecommendations() {
            return this.listOfRecommendations.filter(item => {
                // check if there exists a correct displayValue
                if (!item.displayValue || typeof item.displayValue !== "string") {
                    console.error("provided item.displayValue of 'listOfRecommendations' does not exist or does not match type 'string'!")
                    return false
                }

                // set comparable string to lowercase
                const lowerCaseSearchTerm = this.searchTerm.toLowerCase()
                const lowerCaseDisplayValue = item.displayValue.toLowerCase()

                // check if string from listOfRecommendations starsWith or contains the provides string from the searchfield
                return this.filterByFirstLetter ? lowerCaseDisplayValue.startsWith(lowerCaseSearchTerm) : lowerCaseDisplayValue.includes(lowerCaseSearchTerm)
            }).slice(0, this.maxNumberOfRecommendations)
        }
    },
    methods: {
        showRecommendations() {
            this.item = {} // reset item
            if(typeof this.modelValue === "string") {
                this.$emit("update:modelValue", "")
            } else {
                this.$emit("update:modelValue", {itemId: "", displayValue: ""})
            }

            this.showListOfRecommendations = true
        },
        optionSelected(item) {
            this.searchTerm = item.displayValue // set search-field to selected option
            this.showListOfRecommendations = false
            if(typeof this.modelValue === "string") {
                this.$emit("update:modelValue", item.displayValue)
            } else {
                this.$emit("update:modelValue", {itemId: item.id, displayValue: item.displayValue})
            }
        },
        linkItem(item) {
            return {
                ...item,
                text: item.displayValue
            }
        }
    },
    watch: {
        searchTerm() {
            if(!this.searchTerm.length) {
                this.showListOfRecommendations = false
            }
        }
    }
}
</script>

<style>
/* begin cmd-smart-search ---------------------------------------------------------------------------------------- */
.cmd-smart-search {
    &.open {
        input {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }
    }

    .list-of-recommendations {
        position: absolute;
        width: 100%;
        z-index: 100;
        max-height: 15rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        border: var(--default-border);
        border-top: 0;
        background: var(--default-background);
        border-bottom-left-radius: var(--default-border-radius);
        border-bottom-right-radius: var(--default-border-radius);

        li {
            &:not(:last-child) {
                border-bottom: var(--default-border);
            }

            &:last-child {
                border-bottom-left-radius: inherit;
                border-bottom-right-radius: inherit;

                a {
                    border-bottom-left-radius: inherit;
                    border-bottom-right-radius: inherit;
                }
            }

            a {
                display: flex;
                align-items: center;
                padding: var(--default-padding);
                text-decoration: none;
                width: 100%;
                background: var(--default-background);

                &:hover, &:active, &:focus {
                    background: var(--hyperlink-color);

                    span, span[class*="icon"] {
                        color: var(--color-white);
                    }
                }
            }
        }
    }

    &.open-list-to-top {
        &.open {
            input {
                border-top-left-radius: 0;
                border-top-right-radius: 0;
                border-bottom-left-radius: var(--default-border-radius);
                border-bottom-right-radius: var(--default-border-radius);
            }
        }

        .list-of-recommendations {
            border-bottom: 0;
            top: auto;
            bottom: var(--form-input-height);
            border-radius: 0;
            border-top-left-radius: var(--default-border-radius);
            border-top-right-radius: var(--default-border-radius);

            li {
                &:first-child {
                    border-top: var(--default-border);
                    border-top-left-radius: inherit;
                    border-top-right-radius: inherit;

                    a {
                        border-top-left-radius: inherit;
                        border-top-right-radius: inherit;
                    }
                }

                &:last-child {
                    border-bottom: 0;
                    border-radius: inherit;

                    a {
                        border-radius: 0;
                    }
                }
            }
        }
    }
}
/* end cmd-smart-search ---------------------------------------------------------------------------------------- */
</style>