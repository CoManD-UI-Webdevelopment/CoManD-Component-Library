<template>
    <!-- begin CmdBoxSiteSearch ---------------------------------------------------------------------------------------- -->
    <fieldset class="cmd-box-site-search flex-container">
        <!-- begin legend -->
        <legend :class="{hidden : !legend.show, 'align-left': legend.align === 'left'}">{{ legend.text }}</legend>
        <!-- end legend -->

        <!-- begin CmdHeadline -->
        <CmdHeadline
            v-if="cmdHeadline"
            v-bind="cmdHeadline"
        />
        <!-- end CmdHeadline -->

        <!-- begin form-elements -->
        <div class="flex-container align-bottom">
            <!-- begin CmdFormElement for first input -->
            <CmdFormElement
                element="input"
                :type="cmdFormElementInput1.type"
                :show-label="cmdFormElementInput1.showLabel"
                :labelText="cmdFormElementInput1.labelText"
                :placeholder="cmdFormElementInput1.placeholder"
                :required="cmdFormElementInput1.required"
                :showSearchButton="cmdFormElementInput1.showSearchButton"
                v-model="searchValue1"
            />
            <!-- end CmdFormElement for first input -->

            <div class="input-wrapper align-bottom">
                <!-- begin CmdFormElement for second input -->
                <CmdFormElement
                    v-if="cmdFormElementInput2.show"
                    element="input"
                    :type="cmdFormElementInput2.type"
                    :show-label="cmdFormElementInput2.showLabel"
                    :labelText="cmdFormElementInput2.labelText"
                    :placeholder="cmdFormElementInput2.placeholder"
                    :required="cmdFormElementInput2.required"
                    v-model="searchValue2"
                />
                <!-- end CmdFormElement for second input -->

                <!-- begin CmdFormElement for radius -->
                <CmdFormElement
                    v-if="cmdFormElementRadiusOptions.show"
                    element="select"
                    class="flex-none"
                    v-model="radius"
                    v-bind="cmdFormElementRadiusOptions"
                />
                <!-- end CmdFormElement for radius -->
            </div>

            <!-- begin CmdFormElement for search-button -->
            <CmdFormElement
                element="button"
                class="stretch-on-small-devices"
                :nativeButton="cmdFormElementSearchButton"
                @click="onSearchButtonClick"
                :disabled="buttonSearchDisabled"
                aria-live="assertive"
            />
            <!-- end CmdFormElement for search-button -->

        </div>
        <!-- end form-elements -->

        <!-- begin filters -->
        <template v-if="useFilters">
            <a class="filter-options" href="#" @click.prevent="showFilters = !showFilters">
                <!-- begin CmdIcon -->
                <CmdIcon
                    :iconClass="showFilters ? cmdIcon?.showFilters?.iconClass : cmdIcon?.hideFilters?.iconClass"
                    :type="showFilters ? cmdIcon?.showFilters?.iconType : cmdIcon?.hideFilters?.iconType"
                />
                <!-- end CmdIcon -->
                <span v-if="showFilters">{{ getMessage("site_search.hide_filter_options") }}</span>
                <span v-else>{{ getMessage("site_search.show_filter_options") }}</span>
            </a>
            <transition :name="transitionFilters">
                <div v-if="showFilters && cmdFakeSelect?.selectData.length" class="flex-container flex-none" role="listbox" aria-expanded="true">
                    <!-- begin CmdFakeSelect -->
                    <CmdFakeSelect
                        role="option"
                        :selectData="cmdFakeSelect?.selectData"
                        v-model="searchFilters"
                        :defaultOptionName="cmdFakeSelect?.defaultOptionName"
                        :type="cmdFakeSelect?.type"
                        :labelText="cmdFakeSelect?.labelText"
                    />
                    <!-- end CmdFakeSelect -->
                </div>
            </transition>
        </template>
        <!-- end filters -->
    </fieldset>

    <!-- begin CmdFormFilters -->
    <CmdFormFilters v-if="useFilters" v-model="searchFilters" :selectedOptionsName="getOptionName"/>
    <!-- end CmdFormFilters -->
     <!-- end CmdBoxSiteSearch ---------------------------------------------------------------------------------------- -->
</template>

<script>
// import mixins
import I18n from "../mixins/I18n"
import DefaultMessageProperties from "../mixins/CmdSiteSearch/DefaultMessageProperties"

