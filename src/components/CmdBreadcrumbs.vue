<template>
    <!-- begin CmdBreadcrumbs ---------------------------------------------------------------------------------------- -->
    <ul class="cmd-breadcrumbs">
        <li v-if="breadcrumbLabel" class="breadcrumb-label">{{ breadcrumbLabel }}</li>
        <li v-for="(link, index) in breadcrumbLinks || []" :key="index">
             <CmdLink 
                v-if="!link.type || link.type === 'href' || link.type === 'router'"
                :linkType="link.type"
                :path="link.type === 'href' ? link.path : getRoute(link)"
                :icon="{ iconClass: link.iconClass, type: link.iconType }"
                :text="link.text" 
            />
            <!-- begin no link (recommended for active page)-->
            <span v-else>
                <!-- begin CmdIcon -->
                <CmdIcon v-if="link.iconClass" :iconClass="link.iconClass" :type="link.iconType" />
                <!-- end CmdIcon -->
                <span v-if="link.text">{{ link.text }}</span>
            </span>
            <!-- end no link (recommended for active page)-->

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
    }
}

/* end cmd-breadcrumbs ------------------------------------------------------------------------------------------ */
</style>