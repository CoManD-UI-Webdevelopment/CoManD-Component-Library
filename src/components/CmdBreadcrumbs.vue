<template>
    <!-- begin CmdBreadcrumbs ---------------------------------------------------------------------------------------- -->
    <ul class="cmd-breadcrumbs">
        <li v-if="breadcrumbLabel" class="breadcrumb-label">{{ breadcrumbLabel }}</li>
        <li v-for="(link, index) in breadcrumbLinks || []" :key="index">
            <!-- begin type 'href' -->
            <a  v-if="link.type === 'href'" :href="link.path">
                <!-- begin CmdIcon -->
                <CmdIcon v-if="link.iconClass" :iconClass="link.iconClass" :type="link.iconType" />
                <!-- end CmdIcon -->
                <span v-if="link.text">{{ link.text }}</span>
            </a>
            <!-- end type 'href' -->

            <!-- begin type 'router' -->
            <router-link v-else-if="link.type === 'router'" :to="getRoute(link)">
                <!-- begin CmdIcon -->
                <CmdIcon v-if="link.iconClass" :iconClass="link.iconClass" :type="link.iconType" />
                <!-- end CmdIcon -->
                <span v-if="link.text">{{ link.text }}</span>
            </router-link>
            <!-- end type 'router' -->

            <span v-else>
                <!-- begin CmdIcon -->
                <CmdIcon v-if="link.iconClass" :iconClass="link.iconClass" :type="link.iconType" />
                <!-- end CmdIcon -->
                <span v-if="link.text">{{ link.text }}</span>
            </span>
            <span class="separator" v-if="index < breadcrumbLinks.length - 1">{{ breadcrumbSeparator }}</span>
        </li>
    </ul>
    <!-- end CmdBreadcrumbs ---------------------------------------------------------------------------------------- -->
</template>

<script>
// import functions
import {getRoute} from "../utilities.js"

export default {
    name: "CmdBreadcrumbs",
    props: {
        /**
         * label in front/left of breadcrumbs
         */
        breadcrumbLabel: {
            type: String,
            required: false
        },
        /**
         * list of breadcrumb-links (incl. path, icon and text)
         */
        breadcrumbLinks: {
            type: Array,
            required: false
        },
        /**
         * separator sign between entries
         */
        breadcrumbSeparator: {
            type: String,
            default: ">"
        }
    },
    methods: {
        getRoute(link) {
            return getRoute(link)
        }
    }
}
</script>

<style>
/* begin cmd-breadcrumbs ---------------------------------------------------------------------------------------- */
.cmd-breadcrumbs {
    display: flex;
    margin: 0;

    li {
        display: inherit;
        align-items: center;
        list-style-type: none;
        margin: 0;

        > span.separator {
            padding: 0 calc(var(--default-padding) / 2);
        }

        &.breadcrumb-label {
            margin-right: calc(var(--default-margin) / 2);
        }

        a {
            display: table; /* do not set to (inline-)flex to avoid icon to be underlined by hover/active/focus */
            text-decoration: none;

            &:hover, &:active, &:focus {
                text-decoration: underline;
            }
        }
    }
}

/* end cmd-breadcrumbs ------------------------------------------------------------------------------------------ */
</style>