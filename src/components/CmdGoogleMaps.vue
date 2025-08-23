<template>
    <div class="cmd-google-maps responsive-wrapper">
        <!-- begin CmdHeadline -->
         <CmdHeadline v-if="cmdHeadline" v-bind="cmdHeadline" />
        <!-- end CmdHeadline-->
        
        <!-- begin CmdSystemMessage -->
        <CmdSystemMessage v-if="!cookiesAccepted" validationStatus="warning">
            <p>
                {{getMessage("google_maps.system_message.accept_terms")}}
            </p>
            <a href="#" @click.prevent="acceptCookies">{{getMessage("google_maps.button_text.accept_required_cookies")}}</a>
        </CmdSystemMessage>
        <!-- end CmdSystemMessage -->

        <!-- begin iframe with google-map -->
        <iframe
            v-else
            :src="locateAddress"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade">
        </iframe>
        <!-- end iframe with google-map -->
    </div>
</template>

<script>
// import mixins
import I18n from "../mixins/I18n"
import DefaultMessageProperties from "../mixins/CmdGoogleMaps/DefaultMessageProperties"
import {setCookieDisclaimerCookie, getCookieDisclaimerCookie} from "../utils/cookie"

export default {
    name: "CmdGoogleMaps",
    mixins: [
        I18n,
        DefaultMessageProperties
    ],
    data() {
        return {
            cookiesAccepted: false
        }
    },
    props: {
        /**
         * toggle system-message and map-visibility depending on the accepted cookies
         *
         * for data-privacy reasons the google-map may not be show without accepting cookies
         */
        cookiesAlreadyAccepted: {
            type: Boolean,
            default: false
        },
        /**
         * address to show on Google Maps&trade;
         */
        address: {
            type: Object,
            required: true
        },
        /**
         * properties for cmdHeadline-component
         */
        cmdHeadline: {
            type: Object,
            required: false
        }
    },
    mounted() {
        if(getCookieDisclaimerCookie().includes("google-maps")) {
            this.cookiesAccepted = true
        }
    },
    computed: {
        locateAddress() {
            if(this.address) {
                const url = new URL("https://maps.google.de/maps?ie=UTF8&t=&z=17&iwloc=B&output=embed")
                url.searchParams.set("hl", "de")
                url.searchParams.set("q", [this.address.streetNo, this.address.zip, this.address.city, this.address.country, this.address.latitude, this.address.longitude, this.address.location].join(" ").trim())
                return url
            }
            return "https://maps.google.de/maps?ie=UTF8&t=&z=17&iwloc=B&output=embed"
        }
    },
    methods: {
        acceptCookies() {
            setCookieDisclaimerCookie(["google-maps"])
            this.cookiesAccepted = true
            this.$emit("click", this.cookiesAccepted)
        }
    },
    watch: {
        cookiesAlreadyAccepted: {
            handler() {
                this.cookiesAccepted = this.cookiesAlreadyAccepted
            },
            immediate: true
        }
    }
}
</script>

<style>
/* begin cmd-google-maps ---------------------------------------------------------------------------------------- */
.cmd-google-maps {
    border: var(--default-border);
    border-radius: var(--default-border-radius);

    &:hover, &:active, &:focus {
        border-color: var(--hyperlink-color-highlighted);
    }

    iframe {
        border-radius: inherit;
    }

    .cmd-system-message {
        margin: 0;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
}
/* end cmd-google-maps ------------------------------------------------------------------------------------------ */
</style>