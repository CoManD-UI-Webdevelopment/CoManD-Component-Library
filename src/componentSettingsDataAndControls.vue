<script>
import navigationData from "@/assets/data/main-navigation.json"

export default {
data() {
    return {
        cmdAddressDataSettingsData: {
            useSlot: false,
            showLabelIcons: true,
            showLabelTexts: false,
            showIconsOnly: false,
            showLabels: true
        },
        cmdBankAccountDataSettingsData: {
            allowCopyByClick: false,
            additionalInformation: ""
        },
        cmdBreadcrumbsSettingsData: {
            breadcrumbLabel: "You are here",
            breadcrumbSeparator: ">"
        },
        cmdBoxSettingsData: {
            openCollapsedBox: false,
            rowView: false,
            boxType: "content",
            collapsible: false,
            cutoffTextLines: 0,
            useDefaultPadding: true,
            repeatHeadlineInBoxBody: false,
            fadeLastLine: true,
            useTransition: false,
            boxBodyClass: "",
            profileType: "business",
            textBody: "",
            stretchHorizontally: true,
            stretchVertically: true,
            product: {
                "name": "Product name 1",
                "image": {
                    "src": "media/images/demo-images/medium/landscape-01.jpg",
                    "alt": "Alternative text"
                },
                "articleNumber": "AB12345",
                "price": 123.45,
                "description": "This is a short description text for the product",
                "new": false,
                "discount": ""
            },
            user: {
                "name": "User name 1",
                "age": 35,
                "gender": "m",
                "imageSrc": "/media/images/user-images/fake-user-1.jpg",
                "profession": "User profession",
                "position": "User position",
                "description": "User profile with image",
                "tag": [
                    "Tagname",
                    "Long tag",
                    "One more tag"
                ],
                "links": [
                    {
                        "path": "mailto:",
                        "iconClass": "icon-mail",
                        "tooltip": "Send mail"
                    }
                ]
            }
        },
        cmdBoxSettingsControls: {
            "boxType": [
                {
                    text: "Content (default)",
                    value: "content"
                },
                {
                    text: "Product",
                    value: "product"
                },
                {
                    text: "User",
                    value: "user"
                }
            ]
        },
        cmdFakeSelectSettingsData: {
            showSelectAllOptions: true,
            status: "",
            labelText: "Fake selectbox:",
            showLabel: true,
            textPleaseSelect: "Please select\u2026",
            title: "Title for FakeSelect",
            defaultOptionName: "Select an option:",
            showStatusIcon: true,
            id: "cmd-fake-select-configurable",
            useCustomTooltip: true,
            type: "default",
            required: true
        },
        cmdFakeSelectSettingsControls: {
            type: [
                {
                    text: "Default (default)",
                    value: "default"
                },
                {
                    text: "Color",
                    value: "color"
                },
                {
                    text: "Country",
                    value: "country"
                },
                {
                    text: "Content",
                    value: "content"
                },
                {
                    text: "Checkbox options",
                    value: "checkboxOptions"
                }
            ],
            optionLinkType: [
                {
                    text: "Href (default)",
                    value: "href"
                },
                {
                    text: "Router",
                    value: "router"
                }
            ],
            status: [
                {
                    text: "None (default)",
                    value: ""
                },
                {
                    text: "Error",
                    value: "error"
                },
                {
                    text: "Warning",
                    value: "warning"
                },
                {
                    text: "Success",
                    value: "success"
                },
                {
                    text: "Info",
                    value: "info"
                }
            ]
        },
        cmdFormElementSettingsData: {
            element: "input",
            type: "text",
            labelText: "Inputfield:",
            placeholder: "Placeholder text",
            required: true,
            showRequirements: true,
            tooltipText: "This is a tooltip",
            status: "",
            showSearchButton: true,
            selectOptions: [
                {
                    text: "Please select...",
                    value: ""
                },
                {
                    text: "Option 1",
                    value: "option1"
                },
                {
                    text: "Option 2",
                    value: "option2"
                },
                {
                    text: "Option 3",
                    value: "option3"
                }
            ]
        },
        cmdFormElementSettingsControls: {
            element: [
                {
                    text: "Input (default)",
                    value: "input"
                },
                {
                    text: "Select",
                    value: "select"
                },
                {
                    text: "Textarea",
                    value: "textarea"
                }
            ],
            type: [
                {
                    text: "Text (default)",
                    value: "text"
                },
                {
                    text: "Number",
                    value: "number"
                },
                {
                    text: "Email",
                    value: "email"
                },
                {
                    text: "Telephone",
                    value: "tel"
                },
                {
                    text: "Date",
                    value: "date"
                },
                {
                    text: "Search",
                    value: "search"
                },
                {
                    text: "Password",
                    value: "password"
                },
                {
                    text: "Checkbox",
                    value: "checkbox"
                },
                {
                    text: "Radio(button)",
                    value: "radio"
                }
            ],
            status: [
                {
                    text: "None (default)",
                    value: ""
                },
                {
                    text: "Error",
                    value: "error"
                },
                {
                    text: "Warning",
                    value: "warning"
                },
                {
                    text: "Success",
                    value: "success"
                },
                {
                    text: "Info",
                    value: "info"
                }
            ]
        },
        cmdHeadlineSettingsData: {
            preHeadlineText: "Pre-headline text",
            headlineText: "Headline text",
            headlineLevel: 1,
            textAlign: "left"
        },
        cmdHeadlineSettingsControls: {
            "textAlign": [
                {
                    text: "Left (default)",
                    value: "left"
                },
                {
                    text: "Center",
                    value: "center"
                },
                {
                    text: "Right",
                    value: "right"
                }
            ]
        },
        cmdInputGroupSettingsData: {
            required: false,
            inputTypes: "radio",
            status: "",
            showStatusIcon: true,
            replaceInputType: false,
            toggleSwitch: false,
            useSlot: false,
            multipleSwitch: false,
            showLabel: true,
            labelText: "Group label for input-group:",
            labelInline: false,
            stretchHorizontally: false,
            disabled: false
        },
        cmdInputGroupSettingsControls: {
            "inputTypes": [
                {
                    text: "Checkbox (default)",
                    value: "checkbox"
                },
                {
                    text: "Radio",
                    value: "radio"
                }
            ]
        },
        cmdImageSettingsData: {},
        cmdImageGallerySettingsData: {
            useFancyboxForLargeImages: true,
            figcaptionPosition: "top"
        },
        cmdImageGallerySettingsControls: {
            figcaptionPosition: [
                {
                    text: "Top",
                    value: "top"
                },
                {
                    text: "Bottom (default)",
                    value: "bottom"
                }
            ]
        },
        cmdListOfLinksSettingsData: {
            useGap: true,
            styleAsBox: false,
            largeIcons: false,
            sectionAnchors: false,
            orientation: "vertical",
            align: "left"
        },
        cmdListOfLinksSettingsControls: {
            align: [
                {
                    text: "Left (default)",
                    value: "left"
                },
                {
                    text: "Center",
                    value: "center"
                },
                {
                    text: "Right",
                    value: "right"
                },

            ],
            orientation: [
                {
                    text: "Vertical (default)",
                    value: "vertical"
                },
                {
                    text: "Horizontal",
                    value: "horizontal"
                }
            ]
        },
        cmdLoginFormSettingsData: {
            textLegendLoginForm: "Login form",
            showLegend: true,
            textLegendForgotLoginForm: "Forgot login form"
        },
        cmdMainNavigationSettingsData: {
            offcanvasPosition: "right",
            stretchMainItems: false,
            persistOnMobile: false,
            subentriesIconClass: "icon-single-arrow-down",
            subSubentriesIconClass: "icon-single-arrow-right"
        },
        cmdMainNavigationSettingsControls: {
            offcanvasPosition: [
                {
                    text: "Right (default)",
                    value: "right"
                },
                {
                    text: "Left",
                    value: "left"
                }
            ]
        },
        cmdMultistepFormProgressBarSettingsData: {
            showStepNumber: false,
            separatorIconClass: "icon-single-arrow-right"
        },
        cmdMultistepFormProgressBarSettingsControls: {
            separatorIconClass: [
                {
                    text: "icon-single-arrow-right (default)",
                    value: "icon-single-arrow-right"
                },
                {
                    text: "icon-double-arrow-right",
                    value: "icon-double-arrow-right"
                }
            ]
        },
        cmdNewsletterSubscriptionSettingsData: {
            buttonType: "submit",
            showLegend: true,
            textLegend: "Stay up-to-date",
            cmdInputGroup: {
                inputElements: [
                    {
                        labelText: "Subscribe",
                        id: "radio-subscribe",
                        name: "cmd-subscribe-group",
                        value: "subscribe"
                    },
                    {
                        labelText: "Unsubscribe",
                        id: "radio-unsubscribe",
                        name: "cmd-subscribe-group",
                        value: "unsubscribe"
                    }
                ],
                labelText: "Choose options:",
                showLabel: false
            }
        },
        cmdNewsletterSubscriptionSettingsControls: {
            buttonType: [
                {
                    text: "Button (default)",
                    value: "button"
                },
                {
                    text: "Submit",
                    value: "submit"
                }
            ]
        },
        cmdOpeningHoursSettingsData: {
            closed: true,
            separator: "-",
            textOpen: "Open right now!",
            textClosed: "Closed right now!",
            textHolidays: "",
            textMiscInfo: "",
            abbreviationTextAm: "am",
            abbreviationTextPm: "pm",
            componentHandlesClosedStatus: false,
            cmdHeadline: {
                headlineText: "Opening Hours",
                headlineLevel: 3
            }
        },
        cmdPaginationSettingsData: {
            pages: 3,
            itemsPerPage: 1,
            showPageNumbers: true,
            linkType: "button"
        },
        cmdPaginationSettingsControls: {
            linkType: [
                {
                    text: "Href (default)",
                    value: "href"
                },
                {
                    text: "Button",
                    value: "button"
                }
            ]
        },
        cmdSiteHeaderSettingsData: {
            sticky: false,
            navigationInline: false,
            useGrid: true,
            cmdMainNavigation: {...navigationData}
        },
        cmdSiteHeaderSettingsControls: {
            "cmdMainNavigation.offcanvasPosition": [
                {
                    text: "Right (default)",
                    value: "right"
                },
                {
                    text: "Left",
                    value: "left"
                }
            ],
        },
        cmdSiteSearchSettingsData: {
            useFilters: true,
            textLegend: "Search",
            showLegend: true
        },
        cmdSlideshowSettingsData: {
            useSlot: false,
            autoplay: true,
            autoplayInterval: 5000,
            showQuickLinkIcons: true,
            showCounter: true
        },
        cmdSocialNetworksSettingsData: {
            align: "left",
            useGap: true,
            stretchButtons: false,
            userMustAcceptDataPrivacy: true,
            tooltipAcceptDataPrivacy: "You must accept data privacy conditions!",
            buttonTextAlign: "left"
        },
        cmdSocialNetworksSettingsControls: {
            align: [
                {
                    text: "Left (default)",
                    value: "left"
                },
                {
                    text: "Center",
                    value: "center"
                },
                {
                    text: "Right",
                    value: "right"
                }
            ],
            buttonTextAlign: [
                {
                    text: "Left (default)",
                    value: "left"
                },
                {
                    text: "Right",
                    value: "right"
                }
            ]
        },
        cmdSystemMessageSettingsData: {
            validationStatus: "error",
            fullWidth: true,
            systemMessage: "This is an error message!",
            messageHeadlineLevel: 4
        },
        cmdSystemMessageSettingsControls: {
            validationStatus: [
                {
                    text: "Error",
                    value: "error"
                },
                {
                    text: "Warning",
                    value: "warning"
                },
                {
                    text: "Success",
                    value: "success"
                },
                {
                    text: "Info",
                    value: "info"
                }
            ]
        },
        cmdTableSettingsData: {
            collapsible: false,
            fullWidthOnDefault: false,
            userCanToggleWidth: true,
            showSlideButtons: true
        },
        cmdTabsSettingsData: {
            stretchTabs: false,
            useSlot: false,
            activeTab: 0
        },
        cmdTextImageBlockSettingsData: {
            htmlContent: "Text given as html-content",
            paragraphTextAlign: "left",
            headlinePosition: "aboveImage"
        },
        cmdTextImageBlockSettingsControls: {
            paragraphTextAlign: [
                {
                    text: "Left (default)",
                    value: "left"
                },
                {
                    text: "Center",
                    value: "center"
                },
                {
                    text: "Right",
                    value: "right"
                }
            ],
            headlinePosition: [
                {
                    text: "Above Image (default)",
                    value: "aboveImage"
                },
                {
                    text: "Below Image",
                    value: "belowImage"
                }
            ]
        },
        cmdThumbnailScrollerSettingsData: {
            orientation: "horizontal",
            fullWidth: false,
            largeIcons: false,
            contentType: "image",
            executeOnClick: "fancybox",
            allowOpenFancyBox: true,
            activeItemIndex: 0,
            useGalleryScroller: false
        },
        cmdThumbnailScrollerSettingsControls: {
            orientation: [
                {
                    text: "Horizontal (default)",
                    value: "horizontal"
                },
                {
                    text: "Vertical",
                    value: "vertical"
                }
            ],
            contentType: [
                {
                    text: "Image (default)",
                    value: "image"
                },
                {
                    text: "Text",
                    value: "text"
                }
            ],
            executeOnClick: [
                {
                    text: "Fancybox (default)",
                    value: "fancybox"
                },
                {
                    text: "URL",
                    value: "url"
                },
                {
                    text: "Emit",
                    value: "emit"
                }
            ]
        },
        cmdToggleDarkModeSettingsData: {
            styledAsButton: false,
            showLabel: true,
            useStyledLayout: false,
            labelTextDarkMode: "Dark-mode enabled",
            labelTextLightMode: "Light-mode enabled"
        },
        cmdTooltipSettingsData: {
            tooltipText: "This is a tooltip!",
            delayToShowTooltip: 0,
            status: "",
            toggleVisibilityByClick: false
        },
        cmdTooltipSettingsControls: {
            status: [
                {
                    text: "None (default)",
                    value: ""
                },
                {
                    text: "Error",
                    value: "error"
                },
                {
                    text: "Warning",
                    value: "warning"
                },
                {
                    text: "Success",
                    value: "success"
                },
                {
                    text: "Info",
                    value: "info"
                }
            ]
        },
        cmdUploadFormSettingsData: {
            showTotalUpload: true,
            componentHandlesUpload: true,
            commentRequired: true,
            commentStatusMessage: "",
            enableDragAndDrop: false,
            enableComment: true,
            presetComment: "",
            maxTotalUploadSize: 5242880,
            maxFileUploadSize: 10485760,
            allowMultipleFileUploads: false,
            advancedMode: true,
            showLegend: true,
            textLegend: "Advanced upload form",
            allowedFileExtensions: ["jpg", "eps"]
        }
    }
}
}
</script>
