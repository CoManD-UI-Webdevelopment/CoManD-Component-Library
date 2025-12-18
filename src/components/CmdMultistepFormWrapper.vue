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
                :successSteps="successSteps"
                @click="setCurrentPage($event.index + 1)"
            />
        </slot>
        <!-- begin slot for progress-bar -->

        <!-- begin main content for step -->
        <div v-show="step === currentPage" :class="'multistep-page-' + step" v-for="(step, index) in numberOfPages" :key="index">
            <CmdSystemMessage 
                v-if="validationStatusForSteps.some(item => item.page === currentPage)" 
                :systemMessage="getSystemMessage(currentPage)" 
                validationStatus="error" 
            />
            <!-- begin slot for page content -->
            <slot 
                :name="'page-' + step" 
                :setErrorOnPage="(message) => setErrorOnPage(step, message)" 
                :removeErrorOnPage="() => removeErrorOnPage(step)" 
                :atleastOneStepWithError="atleastOneStepWithError"
                :formDataForPage="formDataForPage(step)"
                :updateFormDataForPage="(event) => updateFormDataForPage(step, event)"
            />
            <!-- end slot for page content -->
        </div>
        <!-- end main content for step -->

        <div v-show="currentPage === numberOfPages" class="multistep-page-last">
            <CmdSystemMessage v-if="pagesWithError.length" validationStatus="error">
                <p>{{ getMessage("multistep_form_wrapper.system_message.please_enter_all_required_data_on_the_pages") }} {{  pagesWithError.join(", ") }}</p>
            </CmdSystemMessage>

             <!-- begin slot for last step -->
            <slot 
                name="page-last"
                :setErrorOnPage="(message) => setErrorOnPage(step, message)" 
                :removeErrorOnPage="() => removeErrorOnPage(step)"
                :atleastOneStepWithError="atleastOneStepWithError"
                :formData="formData"
            />
            <!-- end slot for last step -->
        </div>

        <!-- begin slot for pagination -->
        <slot name="pagination" 
            :currentPage="currentPage" 
            :setPrevPage="setPrevPage" 
            :setNextPage="setNextPage" 
            :disabledPrevLink="currentPage === 1" 
            :disabledNextLink="currentPage === numberOfPages || pageHasError"
        >
            <CmdPagination 
                v-if="cmdPagination.show" 
                :activePage="currentPage"
                :numberOfPages="numberOfPages"
                v-bind="cmdPaginationProperties" 
                @click="setCurrentPage($event.step)"
            />
        </slot>
        <!-- end slot for pagination -->
    </div>
    <!-- end CmdMultistepFormWrapper ---------------------------------------------------------------------------------------- -->
</template>

<script>
// import mixins
import I18n from "../mixins/I18n.js"
import DefaultMessageProperties from "../mixins/CmdMultistepFormWrapper/DefaultMessageProperties.js"

export default {
    name: "CmdMultistepFormWrapper",
    mixins: [
        I18n,
        DefaultMessageProperties
    ],
    data () {
        return {
            currentPage: 1,
            validationStatusForSteps: [],
            inputMade: [],
            formData: {}
        }
    },
    props: {
        defaultInputValues: {
            type: Object,
            required: false
        },
        requiredPages: {
            type: Array,
            default: []
        },
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
    methods: {
        formDataForPage(page) {
            if(!this.formData[page]) {
                this.formData[page] = {}
            }
            return this.formData[page]
        },
        updateFormDataForPage(page, event) {
            this.formData[page] = event
        },
        getSystemMessage(page) {
            const pageEntry = this.validationStatusForSteps.find(item => item.page === page);
            return pageEntry.message
        },
        setErrorOnPage(page, message) {
            const exists = this.validationStatusForSteps.some(item => item.page === page);

            if(!this.inputMade.includes(page)) {
                this.inputMade.push(page) 
            }

            if (!exists) {
                this.validationStatusForSteps.push({ page: page, message: message });
            }
        },
        removeErrorOnPage(page) {
            const index = this.validationStatusForSteps.findIndex(item => item.page === page);
            
            if(!this.inputMade.includes(page)) {
                this.inputMade.push(page) 
            }

            if (index !== -1) {
                this.validationStatusForSteps.splice(index, 1);
            }
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
        pagesWithError() {
            if(this.inputMade.length === 0) {
               return this.requiredPages
            } 
            let errorPages = new Set(this.requiredPages).difference(new Set(this.inputMade))

            for(let i = 0; i < this.validationStatusForSteps.length; i++) {
                errorPages.add(this.validationStatusForSteps[i].page)
            }

            return [...errorPages].toSorted()
        },
        // check if at least one step has status 'error'
        atleastOneStepWithError() {
            if(this.validationStatusForSteps.length > 0 || this.inputMade.length === 0) {
                return true
            }

            const requiredPagesSet = new Set(this.requiredPages)
            const inputMadeSet = new Set(this.inputMade)

            return !requiredPagesSet.isSubsetOf(inputMadeSet) // check if all requiredPages are included in inputMade

        },
        // check if a page ha
        pageHasError() {
            return this.validationStatusForSteps.some((item) => {
                return item.page === this.currentPage
            })
        },
        // get steps filled correctly (status 'success')
        successSteps() {
            const steps = []

            if(this.inputMade.length) {
                for(let i = 0; i < this.numberOfPages; i++) {
                    const success = !this.validationStatusForSteps.find((item) => {
                        return item.page === i + 1
                    })

                    // if no validationStatusForSteps is found (all steps are 'success' ant at least one input was made)
                    if(success && this.inputMade.includes(i + 1)) {
                        steps.push(i + 1)
                    }
                }
            }

            return steps
        },
        // get steps filled incorrectly (status 'error')
        errorSteps() {
            const steps = []
            this.validationStatusForSteps.forEach((item) => {
                steps.push(item.page)
            })

            return steps
        },
        multisteps() {
            const steps = []
            
            for (let i = 1; i <= this.numberOfPages; i++) {
                steps.push(i);
            }

            return steps
        },
        // get number of pages
        numberOfPages() {
            return Object.keys(this.$slots).filter(key => key.startsWith("page-")).length
        },
        // set properties for inner CmdMultistepFormProgressBar
        cmdMultistepFormProgressBarProperties() {
            return {
                show: true,
                showStepNumber: true,
                ...this.cmdMultistepFormProgressBar
            }
        },
        // set properties for inner CmdPagination
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
    },
    watch: {
        defaultInputValues: {
            handler() {
                this.formData = {}
                if(this.defaultInputValues) {
                    for (const page in this.defaultInputValues) {
                        this.formData[page] = {
                            ...this.defaultInputValues[page]
                        }
                    }
                }
            },
            immediate: true,
            deep: true
        }
    }
}
</script>

<style>
/* begin cmd-multistepform-wrapper ------------------------------------------------------------------------------------------ */
.cmd-multistepform-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--default-gap);
}
/* end cmd-multistepform-wrapper ------------------------------------------------------------------------------------------ */
</style>