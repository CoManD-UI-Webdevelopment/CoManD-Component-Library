<template>
    <div class="cmd-smart-search">
        <!--  begin CmdFormElement -->
        <CmdFormElement
            element="input"
            type="search"
            v-bind="cmdFormElementOptions"
            v-model="searchTerm"
            @input="showRecommendations"
        />
        <!-- end CmdFormElement -->

        <!-- begin list-of-recommendations -->
        <ul v-if="showListOfRecommmendations" class="list-of-recommendations no-list-items">
            <li v-for="(item, index) in listOfRecommendations" :key="index">
                <!-- begin CmdLink -->
                <CmdLink v-bind="item" @click="optionSelected" />
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
            showListOfRecommmendations: false,
            searchTerm: ""
        }
    },
    props: {
        /**
         * set default v-model (must be named modelValue in Vue3)
         */
        modelValue: {
            type: [String, Number],
            default: ""
        },
        /**
         * provide list for recommendations shown below search-field
         */
        listOfRecommendations: {
            type: Array,
            required: true
        },
        /**
         * define search-field
         */
        cmdFormElement: {
            type: Object,
            required: false
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
        }
    },
    methods: {
        showRecommendations() {
            this.showListOfRecommmendations = true
        },
        optionSelected(event) {
            event.originalEvent.preventDefault()
            this.showListOfRecommmendations = false
            console.log("event", event)
            this.searchTerm = event.target.value // set search-field to selected option
            this.$emit("update:modelValue", this.searchTerm)
        }
    },
    watch: {
        searchTerm() {
            if(this.searchTerm.length) {
                this.showRecommendations()
            } else {
                this.showListOfRecommmendations = false
            }
        }
    }
}
</script>

<style>
.cmd-smart-search {
    .list-of-recommendations {
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

                &:hover, &:active, &:focus {
                    background: var(--hyperlink-color);

                    span, span[class*="icon"] {
                        color: var(--pure-white);
                    }
                }
            }
        }
    }
}
</style>