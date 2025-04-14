<template>
    <div class="cmd-tabs">
        <!-- being tab-list -->
        <ul :class="{'stretch-tabs' : stretchTabs}" role="tablist">
            <li v-for="(tab, index) in tabs" :class="{active : showTab === index}" :key="index" role="tab">
                <a href="#" class="button" @click.prevent="setActiveTab(index)" :title="!tab.text ? tab.tooltip : undefined">
                    <!-- begin CmdIcon -->
                    <CmdIcon v-if="tab.iconClass" :iconClass="tab.iconClass" :type="tab.iconType" />
                    <!-- end CmdIcon -->
                    <span v-if="tab.text">{{ tab.text }}</span>
                </a>
            </li>
        </ul>
        <!-- end tab-list -->

        <!-- being tab-content -->
        <!-- begin slot -->
        <template v-if="useSlot">
            <div v-show="showTab === index - 1" v-for="index in tabs.length" :key="index" aria-live="assertive" :class="['tab-content-' + (index - 1), {'no-padding': !useDefaultPadding}]">
                <!-- begin named slot-content -->
                <slot :name="'tab-content-' + (index - 1)"></slot>
                <!-- end named slot-content -->
            </div>
        </template>
        <!-- end slot -->

        <div v-else aria-live="assertive">
            <!-- begin CmdHeadline -->
            <CmdHeadline
               v-if="cmdHeadline"
               v-bind="cmdHeadline"
               :headlineText="tabs[showTab].headlineText"
               :headlineLevel="tabs[showTab].headlineLevel"
            />
            <!-- end CmdHeadline -->

            <!-- begin html-content -->
            <div v-html="tabs[showTab].htmlContent" :class="{'no-padding': !useDefaultPadding}"></div>
            <!-- end html-content -->
        </div>
        <!-- end tab-content -->
    </div>
</template>

<script>
// import functions
import {addCollection} from "@iconify/vue"

// import data
import IconData from '@/assets/data/icon.json'

addCollection(IconData)

export default {
    name: "CmdTabs",
    data() {
        return {
            showTab: this.defaultActiveTab
        }
    },
    emits: ["active-tab"],
    props: {
        /**
         * set if content should use default-padding
         */
        useDefaultPadding: {
            type: Boolean,
            default: true
        },
        /**
         * activate if tabs should be (equally) stretched horizontally over full width of tab-content
         */
        stretchTabs: {
            type: Boolean,
            default: false
        },
        /**
         * list of tabs (incl. tab-name and tab-content (optional))
         */
        tabs: {
            type: Array,
            required: true
        },
        /**
         * activate if content should be given by slot
         */
        useSlot: {
            type: Boolean,
            default: false
        },
        /**
         * set default active/shown tab
         */
        defaultActiveTab: {
            type: Number,
            default: 0
        },
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        }
    },
    methods: {
      setActiveTab(index) {
          this.showTab = index
          this.$emit("active-tab", index)
      }
    },
    watch: {
        defaultActiveTab() {
            this.showTab = this.defaultActiveTab
        }
    }
}
</script>

<style>
/* begin cmd-tabs ------------------------------------------------------------------------------------------ */
.cmd-tabs {
    > ul {
        margin: 0;
        display: flex;

        > li {
            z-index: 10;
            margin-left: 0;
            border-top-left-radius: var(--default-border-radius);
            border-top-right-radius: var(--default-border-radius);
            list-style-type: none;
            background: var(--color-scheme-background);

            a {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: var(--default-padding);
                border: var(--default-border);
                border-bottom: 0;
                border-top-left-radius: var(--default-border-radius);
                border-top-right-radius: var(--default-border-radius);
                text-decoration: none !important;

                span, span[class*="icon-"] {
                    text-decoration: none !important;
                }

                &:hover, &:active, &:focus {
                    cursor: pointer;
                    color: var(--hyperlink-color-highlighted);
                    border-color: var(--hyperlink-color);

                    span, [class*="icon-"] {
                        color: inherit;
                    }
                }
            }

            &.active {
                span, [class*="icon-"] {
                    color: var(--color-white);
                }

                &:hover, &:active {
                    a, a:focus {
                        color: var(--hyperlink-color);
                        background: var(--color-white);

                        span, [class*="icon-"] {
                            color: var(--hyperlink-color-highlighted);
                        }
                    }
                }
                
                a:focus {
                    color: var(--color-white);

                    span, span[class*="icon-"], .iconify {
                        color: inherit !important;
                    }
                }
            }
        }

        &.stretch-tabs {
            > li {
                flex: 1;
                text-align: center;
            }

            > div {
                border-top-right-radius: 0;
            }
        }
    }

    .headline {
        margin-top: 0;
    }

    > div {
        padding: var(--default-padding);
        border: var(--primary-border);
        border-radius: var(--default-border-radius);
        background: var(--color-scheme-background);
        border-top-left-radius: 0;

        > div {
            *:last-child {
                margin-bottom: 0;
            }
        }
    }
}

/* end cmd-tabs ------------------------------------------------------------------------------------------ */
</style>