export default {
    emits: [
        "search",
        "update:modelValueInput1",
        "update:modelValueInput2",
        "update:modelValueRadius",
        "update:modelValueSearchFilters"
    ],
    name: "CmdBoxSiteSearch",
    mixins: [I18n, DefaultMessageProperties],
    data() {
        return {
            showFilters: false
        }
    },
    props: {
        /**
         * define the transition when filters disappear
         * 
         * @allowedValues: "none", "fade", "scroll" 
         */
        transitionFilters: {
            type: String,
            default: "fade"
        },
        /**
         * custom modelValue for first input-field
         */
        modelValueInput1: {
            type: String,
            required: false
        },
        /**
         * custom modelValue for second input-field
         */
        modelValueInput2: {
            type: String,
            required: false
        },
        /**
         * custom modelValue for radius
         */
        modelValueRadius: {
            type: [String, Number],
            required: false
        },
        /**
         * custom modelValue for search-filters
         */
        modelValueSearchFilters: {
            type: Array,
            required: false
        },
        /**
         * toggle use of filters (must be configured)
         */
        useFilters: {
            type: Boolean,
            default: true
        },
        /**
         * legend for form
         *
         * useFieldset-property must be activated
         *
         * @requiredForAccessiblity: true
         */
        legend: {
            type: Object,
            default() {
                return {
                    show: true,
                    align: "left",
                    text: "Legend"
                }
            }
        },
        /**
         * send search result from outside to display inside this component
         */
        results: {
            type: [Function, Number],
            required: false
        },
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdFormElement-component first search-field
         */
        cmdFormElementInput1: {
            type: Object,
            default() {
                return {
                    type: "search",
                    showLabel: false,
                    required: true,
                    labelText: "What do you like to search for?",
                    placeholder: "What do you like to search for?",
                    showSearchButton: false
                }
            }
        },
        /**
         * properties for CmdFormElement-component for second search-field
         */
        cmdFormElementInput2: {
            type: Object,
            default() {
                return {
                    show: true,
                    type: "text",
                    showLabel: false,
                    required: true,
                    labelText: "Where do you like to search?",
                    placeholder: "Enter city, zip, country"
                }
            }
        },
        /**
         * properties for CmdFormElement-component for radius
         */
        cmdFormElementRadius: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdFormElement-component for search-button
         */
        cmdFormElementSearchButton: {
            type: Object,
            default() {
                return {
                    icon: {
                        show: true,
                        position: "before",
                        iconClass: "icon-search"
                    },
                    text: "Search",
                    primary: true
                }
            }
        },
        /**
         * properties for CmdFakeSelect-component for filters
         */
        cmdFakeSelect: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdIcon-component for filters
         */
        cmdIcon: {
            type: Object,
            default() {
                return {
                    showFilters: {
                        iconClass: "icon-chevron-one-stripe-up",
                        type: "auto"
                    },
                    hideFilters: {
                        iconClass: "icon-chevron-one-stripe-down",
                        type: "auto"
                    }
                }
            }
        }
    },
    computed: {
        cmdFormElementRadiusOptions() {
            return {
                show: true,
                showLabel: false,
                required: false,
                labelText: "Radius",
                selectOptions: [
                    {
                        text: "None",
                        value: 0
                    },
                    {
                        text: "5 Km",
                        value: 5
                    },
                    {
                        text: "10 Km",
                        value: 10
                    },
                    {
                        text: "15 Km",
                        value: 15
                    },
                    {
                        text: "50 Km",
                        value: 50
                    },
                    {
                        text: "100 Km",
                        value: 100
                    }
                ],
                ...this.cmdFormElementRadius
            }
        },
        searchValue1: {
            get() {
                return this.modelValueInput1
            },
            set(value) {
                this.$emit("update:modelValueInput1", value)
            }
        },
        searchValue2: {
            get() {
                return this.modelValueInput2
            },
            set(value) {
                this.$emit("update:modelValueInput2", value)
            }
        },
        radius: {
            get() {
                return this.modelValueRadius
            },
            set(value) {
                this.$emit("update:modelValueRadius", value)
            }
        },
        searchFilters: {
            get() {
                return this.modelValueSearchFilters
            },
            set(value) {
                this.$emit("update:modelValueSearchFilters", value)
            }
        },
        buttonSearchDisabled() {
            const validInput1 = !this.cmdFormElementInput1.required || this.searchValue1.trim()
            const validInput2 = !this.cmdFormElementInput2.show || !this.cmdFormElementInput2.required || this.searchValue2.trim()
            const validInputRadius = !this.cmdFormElementRadiusOptions.show || !this.cmdFormElementRadiusOptions.required || this.radius

            return !(validInput1 && validInput2 && validInputRadius)
        }
    },
    methods: {
        onSearchButtonClick() {
            this.$emit("search", {
                searchValue1: this.searchValue1,
                searchValue2: this.searchValue2,
                searchFilters: this.searchFilters,
                radius: this.radius
            })
        },
        getOptionName(option) {
            for (let i = 0; i < this.cmdFakeSelect.selectData.length; i++) {
                if (option === this.cmdFakeSelect.selectData[i].value) {
                    return this.cmdFakeSelect.selectData[i].text
                }
            }
            return null
        }
    },
    watch: {
        cmdFormElementRadius: {
            handler() {
                if (this.cmdFormElementRadiusOptions?.selectOptions && this.cmdFormElementRadiusOptions?.selectOptions.length && this.modelValueRadius == null) {
                    this.radius = this.cmdFormElementRadiusOptions.selectOptions[0].value
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>

<style lang="scss">
/* begin cmd-box-site-search ---------------------------------------------------------------------------------------- */
@import '../assets/styles/variables';
.cmd-box-site-search {
    flex-wrap: nowrap;

    > a.filter-options {
        display: table;
        align-self: flex-start;

        [class*='icon'] {
            font-size: var(--icon-size-small);
        }
    }

    button {
        align-self: flex-end;
    }
}

@media only screen and (max-width: $small-max-width) {
    .cmd-box-site-search {
        flex-wrap: nowrap;

        > a.filter-options {
            align-self: center;
        }
    }
}
/* end cmd-box-site-search ---------------------------------------------------------------------------------------- */
</style>