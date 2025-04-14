<template>
    <template v-if="mails.length"
              v-for="(mail, index) in mails"
              :key="index">
        <div
            :class="['cmd-mail-tool-entry flex-container box', { unread : !mailIsRead.has(mail.id)}]"
            :title="getMessage('mail_tool_entry.tooltip.read_this_mail')"
        >
            <dl class="no-flex">
                <dt class="flex-container">
                    {{
                        boxType === "inbox" ? getMessage("mail_tool_entry.description_label.from") : getMessage("mail_tool_entry.description_label.to")
                    }}
                </dt>
                <dd class="sender-receiver-wrapper flex-container no-wrap-on-small-devices align-items-center no-flex">
                    <!-- begin CmdImage for contact image -->
                    <CmdImage v-if="mail.cmdImage?.src"
                              :src="mail.cmdImage.src"
                              :alt="mail.cmdImage.alt"
                              :title="mail.cmdImage.title || mail.contactFullName"
                              :useFigureTag="false"
                    />
                    <!-- end CmdImage for contact image -->
                    <span class="contact-full-name">{{ mail.contactFullName }}</span></dd>
                <dt>{{ getMessage("mail_tool_entry.description_label.subject") }}</dt>
                <dd><a href="#" @click.prevent="readMail(mail.id)">{{ mail.subject }}</a></dd>
            </dl>
            <div class="flex-container received-and-options-wrapper no-wrap-on-small-devices">
                <dl class="no-list-items date-time-wrapper">
                    <dt>{{ getMessage("mail_tool_entry.description_label.received") }}</dt>
                    <dd class="flex-container no-wrap-on-small-devices">
                        <time :datetime="mail.isoDate">{{ mailFormatDate(mail.isoDate) }}</time>
                        <time :datetime="mail.time">{{ mailFormatTime(mail.time) }}</time>
                    </dd>
                </dl>
                <div class="options-wrapper flex-container no-wrap-on-small-devices no-flex">
                    <a href="#" @click.prevent="deleteMail(mail.id)" title="Delete this mail">
                        <span class="icon-delete"></span>
                    </a>
                    <a href="#" @click.prevent="toggleReadStatus(mail.id)"
                       :title="mailIsRead.has(mail.id) ? 'Set status to unread' : 'Set status to read'">
                        <span :class="mailIsRead.has(mail.id) ? 'icon-visible' : 'icon-not-visible'"></span>
                    </a>
                    <a href="#" @click.prevent="toggleExpandMail(mail.id)"
                       :title="expandMail.has(mail.id) ? 'Collapse mail content' : 'Expand mail content'">
                        <span
                            :class="expandMail.has(mail.id) ? 'icon-chevron-one-stripe-up' : 'icon-chevron-one-stripe-down'"></span>
                    </a>
                </div>
            </div>
        </div>

        <div v-if="expandMail.has(mail.id)">
            <header>
                mailId: {{ mail.id }}
            </header>
        </div>
    </template>
    <!-- begin CmdSystemMessage (if no mails exist) -->
    <CmdSystemMessage v-else v-bind="cmdSystemMessage"/>
    <!-- end CmdSystemMessage (if no mails exist) -->

</template>

<script>
// import mixins
import I18n from "../mixins/I18n.js"
import DefaultMessageProperties from "../mixins/CmdMailToolEntry/DefaultMessageProperties.js"

// import functions
import {formatDate, formatTime} from "../utils/date.js"

export default {
    name: "CmdMailToolEntry",
    mixins: [I18n, DefaultMessageProperties],
    data() {
        return {
            expandMail: new Set(),
            mailIsRead: new Set()
        }
    },
    props: {
        /**
         * define box type
         *
         * @allowedValues: inbox, outbox
         */
        boxType: {
            type: String,
            default: "inbox"
        },
        /**
         * activate if you want to use the default-slot
         */
        useSlot: {
            type: Boolean,
            default: false
        },
        /**
         * array of mails
         *
         * required-structure for entries:
         * {
         *     cmdImage: Object (structure for CmdImage-component used for image of contact)
         *     contactFullName: String
         *     subject: String
         *     isoDate: String (formatted as iso-date: YYYY-MM-DD)
         *     time: String (formatted as time: HH:MM)
         * }
         */
        mails: {
            type: Array,
            required: true
        },
        /**
         * date-format for mails
         *
         * @allowedValues: "dmy", "mdy", "ymd"
         */
        dateFormat: {
            type: String,
            default: "dmy"
        },
        /**
         * dateSeparator for mails
         */
        dateSeparator: {
            type: String,
            default: "."
        },
        /**
         * timeFormat for mails
         *
         * @allowedValues: "12", "24"
         */
        timeFormat: {
            type: String,
            default: "24"
        },
        /**
         * properties for CmdSystemMessage-component
         */
        cmdSystemMessage: {
            type: Object,
            default() {
                return {
                    validationStatus: "info",
                    systemMessage: "No mails found!",
                    showCloseIcon: false
                }
            }
        }
    },
    methods: {
        mailFormatDate(date) {
            return formatDate(date, this.dateFormat, this.dateSeparator)
        },
        mailFormatTime(time) {
            return formatTime(time, this.timeFormat)
        },
        readMail(id) {
            this.mailIsRead.add(id)
            this.expandMail.add(id)
        },
        deleteMail(id) {
            if (confirm("Are you sure you want to delete this mail?")) {
                this.$emit("deleteMail", id)
            }
        },
        toggleReadStatus(id) {
            if (this.mailIsRead.has(id)) {
                this.mailIsRead.delete(id)
            } else {
                this.mailIsRead.add(id)
            }
        },
        toggleExpandMail(id) {
            if (this.expandMail.has(id)) {
                this.expandMail.delete(id)
            } else {
                this.expandMail.add(id)
            }
        }
    }
}
</script>

<style>
/* begin cmd-mail-tool-entry -------------------------------------------------------------------------------------------- */
.cmd-mail-tool-entry {
    justify-content: space-between;
    text-decoration: none;
    border: 0;
    border-top: var(--default-border);
    border-radius: 0;

    &:hover, &:active, &:focus {
        cursor: pointer;
        background: var(--color-white);
    }

    &.unread {
        * {
            font-weight: bold;
        }
    }

    dl {
        margin: 0;

        dt {
            align-items: center;
            justify-content: flex-start;
        }

        dd {
            gap: calc(var(--default-gap) / 2);
        }
    }

    .cmd-image {
        width: 3rem;
        aspect-ratio: 1/1;
        border: var(--default-border);
        border-radius: var(--full-circle);
        margin: 0; /* overwrite "a img"-selector from frontend-framework */
    }

    .options-wrapper {
        justify-content: flex-end;
    }

    .sender-receiver-wrapper {
        justify-content: flex-start !important;
    }

    .received-and-options-wrapper {
        flex-direction: column;
        flex: none;

        .date-time-wrapper {
            time {
                flex: none;
            }
        }

        .options-wrapper {
            margin-left: auto;
        }
    }
}
</style>

<style lang="scss">
@import "../assets/styles/variables";


@media only screen and (max-width: $small-max-width) {
    .cmd-mail-tool-entry {
        dl {

            dt {
                align-items: flex-start;
                justify-content: center;
            }
        }

        .received-and-options-wrapper {
            flex-direction: row;
            justify-content: space-between;
        }
    }
}
/* end cmd-mail-tool-entry -------------------------------------------------------------------------------------------- */
</style>