<template>
    <div class="cmd-switch-language">
        <ul>
            <li v-for="(language, index) in languages" :key="index">
                <!-- begin link-type 'href' -->
                <a v-if="language.link.type === 'href'"
                   :href="language.link.path"
                   :class="['flag', language.iso2, {'active': activeLanguage(language.iso2)}]"
                   :title="language.tooltip"
                   @click.prevent="changeLanguage(language.iso2, $event)">
                   <img :src="pathFlag(language.iso2)" :alt="language.name" />
                </a>

                <!-- end link-type 'href' -->

                <!-- begin link-type 'router' -->
                <router-link v-else
                     :to="getRoute(language)"
                     :class="['flag', language.iso2]"
                     :title="language.tooltip"
                     @click.prevent="changeLanguage(language.iso2, $event)">
                    <img :src="pathFlag(language.iso2)" :alt="language.name" />
                </router-link>
                <!-- end link-type 'router' -->
            </li>
        </ul>
    </div>
</template>

<script>
import {getRoute} from "../utilities.js"

export default {
    name: "CmdSwitchLanguage",
    emits: ["click"],
    data() {
        return {
            imageSources: [],
            currentLanguage: ""
        }
    },
    props: {
        /**
         * list of languages
         */
        languages: {
            type: Array,
            required: true
        },
        /**
         * path to flag-files (will be combined with flag isoCode to load svg)
         */
        pathFlags: {
            type: String,
            default: "/media/images/flags"
        }
    },
    mounted() {
          this.getInitialLanguage()
    },
    methods: {
        getInitialLanguage() {
            // assign initially set value for lang in html-tag to data-property
            this.currentLanguage = document.documentElement.lang
        },
        getRoute(language) {
            return getRoute(language)
        },
        activeLanguage(iso2) {
            return this.currentLanguage === iso2
        },
        pathFlag(isoCode) {
            return this.pathFlags + "/flag-" + isoCode + ".svg"
        },
        changeLanguage(iso2, event) {
            // set selected language as current language (in data-property)
            this.currentLanguage = iso2

            // set selected language as value for lang in html-tag
            document.documentElement.lang = iso2

            // emit original event
            this.$emit("click", { originalEvent: event, iso2} )
        }
    }
}
</script>

<style>
/* begin cmd-switch-language ---------------------------------------------------------------------------------------- */
.cmd-switch-language {
    ul {
        display: flex;
        gap: calc(var(--default-gap) / 2);
        margin: 0;

        li {
            list-style-type: none;
            margin: 0;

            a {
                filter: contrast(.6);
                padding: 0; /* overwrite default settings from frontend-framework for .active */
                background: none; /* overwrite default settings from frontend-framework for .active */

                &:hover, &:focus-visible, &:active, &.active, &.router-link-active {
                    filter: none;
                }
            }
        }
    }
}

/* end cmd-switch-language ------------------------------------------------------------------------------------------ */
</style>