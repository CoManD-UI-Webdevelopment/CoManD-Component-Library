<template>
    <div class="cmd-address-data vcard">
        <!-- begin slot -->
        <template v-if="useSlot">
            <slot></slot>
        </template>
        <!-- end slot -->

        <template v-else>
            <!-- begin cmd-headline -->
            <CmdHeadline
                v-if="cmdHeadline?.headlineText || editModeContext" v-bind="cmdHeadline"
            />
            <!-- end cmd-headline -->

            <!-- begin address-data in vCard microformat -->
            <address class="adr">
                <!-- begin list with labels -->
                <template v-if="showLabels && (showLabelTexts|| showLabelIcons) && !showIconsOnly">
                    <!-- begin default view -->
                    <dl v-if="!editModeContext">
                        <!-- begin cmd-address-data-item -->
                        <CmdAddressDataItem
                            v-for="(entry, index) in addressData"
                            :key="index" :addressEntry="entry"
                            :showLabelIcons="showLabelIcons"
                            :showLabelTexts="showLabelTexts"
                            :showCityBeforeZip="showCityBeforeZip"
                        />
                        <!-- end cmd-address-data-item -->
                    </dl>
                    <!-- end default view -->

                    <!-- begin edit-mode -->
                    <template v-else>
                        <button v-if="addressData.length === 0" type="button" class="button confirm small" @click="onAddItem">
                            <span class="icon-plus"></span>
                            <span>Add new entry</span>
                        </button>
                        <EditComponentWrapper
                            v-for="(entry, index) in addressData"
                            :key="'x' + index"
                            class="edit-items"
                            :showComponentName="false"
                            :allowedComponentTypes="[]"
                            componentName="CmdAddressDataItem"
                            :componentProps="entry"
                            :componentPath="['props', 'addressData', index]"
                        >
                            <dl>
                                <!-- begin cmd-address-data-item -->
                                <CmdAddressDataItem
                                    :addressEntry="entry"
                                    :showLabelIcons="showLabelIcons"
                                    :showLabelTexts="showLabelTexts"
                                />
                                <!-- end cmd-address-data-item -->
                            </dl>
                        </EditComponentWrapper>
                    </template>
                </template>
                <!-- end list with labels -->

                <!-- begin list without labels -->
                <ul v-else :class="['flex-container', {'vertical': !showIconsOnly}]">
                    <template v-for="(entry, index) in addressData" :key="index">
                        <li v-if="entry.href || (entry.name === 'address' && entry.linkGoogleMaps) || !showIconsOnly"
                            :class="{'no-flex' : showIconsOnly}">
                            <!-- begin all entries except address (which has no href) -->
                            <a v-if="entry.href"
                               :class="{'button' : styleLinksAsButtons}"
                               :href="getHref(entry)"
                               :target="entry.name === 'url' ? '_blank' : null"
                               :title="entry.tooltip"
                            >
                                <template v-if="showIconsOnly">
                                    <!-- begin CmdIcon -->
                                    <CmdIcon v-if="entry.iconClass" :iconClass="entry.iconClass" :type="entry.iconType"/>
                                    <!-- end CmdIcon -->
                                </template>
                                <template v-else>{{ entry.href }}</template>
                            </a>
                            <span v-else-if="!showIconsOnly" v-html="entry.data"></span>
                            <!-- end all entries except address -->

                            <!-- begin address -->
                            <template v-if="entry.name === 'address'">
                                <!-- begin linked address -->
                                <a v-if="entry.linkGoogleMaps" :href="locateAddress(entry)" target="google-maps" :title="entry.tooltip">
                                    <template v-if="showIconsOnly">
                                        <!-- begin CmdIcon -->
                                        <CmdIcon v-if="entry.iconClass" :iconClass="entry.iconClass" :type="entry.iconType"/>
                                        <!-- end CmdIcon -->
                                    </template>
                                    <template v-else>
                                        <!-- begin street/number -->
                                        <template v-if="entry.streetNo">
                                            <span class="street-address">{{ entry.streetNo }}</span><br/>
                                        </template>
                                        <!-- end street/number -->

                                        <!-- begin zip/city (state) -->
                                        <span v-if="entry.zip || entry.city" :class="showCityBeforeZip ? 'order-city-zip' : 'order-zip-city'">
                                            <span v-if="entry.zip" class="postal-code">{{ entry.zip }}&nbsp;</span>
                                            <span v-if="entry.city" class="locality">{{ entry.city }}<template v-if="entry.state"> {{entry.state}}</template></span><br/>
                                        </span>
                                        <!-- end zip/city (state) -->

                                        <!-- begin po box -->
                                        <template v-if="entry.pobox">
                                            <span>{{ entry.pobox }}</span><br/>
                                        </template>
                                        <!-- end po box -->

                                        <!-- begin miscInfo -->
                                        <template v-if="entry.miscInfo">
                                            <span>{{ entry.miscInfo }}</span><br/>
                                        </template>
                                        <!-- end miscInfo -->

                                        <!-- begin country -->
                                        <span v-if="entry.country" class="country-name">{{ entry.country }}</span>
                                        <!-- end country -->
                                    </template>
                                </a>
                                <!-- end linked address -->

                                <!-- begin unlinked address -->
                                <template v-if="!entry.linkGoogleMaps && !showIconsOnly">
                                    <!-- begin street/number -->
                                    <template v-if="entry.streetNo">
                                        <span class="street-address">{{ entry.streetNo }}</span><br/>
                                    </template>
                                    <!-- end street/number -->

                                    <!-- begin zip/city (state) -->
                                    <span v-if="entry.zip || entry.city" :class="showCityBeforeZip ? 'order-city-zip' : 'order-zip-city'">
                                        <span v-if="entry.zip" class="postal-code">{{ entry.zip }}&nbsp;</span>
                                        <span v-if="entry.city" class="locality">{{ entry.city }}<template v-if="entry.state"> {{entry.state}}</template></span><br/>
                                    </span>
                                    <!-- end zip/city (state) -->

                                    <!-- begin po box -->
                                    <template v-if="entry.pobox">
                                        <span>{{ entry.pobox }}</span><br/>
                                    </template>
                                    <!-- end po box -->

                                    <!-- begin miscInfo -->
                                    <template v-if="entry.miscInfo">
                                        <span>{{ entry.miscInfo }}</span><br/>
                                    </template>
                                    <!-- end miscInfo -->

                                    <!-- begin country -->
                                    <span v-if="entry.country" class="country-name">{{ entry.country }}</span>
                                    <!-- end country -->
                                </template>
                                <!-- end unlinked address -->
                            </template>
                            <!-- end address -->
                        </li>
                        <!-- end all entries except address -->
                    </template>
                    <!-- end v-for -->
                </ul>
                <!-- end list without labels -->
            </address>
            <!-- end address-data in vCard microformat -->
        </template>
    </div>
