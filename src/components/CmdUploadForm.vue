<template>
    <!-- begin CmdUploadForm ---------------------------------------------------------------------------------------- -->
    <!-- begin advanced mode -->
    <fieldset v-if="advancedMode" :class="['cmd-upload-form flex-container flex-direction-column', { 'upload-initiated': uploadInitiated }]">
        <legend :class="{'visually-hidden' : !legend.show, 'align-left': legend.align === 'left'}">{{ legend.text }}</legend>
        <CmdHeadline
            v-if="(cmdHeadlineForFieldsetProperties?.show && cmdHeadlineForFieldsetProperties?.headlineText) || editModeContext"
            v-bind="cmdHeadlineForFieldsetProperties"
        />

        <!-- begin CmdSystemMessage -->
        <CmdSystemMessage
            v-if="systemMessageStatus && allSystemMessages.length"
            :allowUserToCloseMessage="false"
            :validationStatus="systemMessageStatus"
            :systemMessage="allSystemMessages.length === 1 ? allSystemMessages[0] : getMessage('upload_form.system_message.the_following_errors_occurred')"
        >
            <ul v-if="allSystemMessages.length > 1">
                <li v-for="(systemMessage, index) in allSystemMessages" :key="index">
                    {{ systemMessage }}
                </li>
            </ul>
        </CmdSystemMessage>
        <!-- end CmdSystemMessage -->

        <div :class="['box flex-container flex-direction-column', { 'drop-area': enableDragAndDrop, 'allow-drop': allowDrop }]"
             v-on="dragAndDropHandler">
            <CmdHeadline v-if="!listOfFiles.length && allowMultipleFileUploads" v-bind="cmdHeadlineNoFilesToUploadProperties" />

            <!-- begin total-upload information -->
            <div v-else class="flex-container flex-direction-column">
                <div v-if="showTotalUpload && listOfFiles.length > 1"
                     class="flex-container flex-direction-column list-files-wrapper">
                    <CmdHeadline v-bind="cmdHeadlineSummaryOfAllFilesProperties" />

                    <ul class="list-of-files total-files">
                        <li class="flex-container flex-items-flex-none">
                            <CmdLink 
                                v-bind="cmdLinkCancelUploadProperties"
                                @click="cancelUpload"
                            />
                            <span>
                              {{ listOfFiles.length }}
                              <template v-if="!allowMultipleFileUploads">
                                {{ getMessage("upload_form.labeltext.file_uploading") }}
                              </template>
                              <template v-else>
                                {{ getMessage("upload_form.labeltext.files_uploading") }}
                              </template>
                            </span>
                            <small
                                :class="[
                              'text-align-right',
                              { error: maxTotalUploadSize > 0 && totalSize > maxTotalUploadSize }
                            ]">
                                ({{ formatSize(totalSize) }})
                            </small>
                            <span class="progressbar" v-if="uploadInitiated">
                                <span>{{ getPercentage(totalUploadProgress) }}</span>
                                <progress
                                    max="100"
                                    :value="totalUploadProgress"
                                    :title="totalBytesUploaded"
                                ></progress>
                            </span>
                        </li>
                    </ul>
                    <hr/>
                </div>
                <!-- end total-upload information -->

                <div v-if="listOfFiles.length" class="flex-container flex-direction-column list-files-wrapper">
                    <CmdHeadline v-bind="cmdHeadlineListOfSelectedFilesProperties" />
                    <!-- begin list of selected files -->
                    <ul class="list-of-files">
                        <li
                            v-for="(uploadFile, index) in listOfFiles"
                            :key="index"
                            class="flex-container flex-items-flex-none"
                        >
                            <CmdLink 
                                v-bind="cmdLinkRemoveFilesFromListProperties"
                                :title="getMessage('upload_form.labeltext.remove_file_from_list', uploadFile.file.name)"
                                @click="removeFile(index)"
                            />
      
                            <span
                                :class="[
                                'text-align-right',
                                uploadFile.allowedType ? 'allowed' : 'not-allowed',
                                { error: uploadFile.error }
                              ]">
                                {{ uploadFile.file.name }} <small>({{ formatSize(uploadFile.file.size) }})</small>
                            </span>

                            <!-- begin progressbar -->
                            <span class="progressbar" v-if="uploadInitiated && !uploadFile.error">
                                <span>{{ getPercentage(uploadFile.progress) }}</span>
                                <!-- do not place inside progress-tag (will not be displayed then) -->
                                <progress
                                    max="100"
                                    :value="uploadFile.progress"
                                    :title="
                                    formatSize(uploadFile.uploadedBytes) + '/' + formatSize(uploadFile.file.size)
                                  "
                                ></progress>
                            </span>
                            <!-- end progressbar -->
                        </li>
                    </ul>
                    <CmdLink
                        v-if="failedUpload"
                        v-bind="cmdLinkResetUploadProperties"
                        @click="cancel"
                    />
                    <hr/>
                </div>
            </div>
            <!-- end list of selected files -->

            <!-- begin upload conditions -->
            <div class="upload-conditions">
                <CmdHeadline 
                    v-if="listOfFiles.length"
                    v-bind="cmdHeadlineSelectFilesProperties" 
                />

                <dl class="small">
                    <template v-if="maxTotalUploadSize > 0">
                        <dt :class="{ error: totalSize > maxTotalUploadSize }">
                            {{ getMessage("upload_form.max_total_upload_size") }}
                        </dt>
                        <dd :class="['text-align-right', { error: totalSize > maxTotalUploadSize }]">
                            {{ formatSize(maxTotalUploadSize) }}
                        </dd>
                    </template>
                    <dt :class="{ error: errors.fileSize }">
                        {{ getMessage("upload_form.max_file_upload_size") }}
                    </dt>
                    <dd :class="['text-align-right', { error: errors.fileSize }]">
                        {{ formatSize(maxFileUploadSize) }}
                    </dd>
                    <dt :class="{ error: errors.fileType }">
                        {{ getMessage("upload_form.allowed_file_types") }}
                    </dt>
                    <dd>
                        <CmdLink 
                            @click="showListOfFileExtensions = !showListOfFileExtensions"
                            v-bind="cmdLinkToggleListOfFileExtensionsProperties"
                        />

                        <!-- begin list of file extensions -->
                        <transition :name="transitionListOfFileExtensions">
                            <ul v-if="showListOfFileExtensions" class="list-of-file-extensions">
                                <li
                                    v-for="(fileExtension, index) in allowedFileExtensions"
                                    :key="index"
                                    :class="{ error: errors.fileType }"
                                >
                                    {{ fileExtension }}
                                </li>
                            </ul>
                        </transition>
                        <!-- end list of file extensions -->
                    </dd>
                </dl>
            </div>
            <!-- end upload conditions -->

            <!-- begin upload-button and drag-and-drop-text -->
            <div class="flex-container flex-direction-column no-gap">
                <CmdLink 
                    class="upload"
                    :disabled="uploadInitiated"
                    @click="selectFiles()"
                    v-bind="cmdLinkSelectFilesProperties"
                />
                <p v-if="enableDragAndDrop" :class="['text-drag-and-drop', { disabled: uploadInitiated }]">
                    <span>{{ getMessage("upload_form.or") }}</span>
                    <strong>
                        {{ getMessage("upload_form.drag_and_drop") }}
                        <template v-if="allowMultipleFileUploads && listOfFiles.length">
                            {{ getMessage("upload_form.additional") }}
                        </template>
                        <template v-if="!allowMultipleFileUploads && listOfFiles.length">
                            {{ getMessage("upload_form.new") }}
                        </template>
                        {{ getMessage("upload_form.files_to_this_area") }}
                    </strong>
                </p>
            </div>
            <!-- end upload-button and drag-and-drop-text -->
        </div>

        <!-- begin CmdFormElement -->
        <CmdFormElement
            v-if="enableComment"
            element="textarea"
            :labelText="getMessage('upload_form.labeltext.comment')"
            v-model="comment"
            :required="commentRequired"
            :validationMessage="commentStatusMessage"
            :placeholder="getMessage('upload_form.placeholder.comment')"
            :status="commentStatusMessage ? 'error' : ''"
        />
        <!-- end CmdFormElement -->

        <!-- begin button-wrapper -->
        <div class="button-wrapper stretch-on-small-devices">
            <CmdLink 
                :disabled="
                    listOfFiles.length === 0 ||
                    (maxTotalUploadSize > 0 && totalSize > maxTotalUploadSize) ||
                    uploadInitiated"
                v-bind="cmdLinkUploadFilesProperties"
                @click="uploadFiles"
            />

            <CmdLink 
                @click="cancel"
                v-bind="cmdLinkCancelIconProperties"
                :class="{ disabled: listOfFiles.length === 0 }"
            />
        </div>
        <!-- end button-wrapper -->
    </fieldset>
    <!-- end advanced mode -->

    <!-- begin simple mode -->
    <a v-else href="#" @click.prevent="selectFiles"
       :class="['cmd-upload-form box', { 'drop-area': enableDragAndDrop, 'allow-drop': allowDrop }]"
       v-on="dragAndDropHandler">
        <!-- begin progressbar -->
        <span v-if="uploadInitiated" class="progressbar">
            <span>{{ getPercentage(totalUploadProgress) }}</span>
            <progress
                max="100"
                :value="totalUploadProgress"
                :title="totalBytesUploaded">
            </progress>
        </span>
        <!-- end progressbar -->

        <!-- begin slot-content -->
        <slot>
            <template v-if="!enableDragAndDrop">
                <template v-if="fileTypeImage">
                    <span>{{ getMessage("upload_form.select_image") }}</span>
                    <!-- begin CmdIcon -->
                    <CmdIcon v-bind="cmdIconImage" />
                    <!-- end CmdIcon -->
                </template>
                <template v-else>
                    <span>{{ getMessage("upload_form.select_file") }}</span>
                    <!-- begin CmdIcon -->
                    <CmdIcon v-bind="cmdIconFileUpload" />
                    <!-- end CmdIcon -->
                </template>
            </template>
            <template v-else>
                <span>{{ getMessage("upload_form.drag_and_drop_file_here") }}</span>
                <!-- begin CmdIcon -->
                <CmdIcon v-bind="cmdIconDragAndDrop" />
                <!-- end CmdIcon -->
            </template>
            <small>{{ getMessage("upload_form.max_upload_size") }} {{ formatSize(maxFileUploadSize) }}</small>
            <small>{{ getMessage("upload_form.allowed_file_types") }} {{ allowedFileExtensions }}</small>
        </slot>
        <!-- end slot-content -->
    </a>
    <!-- end simple mode -->

    <!-- begin CmdFormElement -->
    <CmdFormElement
        element="input"
        type="file"
        :labelText="getMessage('upload_form.labeltext.select_files')"
        :disabled="uploadInitiated"
        :multiple="allowMultipleFileUploads"
        @change="filesSelected"
        ref="formElement"
    />
    <!-- end CmdFormElement -->
    <!-- end CmdUploadForm ---------------------------------------------------------------------------------------- -->
