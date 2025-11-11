<template>
    <!-- begin CmdMultistepFormWrapper ---------------------------------------------------------------------------------------- -->
    <div class="cmd-multistepform-wrapper">
        <!-- begin slot for progress-bar -->
        <slot name="progress-bar" :setCurrentPage="setCurrentPage" :numberOfPages="numberOfPages">
            <CmdMultistepFormProgressBar 
                v-if="cmdMultistepFormProgressBar.show" 
                v-bind="cmdMultistepFormProgressBarProperties"
                :multisteps="multisteps"
                :activeStep="currentPage - 1"
                :errorSteps="errorSteps"
                @click="setCurrentPage($event.index + 1)"
            />
        </slot>
        <!-- begin slot for progress-bar -->

        <div v-show="page === currentPage" :class="'multistep-page-' + page" v-for="(page, index) in numberOfPages" :key="index">
            <CmdSystemMessage v-if="pagesWithError.some(item => item.page === page)" :systemMessage="getSystemMessage(page)" validationStatus="error" />
            page: {{ page }}<br />
            index: {{ index }}<br />
            currentPage: {{ currentPage }}<br />
            errorSteps: {{ errorSteps }}

            <!-- begin slot for page content -->
            <slot :name="'page-' + page" :setErrorOnPage="(message) => setErrorOnPage(page, message)" :removeErrorOnPage="removeErrorOnPage">
            </slot>
            <!-- end slot for page content -->
        </div>

        <!-- begin slot for pagination -->
        <slot name="pagination" 
            :currentPage="currentPage" 
            :setPrevPage="setPrevPage" 
            :setNextPage="setNextPage" 
            :disabledPrevLink="currentPage === 1" 
            :disabledNextLink="currentPage === numberOfPages"
        >
            <CmdPagination 
                v-if="cmdPagination.show" 
                :activePage="currentPage"
                :numberOfPages="numberOfPages"
                v-bind="cmdPaginationProperties" 
                @click="setCurrentPage($event.page)"
            />
        </slot>
        <!-- end slot for pagination -->
    </div>
    <!-- end CmdMultistepFormWrapper ---------------------------------------------------------------------------------------- -->
</template>

<script>
export default {
    name: "CmdMultistepFormWrapper",
    data () {
        return {
            currentPage: 1,
            pagesWithError: []
        }
    },
    props: {
        /**
         * properties for CmdMultistepFormProgressBar-component
         */
        cmdMultistepFormProgressBar: {
            type: Object,
            default() {
                return {
                    show: true
                }
            }
        },
         /**
         * properties for CmdMultistepFormProgressBar-component
         */
        showButtonWrapper: {
            type: Boolean,
            default: true
        },
         /**
         * properties for CmdLink-component
         */
        cmdLinkPrevious: {
            type: Object,
            required: false
        },
         /**
         * properties for CmdLink-component
         */
        cmdLinkNext: {
            type: Object,
            required: false
        },
         /**
         * properties for CmdPagination-component
         */
        cmdPagination: {
            type: Object,
            default() {
                return {
                    show: true
                }
            }
        }
    },
    mounted() {
        console.log("slots:", this.$slots)
    },
    methods: {
        getSystemMessage(page) {
            const pageEntry = this.pagesWithError.find(item => item.page === page);
            return pageEntry.message
        },
        setErrorOnPage(page, message) {
            const exists = this.pagesWithError.some(item => item.page === page);
            
            if (!exists) {
                this.pagesWithError.push({ page: page, message: message });
            }
        },
        removeErrorOnPage() {
            this.pagesWithError = []
        },
        setCurrentPage(page) {
            this.currentPage = page
        },
        setPrevPage() {
            if (this.currentPage > 1) {
                this.currentPage--
            } 
        },
        setNextPage() {
            if (this.currentPage < this.numberOfPages) {
                this.currentPage++
            } 
        }
    },
    computed: {
        errorSteps() {
            const steps = []
            this.pagesWithError.find((item) => {
                steps.push(item.page)
            })
            console.log("steps", steps)

            return steps
        },
        multisteps() {
            const steps = []
            
            for (let i = 1; i <= this.numberOfPages; i++) {
                steps.push(i);
            }

            return steps
        },
        numberOfPages() {
            return Object.keys(this.$slots).filter(key => key.startsWith("page-")).length
        },
        cmdMultistepFormProgressBarProperties() {
            return {
                show: true,
                showStepNumber: true,
                ...this.cmdMultistepFormProgressBar
            }
        },
        cmdPaginationProperties() {
            return {
                pages: null,
                itemsPerPage: null,
                showPageNumbers: true,
                linkType: "href",
                prevLink: {
                    iconClass: "icon-chevron-one-stripe-left",
                    text: "prev",
                    showText: true
                },
                nextLink: {
                    iconClass: "icon-chevron-one-stripe-right",
                    text: "next",
                    showText: true
                }
            }
        }
    }
}
</script>

<style>

</style>