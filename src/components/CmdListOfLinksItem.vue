<template>
    <!-- begin default-view -->
    <li v-if="!editing" class="cmd-list-of-links-item">
            <!-- begin CmdLink -->
            <!-- do not use v-bind to avoid unnecessary props to be provided for CmdLink causing warnings -->
            <CmdLink
                :linkType="link?.linkType"
                :text="link?.text"
                :path="link?.path"
                :target="link?.target"
                :icon="link?.icon"
                :fancybox="link?.fancybox"
                :tooltip="link?.tooltip"
                :styleAsButton="link?.styleAsButton"
                :primaryButton="link?.primaryButton"
                :styleAsBox="link?.styleAsBox"
                @click="emitClick($event, link)"
            />
            <!-- end CmdLink -->

            <!-- begin CmdListOfLinksItem for nested children -->
            <ul v-if="link?.children?.length">
                <CmdListOfLinksItem
                    v-for="(child, index) in link?.children"
                    :key="index"
                    :link="child"
                />
            </ul>
            <!-- end CmdListOfLinksItem for nested children -->
    </li>
    <!-- end default-view -->

    <!-- begin edit-mode -->
    <template v-else>
        <div class="input-wrapper">
            <CmdFormElement
                element="input"
                type="text"
                labelText="Linktext"
                :showLabel="false"
                placeholder="Linktext"
                v-model="editableText"
            />
        </div>
    </template>
    <!-- end edit-mode -->
</template>

<script>
import EditMode from "../mixins/EditMode.vue"

// import functions
//import {getRoute} from 'comand-component-library'
import {openFancyBox} from "./CmdFancyBox.vue"
import {buildComponentPath, updateHandlerProvider} from "../utils/editmode.js"
export default {
    name: "CmdListOfLinksItem",
    inheritAttrs: false,
    mixins: [EditMode],
    data() {
        return {
            editableText: this.link?.text
        }
    },
    props: {
        /**
         * properties for CmdLink-component
         */
        link: {
            type: Object,
            required: false
        }
    },
    methods: {
        updateHandlerProvider() {
            const text = this.editableText
            return updateHandlerProvider(this, {
                update(props) {
                    props.text = text
                }
            })
        },
        emitClick(event, link) {
            this.$emit("click", {originalEvent: event, link: link})
        }
    }
}
</script>
