<template>
    <!-- begin boxType 'content' -->
    <div v-if="boxType === 'content'"
         ref="cmdBox"
         :class="[
             'cmd-box box content',
             {
                open : open, collapsible: collapsible,
                'stretch-vertically': stretchVertically && !collapsible,
                'stretch-horizontally': stretchHorizontally,
                'row-view': rowView
             },
             ]"
    >
        <!-- begin collapsible header with slot -->
        <a v-if="collapsible"
           href="#"
           class="box-header"
           :title="open ? iconOpen.tooltip : iconClosed.tooltip"
           @click.prevent="toggleContentVisibility"
        >
            <!-- begin slot 'header' -->
            <slot v-if="useSlots?.includes('header')" name="header"></slot>
            <!-- end slot 'header' -->

            <!-- begin CmdHeadline -->
            <CmdHeadline
                v-else-if="cmdHeadline?.headlineText"
                v-bind="cmdHeadline"
            />
            <!-- end CmdHeadline -->

            <!-- begin CmdIcon -->
            <CmdIcon
                :iconClass="open ? iconOpen.iconClass : iconClosed.iconClass"
                :type="open ? iconOpen.iconType : iconClosed.iconType"
            />
            <!-- end CmdIcon -->
        </a>
        <!-- end collapsible header with slot -->

        <!-- begin default header with slot -->
        <template v-else>
            <div v-if="useSlots?.includes('header') || cmdHeadline?.headlineText" class="box-header">
                <!-- begin slot 'header' -->
                <slot v-if="useSlots?.includes('header')" name="header"></slot>
                <!-- end slot 'header' -->

                <!-- begin CmdHeadline -->
                <CmdHeadline
                    v-if="cmdHeadline?.headlineText"
                    v-bind="cmdHeadline"
                />
                <!-- end CmdHeadline -->
            </div>
        </template>
        <!-- end default header with slot -->

        <!-- begin box-body -->
        <div v-show="open" :class="['box-body', boxBodyClass]" aria-expanded="true" role="article">
            <div v-if="useSlots?.includes('body')"
                 :class="{'default-padding': useDefaultPadding, 'allow-scroll': allowContentToScroll}"
                 ref="boxBody"
                 :style="allowContentToScroll ? 'max-height: ' + calculatedBodyHeight : null"
            >
                <!-- begin slot 'body' -->
                <slot name="body">
                    <transition-group :name="toggleTransition">
                        <p :class="{
                           'cutoff-text': cutoffTextLines > 0,
                           'fade-last-line': fadeLastLine && !showCutOffText,
                           'show-text' : showCutOffText
                       }">
                            {{ textBody }}
                        </p>
                        <a v-if="cutoffTextLines > 0" href="#" @click.prevent="toggleCutOffText">
                            {{
                                showCutOffText ? getMessage("cmdbox.contentbox.collapse_text") : getMessage("cmdbox.contentbox.expand_text")
                            }}
                        </a>
                    </transition-group>
                </slot>
                <!-- end slot 'body' -->
            </div>

            <template v-else>
                <img v-if="image" :src="image.src" :alt="image.altText"/>

                <div v-else :class="{'default-padding': useDefaultPadding, 'allow-scroll': allowContentToScroll}">
                    <!-- begin CmdHeadline -->
                    <CmdHeadline
                        v-if="cmdHeadline?.headlineText && repeatHeadlineInBoxBody"
                        v-bind="cmdHeadline"
                    />
                    <!-- end CmdHeadline -->

                    <p v-if="textBody">{{ textBody }}</p>
                </div>
            </template>
        </div>
        <!-- end box-body -->

        <div v-if="useSlots?.includes('footer')" class="box-footer">
            <!-- begin slot 'footer' -->
            <slot name="footer"></slot>
            <!-- end slot 'footer' -->
        </div>
    </div>
    <!-- end boxType 'content' -->

    <!-- begin boxType 'product' -->
    <a v-else-if="boxType === 'product' && product"
       :class="['cmd-box box product', {'stretch-vertically': stretchVertically, 'stretch-horizontally': stretchHorizontally, 'row-view': rowView}]"
       href="#"
       @click.prevent="clickOnProduct(product)">
        <div class="box-header flex-container vertical">
            <figure v-if="product.image !== undefined">
                <img :src="product.image.src" :alt="product.image.alt"/>
                <figcaption>{{ product.name }}</figcaption>
            </figure>
            <p v-else>{{ product.name }}</p>

            <!-- begin ribbons -->
            <div v-if="product.new" class="ribbon-new">
                <span>{{ getMessage("cmdbox.productbox.new") }}</span>
            </div>
            <div v-if="product.discount" class="ribbon-discount">
                <span>{{ product.discount }}</span>
            </div>
            <!-- end ribbons -->
        </div>
        <!-- begin box-body -->
        <div class="box-body">
            <p v-if="product.articleNumber">{{ getMessage("cmdbox.productbox.article_no") }} {{
                    product.articleNumber
                }}</p>
            <p v-if="product.price" class="price">
                <span>{{ product.price }}</span><span :title="globalCurrency.name">{{ globalCurrency.symbol }}</span>
            </p>
            <p v-if="product.description">{{ product.description }}</p>
        </div>
        <!-- end box-body -->
    </a>
    <!-- end boxType 'product' -->

    <!-- begin boxType 'user' -->
    <div v-else-if="boxType === 'user' && user"
         :class="[
             'cmd-box box user',
              profileType,
             {
                'stretch-vertically': stretchVertically,
                'stretch-horizontally': stretchHorizontally,
                'row-view': rowView
             }
         ]">
        <!-- begin box-header -->
        <div class="box-header flex-container vertical">
            <figure v-if="user.image">
                <img :src="user.image.src" :alt="user.image.alt"/>
                <figcaption>{{ user.name }} <span v-if="user.age">, {{ user.age }}</span></figcaption>
            </figure>
            <div v-else>
                <span :class="defaultProfileIconClass" :title="user.name"></span>
                <p v-if="!rowView">{{ user.name }}</p>
            </div>
        </div>
        <!-- end box-header -->

        <!-- begin box-body -->
        <div class="box-body">
            <p v-if="rowView">{{ user.name }}</p>
            <p v-if="user.profession">{{ user.profession }}</p>
            <p v-if="user.position">{{ user.position }}</p>
            <p v-if="user.description" class="description">{{ user.description }}</p>
        </div>
        <!-- end box-body -->

        <!-- begin user-tags -->
        <ul  v-if="user.tags && user.tags.length" class="tags">
            <li v-for="(tag, index) in user.tags" :key="index">
                {{ tag }}
            </li>
        </ul>
        <!-- end user-tags -->

        <!-- begin box-footer -->
        <div v-if="user.links && user.links.length" class="box-footer">
            <CmdListOfLinks :links="user.links" orientation="horizontal" :useGap="false"/>
        </div>
        <!-- end box-footer -->
    </div>
    <!-- end boxType 'user' -->