</template>

<script>
// import mixins
import I18n from "../mixins/I18n"
import DefaultMessageProperties from "../mixins/CmdUploadForm/DefaultMessageProperties"

import {getFileExtension} from "../utils/getFileExtension.js"
import axios from "axios"

export default {
    name: "CmdUploadForm",
    emits: ["click", "error", "upload-complete", "upload-file-success"],
    mixins: [I18n, DefaultMessageProperties],
    inject: {
        editModeContext: {
            default: null
        }
    },
    data() {
        return {
            comment: "",
            allowDrop: false,
            listOfFiles: [],
            systemMessages: [],
            defaultSystemMessageStatus: "",
            showListOfFileExtensions: false,
            resetForm: {},
            uploadInitiated: false,
            errors: {}
        }
    },
    created() {
        // Set initial data for resetForm.
        this.resetForm.comment = this.presetComment
        this.resetForm.allowDrop = this.allowDrop
        this.resetForm.listOfFiles = JSON.parse(JSON.stringify(this.listOfFiles))
        this.resetForm.systemMessages = this.systemMessages
        this.resetForm.systemMessageStatus = this.systemMessageStatus
    },
    props: {
         /**
         * define the transition when the list of file extensions is toggled
         * 
         * @allowedValues: "none", "fade", "scroll" 
         */
         transitionListOfFileExtensions: {
            type: String,
            default: "fade"
        },
        /**
         * activate if transition for hiding list of file extensions
         */
        useTransition: {
            type: Boolean,
            default: true
        },
        /**
         * toggle visibility of total upload (number of files, total size, total progress
         */
        showTotalUpload: {
            type: Boolean,
            default: true
        },
        /**
         * toggle if upload is handled by component itself or by outer component
         */
        componentHandlesUpload: {
            type: Boolean,
            default: true
        },
        /**
         * list of allowed file extensions to upload (all can be selected)
         */
        allowedFileExtensions: {
            type: Array,
            required: true
        },
        /**
         * activate if the comment given by the user should be mandatory
         *
         * enableComment-property must be set to true
         */
        commentRequired: {
            type: Boolean,
            default: true
        },
        /**
         * show a message if mandatory comment-textarea is not filled
         *
         * enableComment-property and commentRequired-property must be set to true
         */
        commentStatusMessage: {
            type: String,
            default: ""
        },
        /**
         * enable if files can also be dragged (and dropped) into upload-area
         */
        enableDragAndDrop: {
            type: Boolean,
            default: false
        },
        /**
         * enable if a comment should be possible to left by the user
         */
        enableComment: {
            type: Boolean,
            default: true
        },
        /**
         * preset the comment-textarea
         *
         * enableComment-property must be set to true
         */
        presetComment: {
            type: String,
            default: ""
        },
        /**
         * set to 0 if no maximum for total upload size should be set
         */
        maxTotalUploadSize: {
            type: Number,
            default: 5242880
        },
        /**
         * max file size (in bytes) for each single file
         */
        maxFileUploadSize: {
            type: Number,
            default: 10485760
        },
        /**
         * enable if more than file should be enabled to be selected for upload
         */
        allowMultipleFileUploads: {
            type: Boolean,
            default: false
        },
        /**
         * defines upload options if component handles upload itself
         *
         * componentHandlesUpload-property must be true
         */
        uploadOptions: {
            type: Object,
            required: false
        },
        /**
         * activate to use full upload-form-style and -functionality
         *
         * @affectsStyling: true
         */
        advancedMode: {
            type: Boolean,
            default: true
        },
        /**
         * legend for form
         *
         * useFieldset-property must be activated
         *
         * @requiredForAccessiblity: true
         */
        legend: {
            type: Object,
            default() {
                return {
                    show: true,
                    align: "left",
                    text: "Legend"
                }
            }
        },
        /**
         * set icon for invisible-icon
         */
        iconInvisible: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-not-visible"
                }
            }
        },
        /**
         * set icon class for visible-icon
         */
        iconVisible: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-visible"
                }
            }
        },
        /**
         * properties for CmdIcon for "drag-and-drop"-icon
         */
         cmdIconDragAndDrop: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-not-visible"
                }
            }
        },
         /**
         * properties for CmdIcon for "image"-icon
         */
         cmdIconFileUpload: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-file"
                }
            }
        },
        /**
         * properties for CmdIcon for "image"-icon
         */
         cmdIconImage: {
            type: Object,
            default() {
                return {
                    iconClass: "icon-image"
                }
            }
        },
        /**
         * properties for CmdLink-component for removing (before added) files from list
         * 
         */
        cmdLinkRemoveFilesFromList: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdLink-component for selecting file(s)
         */
        cmdLinkSelectFiles: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdLink-component for uploading file(s)
         */
         cmdLinkUploadFiles: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdLink-component for cancel-icon
         */
         cmdLinkCancelIcon: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdLink-component to toggle the list of file extensions
         * 
         * icon is set by iconVisible- and iconInvisible-properties
         */
        cmdLinkToggleListOfFileExtensions: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdLink-component to reset upload (if upload failed before)
         */
         cmdLinkResetUpload: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdHeadline-component at top of the fieldset
         */
         cmdHeadlineForFieldset: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdHeadline-component shown if no files for upload exist
         */
        cmdHeadlineNoFilesToUpload: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdHeadline-component shown if no file for upload exist
         */
        cmdHeadlineNoFileToUpload: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdHeadline-component for 'summary of all files'
         */
        cmdHeadlineSummaryOfAllFiles: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdHeadline-component for 'list of selected files'
         */
        cmdHeadlineListOfSelectedFiles: {
            type: Object,
            required: false
        },
        /**
         * properties for CmdHeadline-component for 'select additional/new file(s)'
         */
        cmdHeadlineSelectFiles: {
            type: Object,
            required: false
        },
    },
    computed: {
        cmdHeadlineForFieldsetProperties() {
            return {
                show: true,
                headlineLevel: 3,
                ...this.cmdHeadlineForFieldset
            }
        },
        cmdHeadlineNoFilesToUploadProperties() {
            return {
                headlineLevel: 4,
                ...this.cmdHeadlineNoFilesToUpload,
                headlineText: this.allowMultipleFileUploads ? this.getMessage("upload_form.no_files_to_upload") : this.getMessage("upload_form.no_file_to_upload")
            }
        },
        cmdHeadlineListOfSelectedFilesProperties() {
            return {
                headlineLeveL: 4,
                headlineText: this.getMessage("upload_form.headline.list_of_selected_files"),
                ...this.cmdHeadlineListOfSelectedFiles
            }
        },
        cmdHeadlineSummaryOfAllFilesProperties() {
            return {
                headlineLevel: 4,
                headlineText: this.getMessage("upload_form.headline.summary_of_all_files"),
                ...this.cmdHeadlineSummaryOfAllFiles
            }
        },
        cmdHeadlineSelectFilesProperties() {
            return {    
                headlineLevel: 4,
                headlineText: this.allowMultipleFileUploads ? this.getMessage("upload_form.headline.select_additional_files") : this.getMessage("upload_form.headline.select_new_file"),
                ...this.cmdHeadlineSelectFiles
            }
        },
        cmdLinkCancelIconProperties() {
            return {
                linkType: "button",
                highlightLevel: null,
                icon: {
                    iconClass: "icon-cancel-circle"
                },
                text: this.getMessage("upload_form.buttontext.cancel"),
                ...this.cmdLinkCancelIcon
            }
        },
        cmdLinkSelectFilesProperties() {
            return {
                linkType: "button",
                icon: {
                    iconClass: "icon-file-upload"
                },
                text: this.allowMultipleFileUploads ? this.getMessage("upload_form.labeltext.select_files") : this.getMessage("upload_form.labeltext.select_file") ,
                ...this.cmdLinkSelectFiles
            }
        },
        cmdLinkToggleListOfFileExtensionsProperties() {
            return {
                icon: {
                    iconClass: this.showListOfFileExtensions ? this.iconInvisible?.iconClass : this.iconVisible?.iconClass,
                    type: this.showListOfFileExtensions ? this.iconInvisible?.iconType : this.iconVisible?.iconType,
                    tooltip: this.getMessage('upload_form.tooltip.toggle_list_of_allowed_file_types')
                },
                ...this.cmdLinkToggleListOfFileExtensions 
            }
        },
        cmdLinkUploadFilesProperties() {
            return {
                linkType: "button",
                icon: {
                    iconClass: "icon-upload"
                },
                text: this.listOfFiles.length === 1 || !this.allowMultipleFileUploads ? this.getMessage("upload_form.buttontext.upload_file") : this.getMessage("upload_form.buttontext.upload_files"),
                ...this.cmdLinkUploadFiles
            }
        },
        cmdLinkCancelUploadProperties() {
            return {
                icon: {
                    iconClass: "icon-delete",
                    tooltip: this.getMessage('upload_form.labeltext.remove_all_files_from_list')
                },
                ...this.cmdLinkCancelUpload
            }
        },
        cmdLinkRemoveFilesFromListProperties() {
            return {
                icon: {
                    iconClass: "icon-delete"
                },
                ...this.cmdLinkRemoveFilesFromList
            }
        },
        cmdLinkResetUploadProperties() {
            return {
                icon: {
                    iconClass: "icon-loop-left",
                    tooltip: this.getMessage('upload_form.all_files_will_be_removed')
                },
                text: this.getMessage("upload_form.reset_upload"),
                ...this.cmdLinkResetUpload
            }
        },
        fileTypeImage() {
            return this.allowedFileExtensions.some(extension => extension.includes('jpg'));
        },
        failedUpload() {
            return this.listOfFiles.some(file => file.error)
        },
        totalBytesUploaded() {
            const bytes = this.listOfFiles
                .map(uploadFile => [
                    uploadFile.file.size,
                    ((uploadFile.progress || 0) * uploadFile.file.size) / 100
                ])
                .reduce((a, b) => [a[0] + b[0], a[1] + b[1]])
            return this.formatSize(bytes[1]) + "/" + this.formatSize(bytes[0])
        },
        totalSize() {
            let totalSize = 0
            for (let i = 0; i < this.listOfFiles.length; i++) {
                totalSize = totalSize + this.listOfFiles[i].file.size
            }
            return totalSize
        },
        allSystemMessages() {
            if (this.maxTotalUploadSize > 0 && this.totalSize > this.maxTotalUploadSize) {
                return [
                    this.getMessage("upload_form.system_message_total_size_of_files_too_large"),
                    ...this.systemMessages
                ]
            }
            return this.systemMessages
        },
        systemMessageStatus() {
            return this.defaultSystemMessageStatus || (this.allSystemMessages.length ? "error" : "")
        },
        dragAndDropHandler() {
            // register handlers only if drag-and-drop is enabled
            if (this.enableDragAndDrop) {
                return {
                    dragenter: this.dragEnter,
                    dragover: this.dragOver,
                    dragleave: this.dragLeave,
                    drop: this.drop
                }
            }
            return {}
        },
        totalUploadProgress() {
            const progress = this.listOfFiles
                .map(uploadFile => [
                    uploadFile.file.size,
                    ((uploadFile.progress || 0) * uploadFile.file.size) / 100
                ])
                .reduce((a, b) => [a[0] + b[0], a[1] + b[1]])
            return (progress[1] / progress[0]) * 100
        }
    },
    watch: {
        presetComment: {
            handler(newValue) {
                this.comment = newValue
            },
            immediate: true
        }
    },
    methods: {
        getPercentage(percentage) {
            if (percentage) {
                return percentage.toFixed(2) + "%"
            }
            return "0.00%"
        },
        // use imported function as method (to use in template)
        getFileExtension(filename) {
            return getFileExtension(filename)
        },
        selectFiles() {
            let inputFile = this.$refs.formElement.getDomElement().querySelector("input[type='file']")
            inputFile.click()
        },
        dragEnter(event) {
            this.dragOver(event)
        },
        dragOver(event) {
            if (event.dataTransfer && event.dataTransfer.items && event.dataTransfer.items.length > 0) {
                event.dataTransfer.dropEffect = "none"
                let allowed = true
                for (let i = 0, c = event.dataTransfer.items.length; i < c; ++i) {
                    let item = event.dataTransfer.items[i]
                    if (item.kind !== "file" /*|| !this._allowedTypes[item.type]*/) {
                        allowed = false
                        break
                    }
                }
                if (allowed) {
                    event.preventDefault()
                    event.dataTransfer.dropEffect = "copy"
                    this.allowDrop = true
                    // this._handle_dragover(event)
                }
            }
        },
        dragLeave() {
            this.allowDrop = false
        },
        /*
        drag(event) {
          alert("dropped")
          event.dataTransfer.setData("text", event.target.id)
        },
      */
        drop(event) {
            this.allowDrop = false
            if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
                event.preventDefault()
                this.checkFiles(event.dataTransfer.files)
            }
        },
        cancelUpload() {
            // cancel upload for each file
            this.listOfFiles.forEach(file => {
                if (file.abortController) {
                    file.abortController.abort()
                }
            })

            // clear list of files, remove error-highlighting and hide all system-messages afterwards
            this.errors = {}
            this.listOfFiles = []
            this.hideAllSystemMessages()

            // set uploadInitiated to false to enable all disabled buttons
            this.uploadInitiated = false
        },
        cancel() {
            this.cancelUpload()

            // emit click event with argument "cancel" to react in outer component
            this.$emit("click", "cancel")
        },
        filesSelected(event) {
            this.checkFiles(event.target.files)
        },
        checkFiles(files) {
            if (!files.length) {
                return
            }

            this.defaultSystemMessageStatus = ""; // hide systemMessage if already is shown
            this.systemMessages = [] // hide systemMessage if already is shown
            this.errors = {}

            for (let i = 0; i < files.length; i++) {
                // define file-object which will be pushed in listOfFiles
                const uploadFile = {
                    file: files[i],
                    progress: null,
                    uploadedBytes: 0
                }

                // check size for current file
                if (files[i].size > this.maxFileUploadSize) {
                    this.errors.fileSize = true
                    this.systemMessages.push(
                        this.getMessage(
                            "upload_form.system_message.file_size_too_large",
                            files[i].name,
                            files[i].size
                        )
                    )
                    continue
                }

                // check if current file has allowed file-type (else continue with next file)
                if (!this.allowedFileExtensions.includes(getFileExtension(files[i].name))) {
                    this.showListOfFileExtensions = true
                    this.errors.fileType = true
                    this.systemMessages.push(
                        this.getMessage(
                            "upload_form.system_message.not_allowed_file_type",
                            files[i].name,
                            getFileExtension(files[i].name)
                        )
                    )
                    continue
                }

                // check (if multiple files can be selected) if current file already exists in listOfFiles
                if (
                    this.allowMultipleFileUploads &&
                    this.listOfFiles.some(listOfFilesEntry =>
                        this.compareFiles(listOfFilesEntry.file, files[i])
                    )
                ) {
                    this.systemMessages.push(
                        this.getMessage(
                            "upload_form.system_message.duplicate_file",
                            files[i].name,
                            getFileExtension(files[i].name)
                        )
                    )
                    continue
                }

                if (this.allowMultipleFileUploads) {
                    // push file-object (for each valid file) to listOfFiles-array
                    this.listOfFiles.push(uploadFile)
                } else {
                    if (files.length > 1) {
                        this.systemMessages.push(
                            this.getMessage("upload_form.system_message.only_one_file_allowed")
                        )
                    }
                    // assign uploadFile-object (which contains current (and valid) file to listOfFiles-array
                    this.listOfFiles = [uploadFile]
                    break
                }
            }

            if (!this.advancedMode) {
                if (this.systemMessages.length) {
                    this.$emit("error", {messages: this.systemMessages})
                    return
                }
                if (this.listOfFiles.length) {
                    this.uploadFiles()
                }
            }
        },
        compareFiles(file1, file2) {
            return (
                file1.name === file2.name &&
                file1.lastModified === file2.lastModified &&
                file1.size === file2.size
            )
        },
        removeFile(index) {
            /* remove specific file from list */
            this.listOfFiles.splice(index, 1)
            if (!this.listOfFiles.length) {
                this.uploadInitiated = false
            }
            this.hideAllSystemMessages()
        },
        hideAllSystemMessages() {
            // hide all system-messages if all files are removed from list
            if (!this.listOfFiles.length) {
                this.systemMessages = []
            }
        },
        formatSize(size) {
            if (size < 1024) {
                return size
            } else if (size < 1048576) {
                return (size = Math.round((size / 1024) * 100) / 100 + " KB")
            } else {
                return (size = Math.round((size / 1048576) * 100) / 100 + " MB")
            }
        },
        uploadFiles() {
            this.systemMessages = []
            this.errors = {}
            this.defaultSystemMessageStatus = ""

            if (
                this.enableComment &&
                !this.comment &&
                this.commentRequired &&
                this.commentStatusMessage
            ) {
                this.defaultSystemMessageStatus = "error"
                this.systemMessages.push(this.getMessage("upload_form.system_message.fill_required"))
            } else {
                this.uploadInitiated = true

                if (this.componentHandlesUpload && this.uploadOptions && this.uploadOptions.url) {
                    const url = new URL(this.uploadOptions.url, location.href)
                    const formData = new FormData()

                    // // append information about files to formData-object
                    // formData.append(
                    //   this.uploadOptions.filesParam ? this.uploadOptions.filesParam : "files",
                    //   this.listOfFiles.map(uploadFile => uploadFile.file)
                    // )

                    // iterate over additionalParams-object and append to formData-object
                    Object.entries(this.uploadOptions.additionalParams || {}).forEach(([key, value]) =>
                        formData.append(key, value)
                    )

                    // append comment to formData-object
                    if (this.enableComment) {
                        formData.append("comment", this.comment)
                    }

                    const requests = []

                    // iterate over list-of-files to send upload request for each file individually
                    this.listOfFiles.forEach(file => {
                        requests.push(this.uploadSingleFile(url, file, formData))
                    })

                    // check upload-status for each file individually
                    Promise.allSettled(requests).then(results => {
                        // if status equals "rejected" the upload was not successful and the file will not be deleted from list
                        const rejectedFiles = results.filter(result => result.status === "rejected")
                        this.uploadInitiated = false

                        if (rejectedFiles.length) {
                            this.defaultSystemMessageStatus = "error"
                            this.systemMessages.push(
                                this.getMessage(
                                    "upload_form.system_message.some_files_are_not_uploaded_successfully"
                                )
                            )
                        } else {
                            this.defaultSystemMessageStatus = "success"
                            this.systemMessages.push(
                                this.getMessage("upload_form.system_message.all_files_are_uploaded_successfully")
                            )
                        }

                        this.$emit("upload-complete", {success: !rejectedFiles.length})
                    })
                } else {
                    let uploadObj = {}
                    uploadObj.listOfFiles = this.listOfFiles
                    uploadObj.type = "upload"
                    uploadObj.comment = this.comment

                    // emit uploadObj to handle upload by outer component
                    this.$emit("click", uploadObj, this.showMessage)
                }
            }
        },
        onUploadProgress(event, uploadFile) {
            if (event.lengthComputable) {
                uploadFile.progress = (event.loaded / event.total) * 100
                uploadFile.uploadedBytes = event.loaded
            } else {
                uploadFile.progress = null
                uploadFile.uploadedBytes = 0
            }
            this.$forceUpdate()
        },
        uploadSingleFile(url, file, formData) {
            file.abortController = new AbortController()

            // append information about given file to formData-object
            formData.set(
                this.uploadOptions.filesParam ? this.uploadOptions.filesParam : "files",
                file.file
            )

            return (
                axios
                    .post(url, formData, {
                        signal: file.abortController.signal,
                        onUploadProgress: event => this.onUploadProgress(event, file)
                    })
                    // emit information about successful-upload + file
                    .then(response => {
                        this.$emit("upload-file-success", file)
                        return response
                    })
                    // delete uploaded file from list-of-files-array
                    .then(response => {
                        const positionOfFile = this.listOfFiles.indexOf(file)
                        if (positionOfFile !== -1) {
                            this.listOfFiles.splice(positionOfFile, 1)
                        }
                        return response
                    })
                    .catch(error => {
                        this.defaultSystemMessageStatus = "error"
                        this.systemMessages.push(error)
                        file.error = true
                        throw new Error()
                    })
            )
        },
        showMessage(result) {
            if (result === true) {
                this.defaultSystemMessageStatus = "success"
                this.systemMessages.push(this.getMessage("upload_form.system_message.upload_success"))
            } else if (result === false) {
                this.defaultSystemMessageStatus = "error"
                this.systemMessages.push(this.getMessage("upload_form.system_message.upload_failed"))
            }
        },
        resetFields() {
            if (typeof this.resetForm === "object") {
                const resetArr = Object.keys(this.resetForm)
                for (let key of resetArr) {
                    if (typeof this.resetForm[key] === "object") {
                        this[key] = JSON.parse(JSON.stringify(this.resetForm[key]))
                    } else {
                        this[key] = this.resetForm[key]
                    }
                }
            }
        }
    }
}
</script>

