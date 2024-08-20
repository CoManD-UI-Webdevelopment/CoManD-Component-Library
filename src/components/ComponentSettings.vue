<template>
    <CmdBox
        :use-slots="['body']"
        :collapsible="true"
        :cmdHeadline="{headlineText: readableName(componentName), headlineLevel: 4, cmdIcon: {iconClass: 'icon-settings-template'}}"
        :openCollapsedBox="true"
        boxBodyClass="settings-body"
    >
        <template v-slot:body>
            <CmdFormElement
                v-for="(prop) in filteredProps" :key="prop.name"
                :element="formElement(prop)"
                :type="formType(prop)"
                :labelText="readableName(prop.name)"
                :placeholder="readableName(prop.name)"
                :toggleSwitch="prop.toggleSwitch"
                :colored="true"
                :selectOptions="selectOptions(prop)"
                :modelValue="prop.value"
                @update:modelValue="onUpdateProperty(prop.name, $event)"
            />
        </template>
    </CmdBox>
</template>

<script>
export default {
    name: "ComponentSettings",
    data() {
        return {
            currentComponentName: ""
        }
    },
    props: {
        componentName: {
            type: String,
            default: ""
        },
        componentProps: {
            type: Object,
            required: true
        },
        componentSettings: {
            type: Object,
            required: true
        },
        componentControls: {
            type: Object
        }
    },
    computed: {
        filteredProps() {
            return this.filterProperties(this.componentProps, [])
        }
    },
    methods: {
        filterProperties(properties, nameParts) {
            const allProps = []

            for (let key in properties) {
                const propType = typeof properties[key]
                if (propType === "boolean" || propType === "string" || propType === "number" || (propType === "object" && key.slice(0, 3) === "cmd")) {

                    if(propType === "object") {
                        this.filterProperties(properties[key], [...nameParts, key]).forEach((item) => allProps.push(item))
                    } else {
                        const prop = {}

                        if (propType === "boolean") {
                            prop.toggleSwitch = true
                        }

                        prop.name = [...nameParts, key].join(".")
                        prop.type = propType
                        prop.value = properties[key]

                        allProps.push(prop)
                    }
                }
            }

            return allProps
        },
        onUpdateProperty(propName, value) {
            const nameParts = propName.split(".")
            let settings = this.componentSettings
            for (let i = 0; i < nameParts.length - 1; i++) {
                settings = settings[nameParts.shift()]
            }

            if (typeof settings[nameParts[0]] === "number") {
                settings[nameParts[0]] = Number(value)
            } else {
                settings[nameParts[0]] = value
            }
        },
        readableName(name) {
            // remove prefix from current component-name
            let nameWithoutPrefix = name.replace("Cmd", "")

            // remove entire prefix (componentName) for inner-component-properties
            nameWithoutPrefix = nameWithoutPrefix.replace(/^[^.]*\./, '');

            // use a regular expression to find the positions of capital letters
            let capitalPositions = []
            nameWithoutPrefix.replace(/[A-Z]/g, function (match, index) {
                capitalPositions.push(index)
                return match
            })

            // add a space before each capital letter based on the found positions
            for (let i = capitalPositions.length - 1; i >= 0; i--) {
                nameWithoutPrefix = nameWithoutPrefix.slice(0, capitalPositions[i]) + ' ' + nameWithoutPrefix.slice(capitalPositions[i])
            }

            // capitalize first letter
            nameWithoutPrefix = nameWithoutPrefix.charAt(0).toUpperCase() + nameWithoutPrefix.slice(1)

            return nameWithoutPrefix
        },
        formType(prop) {
            if (Array.isArray(this.componentControls?.[prop.name])) {
                return null
            }

            switch (prop.type) {
                case "boolean":
                    return "checkbox"

                case "number":
                    return "number"

                default:
                    return "text"

            }
        },
        formElement(prop) {
            if (Array.isArray(this.componentControls?.[prop.name])) {
                return "select"
            } else {
                return "input"
            }
        },
        selectOptions(prop) {
            if (Array.isArray(this.componentControls?.[prop.name])) {
                return this.componentControls[prop.name]
            } else {
                return null
            }
        }
    },
    watch: {
        componentName: {
            handler() {
                this.currentComponentName = this.componentName
            },
            immediate: true
        }
    }
}
</script>

<style>
.cmd-box .settings-body > div {
    display: flex;
    flex-direction: column;
    gap: calc(var(--default-gap) / 2);
}
</style>