</template>

<script>
// import mixins
import I18n from "../mixins/I18n"
import DefaultMessageProperties from "../mixins/CmdBox/DefaultMessageProperties"
import GlobalCurrency from "../mixins/GlobalCurrency"

export default {
    name: "CmdBox",
    mixins: [
        I18n,
        DefaultMessageProperties,
        GlobalCurrency
    ],
    emits: ["click", "toggle-collapse"],
    data() {
        return {
            open: this.collapsible ? this.openCollapsedBox : true,
            active: true,
            showCutOffText: false,
            calculatedBodyHeight: this.maxBoxBodyHeight
        }
    },
    props: {
        /**
         * activate to set a collapsible box to open
         */
        openCollapsedBox: {
            type: Boolean,
            required: false
        },
        /**
         * arranges box-content in a row
         *
         * @affectsStyling: true
         */
        rowView: {
            type: Boolean,
            default: false
        },
        /**
         * set boyType to show different types of boxes/contents
         *
         * @allowedValues: content, product, user
         * @affectsStyling: true
         */
        boxType: {
            type: String,
            default: "content",
            validator(value) {
                return value === "content" ||
                    value === "product" ||
                    value === "user"
            }
        },
        /**
         * set if content (in box-body) should scroll
         *
         * (maxBoxBodyHeight must be set)
         */
        allowContentToScroll: {
            type: Boolean,
            default: false
        },
        /**
         * set max-height for body (should only be used if allowContentToScroll-property is active)
         */
        maxBoxBodyHeight: {
            type: String,
            default: "20rem"
        },
        /**
         * activate if box should be collapsible
         */
        collapsible: {
            type: Boolean,
            default: false
        },
        /**
         * number of lines to show if text should be cutoff
         */
        cutoffTextLines: {
            type: Number,
            default: 0
        },
        /**
         * deactivate if no default-padding should be used (has no effect on content given by textBody-property)
         *
         * @affectsStyling: true
         */
        useDefaultPadding: {
            type: Boolean,
            default: true
        },
        /**
         * repeats headline (used in box-header) given by cmdHeadline-property in box-body
         */
        repeatHeadlineInBoxBody: {
            type: Boolean,
            default: false
        },
        /**
         * show fade-effect on last line
         *
         * cutoffTextLines-property must be large 0
         */
        fadeLastLine: {
            type: Boolean,
            default: true
        },
        /**
         * use transition to expand and collapse box-body
         *
         * 'boyType-property' must be set to 'content' and 'collapsible-property' must be activated
         */
        useTransition: {
            type: Boolean,
            default: true
        },
        /**
         * custom class placed on box-body-container
         */
        boxBodyClass: {
            type: String,
            required: false
        },
        /**
         * set default profile-icon (will eb shown if no user-image exists)
         */
        defaultProfileIconClass: {
            type: String,
            default: "icon-user-profile"
        },
        /**
         * the shown product (incl. name, price, image, description)
         *
         * @required: only available for boxtype===product
         */
        product: {
            type: Object,
            required: false
        },
        /**
         * the shown user-profile (incl. name, image, contact-data)
         *
         * @required: only available for boxtype===user
         */
        user: {
            type: Object,
            required: false
        },
        /**
         * profile types for user-boxes
         *
         * @required: only available for boxtype===user
         *
         * @allowedValues: 'business', 'influencer', 'dating'
         */
        profileType: {
            type: String,
            default: "business",
            validator(value) {
                return value === "business" ||
                    value === "influencer" ||
                    value === "dating"
            }
        },
        /**
         * activated if all content (incl. headline) is given by slot
         *
         * if false textBody-property must be set
         */
        useSlots: {
            type: Array,
            required: false
        },
        /**
         * image-object for box-body of content-box
         *
         * src and altText must be set if image is sed
         */
        image: {
            type: Object,
            required: false
        },
        /**
         * String used as content (placed in a paragraph-tag) for box-body
         *
         * should only be used, if no further html-structure is required for box-body
         */
        textBody: {
            type: String,
            default: ""
        },
        /**
         * icon to expand an accordion
         *
         * @requiredForAccessibility: partial
         */
        iconOpen: {
            type: Object,
            default: function () {
                return {
                    iconClass: "icon-chevron-one-stripe-up",
                    tooltip: "Close content",
                    iconType: "auto"
                }
            },
        },
        /**
         * icon to collapse an accordion
         *
         * @requiredForAccessibility: partial
         */
        iconClosed: {
            type: Object,
            default: function () {
                return {
                    iconClass: "icon-chevron-one-stripe-down",
                    tooltip: "Show content",
                    iconType: "auto"
                }
            }
        },
        /**
         * allow box to be stretched as wide as parent-element
         */
        stretchHorizontally: {
            type: Boolean,
            default: true
        },
        /**
         * allow box to be stretched as high as parent-element
         */
        stretchVertically: {
            type: Boolean,
            default: true
        },
        /**
         * properties for CmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        }
    },
    /*
    mounted() {
        if (this.allowContentToScroll && this.$refs.boxBody) {
            const topPosition = this.$refs.boxBody.getBoundingClientRect().top
            this.calculatedBodyHeight = (document.documentElement.clientHeight - topPosition) + "px"
        }
    },*/
    computed: {
        toggleTransition() {
            if (this.useTransition) {
                return "fade"
            }
            return ""
        }
    },
    methods: {
        // for collapsible boxes of boxType === content
        toggleContentVisibility() {
            this.open = !this.open
            this.active = !this.active

            this.$emit('toggle-collapse', this.open)
        },
        // toggle cutofftext (between full and faded text)
        toggleCutOffText() {
            this.showCutOffText = !this.showCutOffText
            this.$emit('toggle-cutofftext', this.showCutOffText)
        },
        // for boxType === product
        clickOnProduct(product) {
            this.$emit('click', product)
        },
        // set focus on first input if box contains form-elements
        setFocus() {
            this.$nextTick(() => {
                if(this.open) {
                   const firstFormElement = this.$refs.cmdBox.querySelector(":is(input, select, textarea):first-of-type")

                    if(firstFormElement) {
                       firstFormElement.focus()
                    }
                }
            })
        }
    },
    watch: {
        openCollapsedBox() {
            // toggle collapse-status of all boxes if changed in outer component
            if (this.collapsible) {
                this.open = this.openCollapsedBox
                this.setFocus()
            }
        },
        open() {
            this.setFocus()
        }
    }
}
</script>

<style>
/* begin cmd-box ---------------------------------------------------------------------------------------- */
.cmd-box {
    display: inline-flex;
    flex-direction: column;
    padding: 0;
    align-self: start;

    &.stretch-horizontally {
        display: flex;
        width: 100%;
    }

    &.stretch-vertically {
        height: 100%;
    }

    .box-header .cmd-headline {
        margin-bottom: 0;
    }

    /* collapsible box only */
    &.collapsible {
        a.box-header {
            justify-content: space-between;
            background: var(--box-header-background);
            border-radius: var(--box-border-radius);

            &:hover, &:active, &:focus {
                background: var(--pure-white);

                * {
                    color: var(--hyperlink-color);
                }
            }
        }
    }

    .box-body {
        .allow-scroll {
            overflow-y: auto;

            & * {
              flex-shrink: 0;
            }
        }
    }

    /* boyType === 'content' */
    &.content {
        > * {
            *:last-child {
                margin-bottom: 0;
            }
        }

        &.open {
            > .box-header {
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }

            fieldset {
                border: 0;
                padding: var(--default-padding);
            }
        }

        > .box-header {
            text-decoration: none;

            > .cmd-custom-headline {
                margin-bottom: 0;
            }

            * {
                color: var(--pure-white);
                margin-bottom: 0;
            }

            > .toggle-icon {
                margin-left: auto;
            }

            > .toggle-icon, .toggle-icon > [class*="icon-"] {
                font-size: var(--font-size-small);
            }
        }

        .box-body {
            display: flex;
            flex-grow: 1;
            border-top: var(--box-border);

            & > div:only-child {
                flex-grow: 1;
            }

            p.cutoff-text {
                padding: var(--default-padding);
                margin: 0;
                overflow: hidden;
                height: calc(var(--line-of-text-height) * v-bind(cutoffTextLines));

                &.fade-last-line::after {
                    content: "";
                    width: 100%;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    height: calc(var(--line-of-text-height) * 3);
                    background: linear-gradient(to bottom, transparent 0%, var(--default-background) 100%);
                }

                &.show-text {
                    height: auto;
                }

                & + a {
                    border-top: var(--box-border);
                    display: block;
                    padding: var(--default-padding);
                    margin: 0;
                }
            }

            img {
                display: block;
                border-radius: 0;
            }

            .navigation {
                margin: 0;
                height: 100%;

                li {
                    list-style-type: none;
                    margin: 0;

                    a {
                        display: block;
                        padding: var(--default-padding);
                        text-decoration: none;
                        border-bottom: var(--box-border);

                        &:hover, &:active, &:focus {
                            background: var(--primary-color);
                            color: var(--pure-white);
                        }
                    }

                    &:last-child {
                        a {
                            border: 0;
                        }
                    }
                }
            }
        }
    }

    /* boyType === 'product' and boxType === 'user' */
    &.product, &.user {
        > div {
            > .cmd-custom-headline {
                margin-top: var(--default-margin);
                justify-content: center;
            }
        }
    }

    /* boyType === 'product' */
    &.product {
        text-decoration: none;
        overflow: hidden;

        [class*="ribbon"] {
            position: absolute;
            z-index: 10;
            overflow: hidden;
            width: 10rem;
            height: 10rem;
            top: 0;
            left: 0;

            span {
                position: absolute;
                display: block;
                transform: rotate(-45deg);
                width: 100%;
                top: 15%;
                left: -25%;
                background: var(--error-color);
                font-weight: bold;
                color: var(--pure-white);
                text-transform: uppercase;
                text-align: center;
            }
        }

        .ribbon-discount {
            left: auto;
            right: 0;

            span {
                transform: rotate(45deg);
                right: -20%;
                left: auto;
                background: green;
            }
        }

        > .box-header {
            padding: 0;

            > img, > div {
                display: table;
                margin: 0 auto;
            }

            img {
                border: 0;
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }

            figcaption {
                font-size: 2rem;
                font-weight: bold;
                padding: var(--default-padding);
            }
        }

        .box-body {
            flex-grow: 1;
            padding: var(--default-padding);
            padding-bottom: 0;

            > * {
                text-align: center;
            }

            .price {
                font-size: 1.8rem;
                font-weight: bold;

                span:last-child {
                    margin-left: calc(var(--default-margin) / 2);
                }
            }
        }

        &:hover, &:active, &:focus {
            border-color: var(--hyperlink-color-highlighted);
        }
    }

    /* boxType === 'user' */
    &.user {
        > .box-header {
            --default-icon-size: 6rem;
            --box-header-text-color: var(--primary-color);

            background: none;

            > div:first-child > [class*="icon-"] {
                aspect-ratio: 1/1;
            }

            img, > div:first-child > [class*="icon-"] {
                display: table;
                margin: 0 auto var(--default-margin) auto;
                padding: calc(var(--default-padding) * 3);
                border-radius: var(--full-circle);
                background: var(--box-header-background);
                color: var(--pure-white);

                & + p, & + figcaption {
                    margin: 0 auto;
                    text-align: center;
                    font-weight: bold;
                    font-size: 2rem;
                }
            }

            img {
                padding: 0;
                width: calc(var(--default-icon-size) * 2);
                aspect-ratio: 1/1;
            }

            > div:first-child > [class*="icon-"] {
                margin: 0;
                font-size: var(--default-icon-size);
            }
        }

        .box-body {
            flex-grow: 1;
            padding: var(--default-padding);
            padding-top: 0;

            p {
                text-align: center;
                font-weight: bold;

                &:last-child {
                    margin-bottom: 0;
                }

                &.description {
                    font-weight: normal;
                }
            }
        }

        .box-footer {
            margin-top: auto;
            padding: 0;
            border-top: var(--box-border);

            .cmd-list-of-links {
                ul {
                    width: 100%;
                    margin-bottom: 0;

                    li {
                        flex: 1;
                        border-radius: var(--box-border-radius);

                        a {
                            flex: 1;
                            padding: var(--default-padding);
                            text-align: center;
                            background: var(--color-scheme-background);
                            border-left: var(--box-border);
                            border-radius: var(--box-border-radius);
                        }

                        &:hover, &:active, &:focus {
                            a {
                                background: var(--primary-color);
                                color: var(--pure-white);

                                span, [class*="icon-"] {
                                    color: var(--pure-white);
                                }
                            }
                        }

                        &:first-child {
                            a {
                                border: 0;
                            }
                        }
                    }
                }
            }
        }

        &.row-view {
            [class*="icon"] {
                --default-icon-size: 3rem;
            }

            .box-header > div:first-child > [class*="icon-"] {
                padding: calc(var(--default-padding) * 1.5);
            }

            .box-body p {
                text-align: left;
            }

            .box-footer {
                border: 0;
                background: none;

                .cmd-list-of-links {
                    background: none;

                    ul, ul * {
                        border: 0;
                        background: inherit;
                    }
                }
            }
        }
    }
}

/* end cmd-box ------------------------------------------------------------------------------------------ */
</style>