<style>
/* begin cmd-upload-form -------------------------------------------------------------------------------------------- */
.cmd-upload-form {
    .cmd-custom-headline {
        margin: 0;
        justify-content: center;
    }

    /* begin box for simple-mode */
    &.box {
        display: inline-flex;
        flex-direction: column;
        background: var(--color-scheme-background-subtle);

        text-decoration: none;
        text-align: center;
        padding: var(--default-padding);

        span {
            margin: 0;

            &[class*="icon-"] {
                font-size: 5rem;
            }
        }
    }
    /* end box for simple-mode */

    .box {
        box-shadow: none;
        background: var(--color-scheme-background);
        border: var(--default-border);
        align-items: center;

        dl {
            justify-content: center;
            text-align: left;

            .list-of-file-extensions {
                display: table;

                > li:only-child {
                    list-style-type: none;
                    margin: 0;
                }
            }
        }
    }

    .total-files {
        > * {
            white-space: nowrap;

            &:not(a) {
                font-weight: bold;
            }
        }
    }

    [class*="list-of-file"] {
        max-height: 10rem;
        overflow-x: hidden;
        overflow-y: auto;
        border: var(--default-border);
        padding: var(--default-padding);
        margin: 0;

        > li {
            flex-wrap: nowrap;

            .progressbar {
                display: table;
                align-self: center;

                progress {
                    &[value] {
                        background: var(--color-scheme-background);

                        &::-moz-progress-bar {
                            border-top-left-radius: var(--default-border-radius);
                            border-bottom-left-radius: var(--default-border-radius);
                            background: var(--primary-color);
                        }
                    }
                }

                & > span {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 1;
                    display: table;
                    top: .2rem;
                    padding: .1rem .2rem;
                    line-height: 100%;
                    background: var(--color-scheme-background);
                }
            }
        }
    }

    .list-files-wrapper {
        justify-content: center;
        align-items: center;

        .list-of-files {
            display: inline-flex;
            flex-direction: column;
            gap: calc(var(--default-gap) / 2);

            li {
                list-style-type: none;
                margin-left: 0;
                gap: calc(var(--default-gap) / 2);

                > a:hover, a:active, a:focus {
                    ~ * {
                        color: var(--hyperlink-color-highlighted);
                    }
                }
            }

            & + a {
                display: table;
                margin: 0 auto;
            }
        }

        hr {
            width: 100%; /* will be 0 instead (because of align-items: center for parent) */
        }
    }

    .upload-conditions {
        .cmd-headline > * {
            text-align: center;
        }

        dl {
            margin: 0;
        }
    }

    p {
        &.text-drag-and-drop {
            &.disabled {
                background: none !important; /* overwrite default styling for .disabled */
            }
        }
    }

    .button.upload {
        align-self: center;

        & ~ p {
            & > * {
                display: block;
            }
        }
    }

    .error {
        color: var(--error-color-text);
    }

    & + .cmd-form-element {
        display: none;
    }

    .drop-area, &.drop-area {
        border: var(--default-border);
        border-style: dashed;
        background: var(--color-scheme-background);
        padding: var(--default-padding);
        text-align: center;

        &.allow-drop {
            border-style: solid;
        }

        > [class*="icon-"] {
            font-size: 5rem;
        }
    }
}

/* end cmd-upload-form ---------------------------------------------------------------------------------------------- */
</style>
