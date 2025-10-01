<template>
    <!-- begin CmdParagraph ---------------------------------------------------------------------------------------- -->
    <p 
        :class="['cmd-paragraph', 'text-align-' + textAlign, 'column-count-' + numberOfColumns]" 
        v-html="content"
    >
    </p>
    <!-- end CmdParagraph ---------------------------------------------------------------------------------------- -->
</template>

<script>
export default {
    name: "CmdParagraph",
    props: {
        /**
         * provide (html-)content
         */
        content: {
            type: String,
            required: true
        },
        /**
         * set the number of columns
         *
         * @affectStyling: true
         * @allowedValues: 1/"1", 2/"2", 3/"3",
         */
        numberOfColumns: {
            type: [String, Number],
            default: 1
        },
        /**
         * set text-align
         * 
         * @affectStyling: partially
         * @allowedValues: "left", "center", "right", "justify"
         */
        textAlign: {
            type: String,
            default: "left",
            validator(value) {
                return value === "left" ||
                    value === "center" ||
                    value === "right" ||
                    value === "justify"
            }
        }
    }
}
</script>