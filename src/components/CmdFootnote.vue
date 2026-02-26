<template>
    <div class="cmd-footnote">
        <CmdHeadline v-if="cmdHeadline?.headlineText" v-bind="cmdHeadlineProperties" />
        <CmdList listType="description" :items="items" :class="'type-' + descriptionTermType" />
    </div>
</template>

<script>
export default {
    name: "CmdFootnote",
    props: {
        /**
         * set type of descriptionTerm
         * 
         * @allowedValues: "asterisk", "number"
         */
        descriptionTermType: {
            type: String,
            default: "asterisk",
            validator(value) {
                return value === "number" ||
                    value === "asterisk"
            }
        },
        /**
         * descriptionData (the footnote-texts)
         */
        descriptionData: {
            type: Array,
            required: true
        },
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        },
    },
    computed: {
        cmdHeadlineProperties() {
            return {
                headlineLevel: 6,
                ...this.cmdHeadline
            }
        },
        items() {
            const items = []

            for (let i = 0; i < this.descriptionData.length; i++) {
                const getTerm = (index) => {
                    if (this.descriptionTermType === "number") {
                        return { text: index + 1 };
                    } else {
                        return { text: "*".repeat(index + 1) }
                    }
                }

                items.push({
                    descriptionTerm: getTerm(i),
                    descriptionData: {
                        text: this.descriptionData[i]
                    }
                })
            }

            return items
        }
    }
}
</script>

<style>
.cmd-footnote {
    .cmd-list {
        dl {
            grid-column-gap: .1rem; /* overwrite settings from frontend-framework */

            dt {
                vertical-align: super;
                font-size: 1rem;
            }
        }

        &.type-asterisk {
            dt {
                text-align: right;
            }
        }
    }
}
</style>