</template>

<script>
// import functions
import {buildComponentPath, updateHandlerProvider} from "../utils/editmode.js"

// import mixins
import EditMode from "../mixins/EditMode.vue"

export default {
    name: "CmdAddressData",
    mixins: [EditMode],
    props: {
        /**
         * activate if you want to use slot instead for given structure
         */
        useSlot: {
            type: Boolean,
            default: false
        },
        /**
         * show an icon (if exists) in front of label-text
         */
        showLabelIcons: {
            type: Boolean,
            default: true
        },
        /**
         * show a label-text for each entry
         */
        showLabelTexts: {
            type: Boolean,
            default: false
        },
        /**
         * activate if only icons (without any text) should be displayed
         */
        showIconsOnly: {
            type: Boolean,
            default: false
        },
        /**
         * option to toggle labels (i.e. telephone, email etc.) in front/left of data
         */
        showLabels: {
            type: Boolean,
            default: true
        },
        /**
         * activate if links should be styled as buttons
         *
         * showIconsOnly-property must be activated
         *
         * @affectsStyling
         */
        styleLinksAsButtons: {
            type: Boolean,
            default: true
        },
        /**
         * all address-data (incl. labels) that will be shown
         */
        addressData: {
            type: Array,
            required: true
        },
        /**
         * activate to show city first/left then zip next/right
         */
        showCityBeforeZip: {
            type: Boolean,
            default: false
        },
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        }
    },
    data() {
        return {
            editableAddressData: []
        }
    },
    computed: {
        websiteUrlText() {
            return this.addressData.website?.text.replace("https://", "")
        }
    },
    methods: {
        onAddItem() {
            this.editModeContext.content.addContent(
                buildComponentPath(this, 'props', 'addressData', -1),
                this.itemProvider)
        },
        itemProvider() {
            return {
                "name": "name",
                "iconClass": "icon-company",
                "data": "Your data",
                "labelText": "Label"
            }
        },
        locateAddress(entry) {
            return "https://www.google.com/maps/place/" + entry.streetNo + ", " + entry.zip + " " + entry.city
        },
        getHref(entry) {
            if (entry.name === "phone") {
                return "tel:" + entry.href
            }
            if (entry.name === "email") {
                return "mailto:" + entry.href
            }
            if (entry.name === "url") {
                return entry.href
            }
            return null
        },
        updateHandlerProvider() {
            return updateHandlerProvider(this, {
                update(props, childUpdateHandlers) {
                    const cmdHeadlineUpdateHandler = childUpdateHandlers?.find(handler => handler.name === "CmdHeadline")
                    if (cmdHeadlineUpdateHandler) {
                        props.cmdHeadline = props.cmdHeadline || {}
                        cmdHeadlineUpdateHandler.update(props.cmdHeadline)
                    }

                }
            })
        }
    },
    watch: {}
}
</script>

<style>
/* begin cmd-address-data ---------------------------------------------------------------------------------------- */
.cmd-address-data {
    dl {
        grid-row-gap: calc(var(--default-gap) / 2);

        dt {
            display: flex;
            align-items: center;

            &.address {
                align-self: flex-start;

                [class*="icon"]:only-child {
                    margin-top: .2rem;
                }
            }
        }

        .postal-code {
            margin-right: calc(var(--default-margin) / 2);
        }

        .order-city-zip, .order-zip-city {
            display: inline-flex;
            gap: .5rem;
        }

        .order-city-zip {
            flex-direction: row-reverse;

            .postal-code {
                margin-right: 0;
                margin-left: calc(var(--default-margin) / 2);
            }
        }
    }

    ul {
        gap: calc(var(--default-gap) / 2);
        margin-left: 0;

        li {
            margin-left: 0;
            list-style: none;
        }
    }

    .edit-component-wrapper {
        dl {
            margin-bottom: 0;
        }
    }
}

.edit-component-wrapper .cmd-address-data address {
    display: flex;
    flex-direction: column;
    gap: calc(var(--default-gap) / 2);

    dt {
        min-width: 2.5rem;
    }
}

/* end cmd-address-data ------------------------------------------------------------------------------------------ */
</style>