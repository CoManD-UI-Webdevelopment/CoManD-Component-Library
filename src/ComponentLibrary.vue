<!--suppress HtmlUnknownTarget, NpmUsedModulesInstalled, JSUnresolvedVariable -->
<template>
        <!-- begin .page-wrapper -->
        <div class="page-wrapper" :id="templateId">
            <a id="anchor-back-to-top"></a>
            <CmdSidebar
                v-if="showLeftSidebar"
                :cmdHeadline="{headlineText: 'Site Settings', headlineLevel: 3, textAlign: 'center'}"
                :openSidebar="openLeftSidebar"
                @toggle-sidebar="setOpenStatusLeftSidebar"
            >
                <template #open>
                    <CmdBoxWrapper
                        :boxesPerRow="[1]"
                        :allowMultipleExpandedBoxes="false"
                        :allowUserToToggleOrientation="false"
                        :openBoxesByDefault="openBoxes"
                        :useGap="false"
                    >
                        <template v-slot="slotProps">
                            <!-- begin box template selection -->
                            <CmdBox
                                :use-slots="['body']"
                                :collapsible="true"
                                :cmdHeadline="{headlineText: 'Template Settings', headlineLevel: 4, headlineIcon: {iconClass: 'icon-settings-template'}}"
                                :openCollapsedBox="slotProps.boxIsOpen(0)"
                                @toggleCollapse="slotProps.boxToggled(0, $event)"
                            >
                                <template v-slot:body>
                                    <label for="select-template">
                                        <span>Select template</span>
                                        <select id="select-template" v-model="selectedTemplate">
                                            <option value="blank">Blank/Unstyled</option>
                                            <option value="business">Business</option>
                                            <option value="casual">Casual</option>
                                            <option value="dating">Dating</option>
                                            <option value="influencer">Influencer</option>
                                        </select>
                                    </label>
                                    <div>
                                        <span>Color Scheme</span>
                                        <div class="input-wrapper">
                                            <label for="default-color-scheme">
                                                <input type="radio" id="default-color-scheme" name="color-scheme" v-model="colorScheme"
                                                       value="none"/>
                                                <span class="label-text">Color-Scheme by Browser/OS</span>
                                            </label>
                                            <label for="light-mode">
                                                <input type="radio" id="light-mode" name="color-scheme" v-model="colorScheme"
                                                       value="light"/>
                                                <span class="label-text">Light Mode</span>
                                            </label>
                                            <label for="dark-mode">
                                                <input type="radio" id="dark-mode" name="color-scheme" v-model="colorScheme"
                                                       value="dark"/>
                                                <span class="label-text">Dark Mode</span>
                                            </label>
                                        </div>
                                    </div>
                                </template>
                            </CmdBox>
                            <!-- end box template selection -->

                            <!-- begin box list of components-->
                            <CmdBox
                                :use-slots="['body']"
                                :collapsible="true"
                                :cmdHeadline="{headlineText: 'Components', headlineLevel: 4, headlineIcon: {iconClass: 'icon-settings-component'}}"
                                :openCollapsedBox="slotProps.boxIsOpen(1)"
                                @toggleCollapse="slotProps.boxToggled(1, $event)"
                                id="list-of-components"
                            >
                                <template v-slot:body>
                                    <ul>
                                        <li v-for="(componentName, index) in listOfComponents" :key="index"
                                            :class="{'active' : activeEntry === 'Cmd' + componentName}">
                                            <a
                                                :href="sectionName(componentName)"
                                                @click="updateSettingsSidebar(componentNameWithPrefix(componentName))"
                                                title="Go to component"
                                            >
                                                {{ readableComponentName(componentName) }}
                                            </a>
                                        </li>
                                    </ul>
                                </template>
                            </CmdBox>
                            <!-- end box list of components-->

                            <!-- begin box page-templates -->
                            <CmdBox
                                :use-slots="['body']"
                                :collapsible="true"
                                :cmdHeadline="{headlineText: 'Page-Templates', headlineLevel: 4, headlineIcon: {iconClass: 'icon-file-settings'}}"
                                :openCollapsedBox="slotProps.boxIsOpen(2)"
                                @toggleCollapse="slotProps.boxToggled(2, $event)"
                            >
                                <template v-slot:body>
                                    <ul>
                                        <li>
                                            <a href="#section-contact-information"
                                               @click="updateSettingsSidebar('ContactInformation', 'page')">
                                                Contact Information
                                            </a>
                                        </li>
                                        <li>
                                            Multiple Lists Of Links
                                            <ul>
                                                <li>
                                                    <a href="#section-multiple-lists-of-links-downloads"
                                                       @click="updateSettingsSidebar('MultipleListsOfLinks', 'page')">
                                                        Downloads
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#section-multiple-lists-of-links-sitemap"
                                                       @click="updateSettingsSidebar('MultipleListsOfLinks', 'page')">
                                                        SiteMap
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            Multiple Box Wrapper
                                            <ul>
                                                <li>
                                                    <a href="#section-multiple-box-wrapper-faqs"
                                                       @click="updateSettingsSidebar('MultipleBoxWrapperFAQs', 'page')">
                                                        FAQs
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#section-multiple-box-wrapper-team-overview"
                                                       @click="updateSettingsSidebar('MultipleBoxWrapperTeamOverview', 'page')">
                                                        Team Overview
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </template>
                            </CmdBox>
                            <!-- end box page-templates -->
                        </template>
                    </CmdBoxWrapper>

                    <!-- begin list comand-versions -->
                    <dl class="box-footer comand-versions">
                        <dt>Frontend-Framework Version:</dt>
                        <dd>{{ packageJson.dependencies['comand-frontend-framework'].replace("^", "") }}</dd>
                        <dt>Component-Library Version:</dt>
                        <dd>{{ packageJson.version }}</dd>
                    </dl>
                    <!-- end list comand-versions -->
                </template>
                <template #closed>
                    <div class="closed-sidebar">
                        <a href="#" class="button primary" title="Open Template Selection" @click.prevent="openBox(0)">
                            <span class="icon-settings-template"></span>
                        </a>
                        <a href="#" class="button primary" title="Open Components Overview" @click.prevent="openBox(1)">
                            <span class="icon-settings-component"></span>
                        </a>
                        <a href="#" class="button primary" title="Open Page-Templates" @click.prevent="openBox(2)">
                            <span class="icon-file-settings"></span>
                        </a>
                        <a href="#" @click.prevent="showLeftSidebar = false">
                            <span>Hide sidebar</span>
                        </a>
                    </div>
                </template>
            </CmdSidebar>
            <!-- begin site-header --------------------------------------------------------------------------------------------------------------------------------------------------->
            <CmdSiteHeader :sticky="true">
                <template v-slot:top-header>
                    <!-- begin list-of-links --------------------------------------------------------------------------------------------------------------------------------------------------->
                    <CmdListOfLinks
                        :links="listOfLinksData"
                        orientation="horizontal"
                        align="right"
                    />
                    <!-- end list-of-links --------------------------------------------------------------------------------------------------------------------------------------------------->
                </template>
                <template v-slot:logo>
                    <!-- begin company-logo --------------------------------------------------------------------------------------------------------------------------------------------------->
                    <CmdCompanyLogo
                        v-bind="companyLogoData"
                    />
                    <!-- end company-logo --------------------------------------------------------------------------------------------------------------------------------------------------->
                </template>
            </CmdSiteHeader>
            <!-- end site-header --------------------------------------------------------------------------------------------------------------------------------------------------->
            <main v-if="componentView" id="content">
                <CmdWidthLimitationWrapper>
                    <h1 class="headline-demopage">Components Overview</h1>
                </CmdWidthLimitationWrapper>
                <!-- begin address-data ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-address-data">
                        <span>Address Data</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdAddressData')"></a>
                    </h2>
                    <div class="flex-container">
                        <CmdAddressData
                            ref="CmdAddressData"
                            :addressData="addressData"
                            v-bind="cmdAddressDataSettingsData"
                        />
                    </div>
                </CmdWidthLimitationWrapper>
                <!-- end address-data ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin advanced form elements --------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-advanced-form-elements">Advanced Form Elements</h2>
                    <h3><span>Form elements status:</span></h3>
                    <div class="flex-container">
                        <ul class="list-status">
                            <li>
                                <a href="#" @click.prevent="setStatus('', false)"
                                   :class="{'active' : validationStatus === '' && disabledStatus === false}"
                                   id="status-default">
                                    Default
                                </a>
                            </li>
                            <li class="error">
                                <a href="#" @click.prevent="setStatus('error', false)"
                                   :class="{'active' : validationStatus === 'error'}" id="status-error">
                                    Error
                                </a>
                            </li>
                            <li>
                                <a href="#" @click.prevent="setStatus('warning', false)"
                                   :class="{'active' : validationStatus === 'warning'}" id="status-warning">
                                    Warning
                                </a>
                            </li>
                            <li>
                                <a href="#" @click.prevent="setStatus('success', false)"
                                   :class="{'active' : validationStatus === 'success'}" id="status-success">
                                    Success
                                </a>
                            </li>
                            <li>
                                <a href="#" @click.prevent="setStatus('info', false)"
                                   :class="{'active' : validationStatus === 'info'}" id="status-info">
                                    Info
                                </a>
                            </li>
                            <li>
                                <a href="#" @click.prevent="setStatus('', true)"
                                   :class="{'active' : disabledStatus === true}" id="status-disabled">
                                    Disabled
                                </a>
                            </li>
                        </ul>
                    </div>

                    <!-- begin cmd-form-filters -->
                    <CmdFormFilters v-model="fakeSelectFilters" :selectedOptionsName="getOptionName"/>
                    <!-- end cmd-form-filters -->

                    <CmdForm :use-fieldset="false" id="advanced-form-elements" novalidate="novalidate">
                        <fieldset class="grid-container-create-columns">
                            <legend>Legend</legend>
                            <h2 class="headline-demopage">
                                <span>Form Element-Component</span>
                                <a href="#" class="icon-cog" title="Open Component Settings"
                                   @click.prevent="openSettingsSidebar('CmdFormElement')"></a>
                            </h2>
                            <CmdFormElement
                                ref="CmdFormElement"
                                v-bind="cmdFormElementSettingsData"
                                :status="validationStatus"
                                :disabled="disabledStatus"
                            />
                            <div class="flex-container">
                                <CmdFormElement
                                    labelText="Input for datalist:"
                                    element="input"
                                    type="text"
                                    :status="validationStatus"
                                    :disabled="disabledStatus"
                                    placeholder="Type in option"
                                    :datalist="datalist"
                                    tooltipText="This is a tooltip"
                                />
                            </div>
                            <div class="flex-container">
                                <CmdFormElement
                                    labelText="Input (type search (without search-button)):"
                                    element="input"
                                    type="search"
                                    :status="validationStatus"
                                    :disabled="disabledStatus"
                                    :showSearchButton="false"
                                    placeholder="Search"
                                    fieldIconClass="icon-search"
                                    tooltipText="This is a tooltip"
                                    v-bind="{useCustomTooltip: false}"
                                />
                                <CmdFormElement
                                    labelText="Input (type search (with search-button)):"
                                    element="input"
                                    type="search"
                                    :status="validationStatus"
                                    :disabled="disabledStatus"
                                    placeholder="Search"
                                    tooltipText="This is a tooltip"
                                    v-bind="{useCustomTooltip: false}"
                                />
                            </div>
                            <h2>Inputfields in Columns</h2>
                            <div class="flex-container">
                                <CmdFormElement
                                    element="input"
                                    type="text"
                                    minlength="5"
                                    id="inputfield1"
                                    placeholder="This is placeholder text"
                                    v-model="inputField1"
                                    tooltipText="This is a tooltip!"
                                    :status="validationStatus"
                                    :disabled="disabledStatus">
                                    <template v-slot:labeltext>
                                        <span v-html="'Label with <a href=\'#\'>Link</a> given by slot'"></span>
                                    </template>
                                </CmdFormElement>
                                <CmdFormElement
                                    element="input"
                                    labelText="Label for inputfield (required, with tooltip):"
                                    type="text"
                                    required="required"
                                    minlength="5"
                                    id="inputfield-required"
                                    placeholder="This is placeholder text"
                                    v-model="inputFieldRequired"
                                    tooltipText="This is a tooltip!"
                                    :status="validationStatus"
                                    :disabled="disabledStatus"
                                />
                                <CmdFormElement
                                    element="input"
                                    labelText="Label for inputfield (with pattern):"
                                    type="text"
                                    id="inputfield-pattern"
                                    placeholder="This is placeholder text"
                                    pattern="/\d/"
                                    v-model="inputFieldPattern"
                                    tooltipText="This is a tooltip!"
                                    :status="validationStatus"
                                    :disabled="disabledStatus"
                                />
                            </div>
                            <!-- begin inputfield in two columns -->
                            <div class="flex-container">
                                <CmdFormElement
                                    labelText="Label for emailfield (with icon):"
                                    element="input"
                                    type="email"
                                    id="inputfield-email"
                                    fieldIconClass="icon-mail"
                                    placeholder="Type in email-address"
                                    tooltipText="This is a tooltip!"
                                    maxlength="100"
                                    v-model="inputMail"
                                    :status="validationStatus"
                                    :disabled="disabledStatus"
                                    :required="true"
                                />
                                <CmdFormElement
                                    labelText="Label for inputfield (with icon):"
                                    element="input"
                                    type="text"
                                    id="inputfield-username"
                                    fieldIconClass="icon-user-profile"
                                    placeholder="Type in username"
                                    tooltipText="This is a tooltip!"
                                    maxlength="100"
                                    v-model="inputUsername"
                                    :status="validationStatus"
                                    :disabled="disabledStatus"
                                />
                                <CmdFormElement
                                    element="input"
                                    labelText="Label for password-field:"
                                    type="password"
                                    minlength="8"
                                    maxlength="255"
                                    id="inputfield-password"
                                    fieldIconClass="icon-security-settings"
                                    placeholder="Type in password"
                                    tooltipText="This is a tooltip!"
                                    :customRequirements="customRequirements"
                                    v-model="inputPassword"
                                    :status="validationStatus"
                                    :disabled="disabledStatus"
                                />
                            </div>
                            <!-- end inputfield in two columns -->

                            <CmdFormElement
                                element="input"
                                labelText="Label (inline) for inputfield (number):"
                                :displayLabelInline="true"
                                type="number"
                                id="inputfield-number"
                                required="required"
                                min="0"
                                max="9"
                                v-model="inputNumber"
                                :customRequirements="[customRequirements[2]]"
                                :status="validationStatus"
                                :disabled="disabledStatus"
                            />
                            <CmdFormElement
                                element="input"
                                labelText="Label (inline) for inputfield (date):"
                                :displayLabelInline="true"
                                type="date"
                                id="inputfield-date"
                                v-model="inputDate"
                                :status="validationStatus"
                                :disabled="disabledStatus"
                            />
                            <CmdFormElement
                                element="input"
                                labelText="Label (inline) for inputfield (search) without search-button:"
                                :displayLabelInline="true"
                                type="search"
                                id="inputfield-search-without-searchbutton"
                                placeholder="Keyword(s)"
                                v-model="inputSearch"
                                :showSearchButton="false"
                                :status="validationStatus"
                                :disabled="disabledStatus"
                            />
                            <CmdFormElement
                                element="input"
                                labelText="Label (inline) for inputfield (search):"
                                :displayLabelInline="true"
                                type="search"
                                id="inputfield-search-with-searchbutton"
                                placeholder="Keyword(s)"
                                v-model="inputSearch"
                                :status="validationStatus"
                                :disabled="disabledStatus"
                            />
                            <CmdFormElement
                                element="textarea"
                                labelText="Label for textarea:"
                                id="textarea"
                                minlength="1"
                                maxlength="100"
                                placeholder="Type in your message"
                                :required="true"
                                v-model="textarea"
                                :status="validationStatus"
                                :disabled="disabledStatus"
                            />
                            <hr/>
                            <!-- begin FakeSelect -->
                            <h3 class="headline-demopage">
                                <span>Fake Selects</span>
                                <a href="#" class="icon-cog" title="Open Component Settings"
                                   @click.prevent="openSettingsSidebar('CmdFakeSelect')"></a>
                            </h3>
                            <div class="flex-container">
                                <!-- type === default: normal selectbox (with optional icons) -->
                                <CmdFakeSelect
                                    ref="CmdFakeSelect"
                                    v-bind="cmdFakeSelectSettingsData"
                                    :selectData="fakeSelectOptionsData"
                                    v-model="fakeSelectDefault"
                                >
                                </CmdFakeSelect>
                                <!-- type === checkboxOptions: selectbox with checkboxes for each option -->
                                <CmdFakeSelect
                                    labelText="Selectbox with checkboxes:"
                                    :status="validationStatus"
                                    :disabled="disabledStatus"
                                    :selectData="fakeSelectOptionsData"
                                    v-model="fakeSelectCheckbox"
                                    defaultOptionName="Options:"
                                    :required="true"
                                    id="selectbox-with-checkboxes"
                                    type="checkboxOptions"
                                    :useCustomTooltip="true"
                                />
                                <CmdFakeSelect
                                    labelText="Selectbox with filters:"
                                    :status="validationStatus"
                                    :disabled="disabledStatus"
                                    :selectData="fakeSelectFilterOptionsData"
                                    v-model="fakeSelectFilters"
                                    defaultOptionName="Filters:"
                                    id="selectbox-with-filters"
                                    type="checkboxOptions"
                                    :useCustomTooltip="true"
                                />
                                <CmdFakeSelect
                                    labelText="Selectbox with country flags:"
                                    :status="validationStatus"
                                    :disabled="disabledStatus"
                                    :selectData="fakeSelectCountriesData"
                                    v-model="selectedCountry"
                                    defaultOptionName="Select country:"
                                    type="country"
                                />
                                <CmdFakeSelect
                                    labelText="Selectbox with colors:"
                                    :status="validationStatus"
                                    :disabled="disabledStatus"
                                    :selectData="fakeSelectColorsData"
                                    v-model="selectedColor"
                                    required="required"
                                    type="color"
                                />
                            </div>
                            <!-- emd FakeSelect -->
                            <hr/>

                            <!-- begin progress bar -->
                            <h2>Progress Bar [native]</h2>
                            <CmdProgressBar
                                labelText="Progress Bar (with optional output):"
                                id="progress-bar2"
                                max="100"
                            />
                            <!-- end progress bar -->

                            <!-- begin slider -->
                            <h2>Slider [native]</h2>
                            <div class="label" :class="validationStatus">
                                <span class="label-text">Single-Slider (with in- and output):</span>
                                <span class="flex-container no-flex">
                                    <label class="inline" for="range-value">
                                        <span class="label-text">
                                            <span>Range Value:</span>
                                        </span>
                                        <input
                                            type="number"
                                            :class="validationStatus"
                                            v-model="rangeValue"
                                            :disabled="disabledStatus"
                                            min="0"
                                            max="100"
                                            id="range-value"
                                        />
                                    </label>
                                    <label for="range-slider">
                                        <span class="label-text hidden">
                                            <span>Range Value</span>
                                        </span>
                                        <input
                                            type="range"
                                            class="range-slider"
                                            id="range-slider"
                                            v-model="rangeValue"
                                            :disabled="disabledStatus"
                                            min="0"
                                            max="100"
                                        />
                                    </label>
                                </span>
                            </div>
                            <!-- end slider -->

                            <hr/>

                            <!-- begin toggle-switch-radio with switch-label (colored) -->
                            <h2>Toggle-Switches</h2>
                            <h3>Switches without switch-labels</h3>
                            <CmdFormElement
                                element="input"
                                type="checkbox"
                                id="toggle-switch-checkbox"
                                v-model="switchButtonCheckboxToggleSwitch"
                                labelText="Labeltext for Toggle-Switch without Switch-Label"
                                :toggleSwitch="true"
                                :status="validationStatus"
                                :disabled="disabledStatus"
                            />
                            <CmdFormElement
                                element="input"
                                type="checkbox"
                                id="toggle-switch-checkbox-colored"
                                v-model="switchButtonCheckboxToggleSwitchColored"
                                labelText="Labeltext for colored Toggle-Switch without Switch-Label"
                                :toggleSwitch="true"
                                :colored="true"
                                :status="validationStatus"
                                :disabled="disabledStatus"
                            />
                            <h3>Switches with switch-labels</h3>
                            <CmdFormElement
                                element="input"
                                type="checkbox"
                                id="toggle-switch-checkbox-switch-label"
                                v-model="switchButtonCheckbox"
                                labelText="Labeltext for Toggle-Switch with Switch-Label"
                                inputValue="checkbox1"
                                onLabel="Label on"
                                offLabel="Label off"
                                :toggleSwitch="true"
                                :status="validationStatus"
                                :disabled="disabledStatus"
                            />
                            <CmdFormElement
                                element="input"
                                type="checkbox"
                                id="toggle-switch-checkbox-switch-label-colored"
                                v-model="switchButtonCheckbox"
                                inputValue="checkbox2"
                                labelText="Labeltext for Toggle-Switch (Checkbox, colored)"
                                onLabel="Label on"
                                offLabel="Label off"
                                :colored="true"
                                :toggleSwitch="true"
                                :status="validationStatus"
                                :disabled="disabledStatus"
                            />
                            <CmdFormElement
                                element="input"
                                type="radio"
                                name="radiogroup"
                                id="toggle-switch-radio1"
                                v-model="switchButtonRadio"
                                onLabel="Label on"
                                offLabel="Label off"
                                :colored="true"
                                :toggleSwitch="true"
                                :status="validationStatus"
                                :disabled="disabledStatus"
                                inputValue="radio1"
                                labelText="Labeltext for Toggle-Switch (Radio, colored) #1"
                            />
                            <CmdFormElement
                                element="input"
                                type="radio"
                                name="radiogroup"
                                id="toggle-switch-radio2"
                                v-model="switchButtonRadio"
                                onLabel="Label on"
                                offLabel="Label off"
                                :colored="true"
                                :toggleSwitch="true"
                                :status="validationStatus"
                                :disabled="disabledStatus"
                                inputValue="radio2"
                                labelText="Labeltext for Toggle-Switch (Radio, colored) #2"
                            />
                            <!-- end toggle-switch-radio with switch-label (colored) -->

                            <!-- begin checkboxes and radiobuttons -->
                            <CmdFormElement
                                element="input"
                                labelText="Label for (required) checkbox with boolean"
                                type="checkbox"
                                required="required"
                                id="checkbox-required-with-boolean"
                                v-model="checkboxRequiredValue"
                                :status="validationStatus"
                                :disabled="disabledStatus"
                            />
                            <p>
                                checkbox (required) with boolean: {{ checkboxRequiredValue }}<br/>
                                checkbox with boolean: {{ checkboxValue }}<br/>
                                checkboxes with values: {{ checkboxValues }}
                            </p>

                            <!-- begin cmd-toggle-darkmode -->
                            <h3 class="headline-demopage" id="section-toggle-darkmode">
                                <span>Toggle Dark-Mode</span>
                                <a href="#" class="icon-cog" title="Open Component Settings"
                                   @click.prevent="openSettingsSidebar('CmdToggleDarkMode')"></a>
                            </h3>
                            <CmdToggleDarkMode
                                ref="CmdToggleDarkMode"
                                v-bind="cmdToggleDarkModeSettingsData"
                            />
                            <!-- end cmd-toggle-darkmode -->

                            <h2>Checkboxes and Radiobuttons</h2>
                            <h3>Checkboxes [native]</h3>
                            <div class="label inline">
                                <span class="label-text">Label for native checkboxes:</span>
                                <div class="flex-container no-flex">
                                    <CmdFormElement
                                        element="input"
                                        labelText="Label for checkbox with boolean"
                                        type="checkbox"
                                        id="checkbox-with-boolean"
                                        v-model="checkboxValue"
                                        :status="validationStatus"
                                        :disabled="disabledStatus"
                                    />
                                    <CmdFormElement
                                        element="input"
                                        labelText="Label for checkbox with value"
                                        v-model="checkboxValues"
                                        inputValue="checkboxValue1"
                                        type="checkbox"
                                        id="checkbox-with-value-1"
                                        :status="validationStatus"
                                        :disabled="disabledStatus"
                                    />
                                    <CmdFormElement
                                        element="input"
                                        labelText="Label for checkbox with value"
                                        v-model="checkboxValues"
                                        inputValue="checkboxValue2"
                                        type="checkbox"
                                        id="checkbox-with-value-2"
                                        :status="validationStatus"
                                        :disabled="disabledStatus"
                                    />
                                    <CmdFormElement
                                        element="input"
                                        v-model="checkboxValues"
                                        inputValue="checkboxValue3"
                                        type="checkbox"
                                        id="checkbox-with-value-3"
                                        :status="validationStatus"
                                        :disabled="disabledStatus">
                                        <template v-slot:labeltext>
                                            Labeltext with <a href="#">link</a> given by slot
                                        </template>
                                    </CmdFormElement>
                                </div>
                            </div>
                            <h3>Checkboxes (replaced)</h3>
                            <div class="label inline">
                                <span class="label-text">Label for Replaced Input-Type-Checkbox:</span>
                                <div class="flex-container no-flex">
                                    <CmdFormElement
                                        element="input"
                                        labelText="Label for replaced checkbox"
                                        type="checkbox"
                                        :replaceInputType="true"
                                        id="inputfield9"
                                        v-model="replacedCheckboxValue"
                                        inputValue="checkboxValue1"
                                        :status="validationStatus"
                                        :disabled="disabledStatus"
                                    />
                                    <CmdFormElement
                                        element="input"
                                        labelText="Label for replaced checkbox"
                                        v-model="replacedCheckboxValue"
                                        inputValue="checkboxValue2"
                                        type="checkbox"
                                        :replaceInputType="true"
                                        id="inputfield10"
                                        :status="validationStatus"
                                        :disabled="disabledStatus"
                                    />
                                </div>
                            </div>
                            <h3>Radiobuttons [native]</h3>
                            <div class="label inline">
                                <span class="label-text">Label for native radiobuttons:</span>
                                <div class="flex-container no-flex">
                                    <CmdFormElement
                                        element="input"
                                        labelText="Label for native radiobutton"
                                        type="radio"
                                        id="inputfield11"
                                        name="radiogroup"
                                        inputValue="radiobuttonValue1"
                                        v-model="radiobuttonValue"
                                        :status="validationStatus"
                                        :disabled="disabledStatus"
                                    />
                                    <CmdFormElement
                                        element="input"
                                        labelText="Label for native radiobutton"
                                        type="radio"
                                        id="inputfield12"
                                        name="radiogroup"
                                        inputValue="radiobuttonValue2"
                                        v-model="radiobuttonValue"
                                        :status="validationStatus"
                                        :disabled="disabledStatus"
                                    />
                                </div>
                            </div>
                            <p>
                                Radiobuttons with values: {{ radiobuttonValue }}
                            </p>
                            <h3>Radiobuttons (replaced)</h3>
                            <div class="label inline">
                                <span class="label-text">Label for Replaced Input-Type-Radio:</span>
                                <div class="flex-container no-flex">
                                    <CmdFormElement
                                        element="input"
                                        labelText="Label for replaced radiobutton"
                                        type="radio"
                                        :replaceInputType="true"
                                        id="inputfield13"
                                        name="replaced-radiogroup"
                                        inputValue="radiobuttonValue1"
                                        v-model="replacedRadiobuttonValue"
                                        :status="validationStatus"
                                        :disabled="disabledStatus"
                                    />
                                    <CmdFormElement
                                        element="input"
                                        labelText="Label for replaced radiobutton"
                                        type="radio"
                                        :replaceInputType="true"
                                        id="inputfield14"
                                        name="replaced-radiogroup"
                                        inputValue="radiobuttonValue2"
                                        v-model="replacedRadiobuttonValue"
                                        :status="validationStatus"
                                        :disabled="disabledStatus"
                                    />
                                </div>
                            </div>
                            <!-- end checkboxes and radiobuttons -->

                            <!-- begin input-groups -->
                            <h3 class="headline-demopage" id="section-input-group">
                                Input-Group
                                <a href="#" class="icon-cog" title="Open Component Settings"
                                   @click.prevent="openSettingsSidebar('CmdInputGroup')"></a>
                            </h3>
                            <CmdInputGroup
                                ref="CmdInputGroup"
                                v-bind="cmdInputGroupSettingsData"
                                labelText="Grouplabel for radio-group given by property:"
                                :inputElements="idForReplacedInputsInInputGroup('radio-group')"
                                v-model="inputGroup"
                            >
                                <CmdFormElement
                                    element="input"
                                    labelText="Label for radiobutton"
                                    type="radio"
                                    id="input-group-radiobutton"
                                    name="radiogroup2"
                                    inputValue="radiobuttonValue1"
                                    v-model="inputGroup"
                                    :status="validationStatus"
                                    :disabled="disabledStatus"
                                />
                                <CmdFormElement
                                    element="input"
                                    labelText="Label for radiobutton"
                                    type="radio"
                                    id="input-group-radiobutton"
                                    name="radiogroup2"
                                    inputValue="radiobuttonValue2"
                                    v-model="inputGroup"
                                    :status="validationStatus"
                                    :disabled="disabledStatus"
                                />
                            </CmdInputGroup>
                            <dl>
                                <dt>Selected value:</dt>
                                <dd>
                                    <output>{{ inputGroup }}</output>
                                </dd>
                            </dl>
                            <h3>Input Groups with Checkboxes/Radiobuttons (toggle-switches)</h3>
                            <CmdInputGroup
                                labelText="Grouplabel for checkbox-group styled as toggle-switches:"
                                :inputElements="idForReplacedInputsInInputGroup('checkbox-group-toggle-switch')"
                                inputTypes="checkbox"
                                v-model="inputGroupValueToggleSwitchCheckbox"
                                :toggleSwitches="true"
                                required="required"
                                :status="validationStatus"
                                :disabled="disabledStatus"
                            />
                            <dl>
                                <dt>Selected value(s):</dt>
                                <dd>
                                    <output>{{ inputGroupValueToggleSwitchCheckbox }}</output>
                                </dd>
                            </dl>
                            <CmdInputGroup
                                labelText="Grouplabel for radio-group styled as toggle-switches:"
                                :inputElements="idForReplacedInputsInInputGroup('radio-group-toggle-switch')"
                                inputTypes="radio"
                                v-model="inputGroupValueToggleSwitchRadio"
                                :toggleSwitches="true"
                                required="required"
                                :status="validationStatus"
                                :disabled="disabledStatus"
                            />
                            <dl>
                                <dt>Selected value(s):</dt>
                                <dd>
                                    <output>{{ inputGroupValueToggleSwitchRadio }}</output>
                                </dd>
                            </dl>
                            <CmdInputGroup
                                labelText="Grouplabel for radio-group given by property styled as multiple-switch:"
                                :inputElements="idForReplacedInputsInInputGroup('radio-group-multiple-switch')"
                                inputTypes="radio"
                                :multipleSwitch="true"
                                v-model="inputGroupValue3"
                                :status="validationStatus"
                                :disabled="disabledStatus"
                            />
                            <dl>
                                <dt>Selected value(s):</dt>
                                <dd>
                                    <output>{{ inputGroupValue3 }}</output>
                                </dd>
                            </dl>
                            <CmdInputGroup
                                labelText="Grouplabel for checkbox-group styled as multiple-switch (stretched horizontally):"
                                :inputElements="inputGroupCheckboxes"
                                inputTypes="checkbox"
                                :multipleSwitch="true"
                                :required="true"
                                v-model="inputGroupValue4"
                                :stretchHorizontally="true"
                                :status="validationStatus"
                                :disabled="disabledStatus"
                            />
                            <dl>
                                <dt>Selected value(s):</dt>
                                <dd>
                                    <output>{{ inputGroupValue4 }}</output>
                                </dd>
                            </dl>
                        </fieldset>
                        <!-- end fieldset -->
                        <div class="flex-container">
                            <small>(values will not be submitted with the form!)</small>
                            <div class="button-wrapper no-flex">
                                <CmdFormElement
                                    element="button"
                                    :nativeButton="{text: 'Submit-button from component'}"
                                    type="submit"
                                    id="submitbutton"
                                    name="submitbutton"
                                    :disabled="disabledStatus"
                                />
                                <button class="button" type="submit" :disabled="disabledStatus">
                                    <span class="icon-check"></span>
                                    <span>Native submit-button</span>
                                </button>
                            </div>
                        </div>
                    </CmdForm>
                </CmdWidthLimitationWrapper>
                <!-- end advanced form elements ----------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin back to top button ----------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdBackToTopButton href="#anchor-back-to-top" scroll-container=".page-wrapper"/>
                <!-- end back to top button ----------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin bank account data ----------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-bank-account-data">
                        <span>Bank Account Data</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdBankAccountData')"></a>
                    </h2>
                    <CmdBankAccountData
                        :account-data="bankAccountData"
                        v-bind="cmdBankAccountDataSettingsData"
                        ref="CmdBankAccountData"
                    />
                </CmdWidthLimitationWrapper>
                <!-- end bank account data ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin basic form ----------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-basic-form">
                        <span>Basic Form</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdBasicForm')"></a>
                    </h2>
                    <CmdBasicForm
                        ref="CmdBasicForm"
                        @submit="sendBasicForm"
                    />
                    <dl>
                        <dt>originalEvent</dt>
                        <dd>{{ basicFormData.originalEvent }}</dd>
                        <dt>formdata</dt>
                        <dd>{{ basicFormData.formData }}</dd>
                    </dl>
                </CmdWidthLimitationWrapper>
                <!-- end basic form ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin boxes ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper anchorId="section-boxes">
                    <h2 class="headline-demopage">Boxes</h2>
                    <h3 class="headline-demopage">
                        <span>Default Box</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdBox')"></a>
                    </h3>
                    <CmdBox
                        ref="CmdBox"
                        v-bind="cmdBoxSettingsData"
                        textBody="Content"
                        :useSlots="['body', 'footer']"
                        :cmd-headline="{headlineText: 'Headline for box', headlineLevel: 4}"
                    >
                        <template v-slot:header>
                            <h4>
                                Texts given by slots
                            </h4>
                        </template>
                        <template v-slot:body>
                            <p>
                                This content with paragraphs inside is placed inside the box-body.
                            </p>
                            <p>
                                <strong>Header, Content/Body and Footer of this box are given by slots.</strong>
                            </p>
                            <p>Additionally 'allowContentToScroll' is active, which enables (as far as a max-height is
                                defined) the content of this box to scroll</p>
                        </template>
                        <template v-slot:footer>
                            <p>
                                Footer content
                            </p>
                        </template>
                    </CmdBox>
                    <CmdBoxWrapper
                        :useFlexbox="true"
                        :cmdHeadline="{headlineText: 'Boxes in BoxWrapper with flexbox', headlineLevel: 3}"
                        :use-gap="true"
                    >
                        <CmdBox
                            v-for="index in 14"
                            :key="index"
                            textBody="Content"
                            :cmd-headline="{headlineText: 'Headline ' + index, headlineLevel: 4}"
                        />
                    </CmdBoxWrapper>
                    <CmdBoxWrapper
                        :use-gap="true"
                        :cmdHeadline="{headlineText: 'Different examples of content-boxes (in BoxWrapper)', headlineLevel: 3}"
                    >
                        <CmdBox
                            :stretchVertically="false"
                            :cmdHeadline="{headlineText: 'Box with cutoff text', headlineLevel: 4}"
                            :useSlots="['body']"
                            :cutoff-text-lines="4"
                        >
                            <template v-slot:body>
                                This is a long text that is cutoff after a specific number of lines that can be defined
                                by the property 'cutoffTextLines' and be toggled by a link below.
                            </template>
                        </CmdBox>
                        <CmdBox :useSlots="['header', 'body', 'footer']" :allowContentToScroll="true">
                            <template v-slot:header>
                                <h4>
                                    Texts given by slots
                                </h4>
                            </template>
                            <template v-slot:body>
                                <p>
                                    This content with paragraphs inside is placed inside the box-body.
                                </p>
                                <p>
                                    <strong>Header, Content/Body and Footer of this box are given by slots.</strong>
                                </p>
                                <p>Additionally 'allowContentToScroll' is active, which enables (as far as a max-height
                                    is defined) the content of this box to scroll</p>
                            </template>
                            <template v-slot:footer>
                                <p>
                                    Footer content
                                </p>
                            </template>
                        </CmdBox>
                        <CmdBox :useSlots="['header', 'body']" :use-default-padding="false" :collapsible="true">
                            <template v-slot:header>
                                <h4>
                                    Box with inputs
                                </h4>
                            </template>
                            <template v-slot:body>
                                <CmdForm :showLegend="false" textLegend="Login Form">
                                    <CmdFormElement
                                        element="input"
                                        type="text"
                                        :required="true"
                                        labelText="Username:"
                                        placeholder="Username"
                                    />
                                    <CmdFormElement
                                        element="input"
                                        type="password"
                                        :required="true"
                                        labelText="Password:"
                                        placeholder="Password"
                                    />
                                </CmdForm>
                            </template>
                            <!-- will not be displayed, because useSlots-property does not contain 'footer' in array -->
                            <template v-slot:footer>
                                <p>
                                    footer content
                                </p>
                            </template>
                        </CmdBox>
                        <CmdBox :useSlots="['header', 'body']" :use-default-padding="false">
                            <template v-slot:header>
                                <h4>
                                    Box with links
                                </h4>
                            </template>
                            <template v-slot:body>
                                <ul class="navigation">
                                    <li><a href="#" @click.prevent="">Link name 1</a></li>
                                    <li><a href="#" @click.prevent="">Link name 2</a></li>
                                    <li><a href="#" @click.prevent="">Link name 3</a></li>
                                    <li><a href="#" @click.prevent="">Link name 4</a></li>
                                </ul>
                            </template>
                            <!-- will not be displayed, because useSlots-property does not contain 'footer' in array -->
                            <template v-slot:footer>
                                <p>
                                    footer content
                                </p>
                            </template>
                        </CmdBox>
                        <CmdBox
                            :useSlots="['header', 'body']"
                            :use-default-padding="false"
                            :cmdHeadline="{headlineText: 'Collapsible box', headlineLevel: 4}"
                            :collapsible="true">
                            <template v-slot:header>
                                <h4>
                                    Collapsible box with image
                                </h4>
                            </template>
                            <template v-slot:body>
                                <img src="/media/images/content-images/landscape-medium.jpg" alt="Alternative text"/>
                            </template>
                        </CmdBox>
                        <CmdBox :useSlots="['header', 'body', 'footer']" :use-default-padding="false">
                            <template v-slot:header>
                                <h4>
                                    Box with image, content and link
                                </h4>
                            </template>
                            <template v-slot:body>
                                <img src="/media/images/content-images/landscape-medium.jpg" alt="Alternative text"/>
                                <div class="default-padding">
                                    <h4>Custom headline</h4>
                                    <p>Image, custom-headline and this text for the component are given by slot</p>
                                </div>
                            </template>
                            <template v-slot:footer>
                                <p>
                                    <a href="#">Read more&hellip;</a>
                                </p>
                            </template>
                        </CmdBox>
                        <CmdBox
                            :use-default-padding="false"
                            :image="{src: '/media/images/content-images/landscape-medium.jpg', altText: 'Alternative text'}"
                            :repeatHeadlineInBoxBody="true"
                            :useDefaultPadding="true"
                            :cmdHeadline="{headlineText: 'Box with image, content and link', headlineLevel: 4}"
                            textBody="Image, headline and this text for the component are given by property"
                            :cmdLink="{
                                linkType: 'href',
                                path: '#',
                                icon: {
                                    iconClass: 'icon-chevron-two-stripes-right',
                                    position: 'right'
                                },
                                text: 'Read more'
                            }"
                        />
                    </CmdBoxWrapper>
                    <h3>Product boxes</h3>
                    <div class="grid-container-create-columns">
                        <div class="grid-small-item" v-for="(product, index) in boxProductData" :key="index">
                            <CmdBox boxType="product" :product="product" :cmdHeadline="{headlineLevel: 4}"/>
                        </div>
                    </div>
                    <h3>User boxes</h3>
                    <CmdBoxWrapper :boxesPerRow="[5, 2, 1]" :useRowViewAsDefault="true" :useGap="true">
                        <template v-slot="slotProps">
                            <CmdBox
                                v-for="index in boxUserData.length"
                                :key="index" boxType="user"
                                :user="boxUserData[index - 1]"
                                :cmdHeadline="{headlineLevel: 5}"
                                :rowView="slotProps.rowView"
                            />
                        </template>
                    </CmdBoxWrapper>
                    <h3>Boxes in BoxWrapper (collapsible)</h3>
                    <CmdBoxWrapper
                        :boxesPerRow="[5, 2, 1]"
                        :openBoxesByDefault="[2]"
                        :useRowViewAsDefault="true"
                        :allowMultipleExpandedBoxes="false"
                        :useGap="true">
                        <template v-slot="slotProps">
                            <CmdBox
                                v-for="index in boxProductData.length"
                                :key="index"
                                boxType="content"
                                :collapsible="true"
                                :useSlots="['body']"
                                :cmdHeadline="{headlineText: 'Box ' + index, headlineLevel: 5}"
                                :rowView="slotProps.rowView"
                                :openCollapsedBox="slotProps.boxIsOpen(index - 1)"
                                @toggleCollapse="slotProps.boxToggled(index - 1, $event)"
                            >
                                <template #body>{{ slotProps.currentOpenBox }}Content {{ index }}</template>
                            </CmdBox>
                        </template>
                    </CmdBoxWrapper>
                </CmdWidthLimitationWrapper>
                <!-- end boxes ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin breadcrumbs ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper inner-component="div">
                    <h2 class="headline-demopage" id="section-breadcrumbs">
                        <span>Breadcrumbs</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdBreadcrumbs')"></a>
                    </h2>
                    <CmdBreadcrumbs
                        ref="CmdBreadcrumbs"
                        :breadcrumbLabel="breadcrumbsData.breadcrumbLabel"
                        :breadcrumbLinks="breadcrumbsData.breadcrumbLinks"
                        v-bind="cmdBreadcrumbsSettingsData"
                    />
                </CmdWidthLimitationWrapper>
                <!-- end breadcrumbs ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin company-logo ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-company-logo">
                        <span>Company Logo</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdCompanyLogo')"></a>
                    </h2>
                    <CmdCompanyLogo
                        ref="CmdCompanyLogo"
                        :link="companyLogoData.link"
                        v-bind="cmdCompanyLogoSettingsData"
                    />
                </CmdWidthLimitationWrapper>
                <!-- end company-logo ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin container ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-container">
                        <span>Container</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdContainer')"></a>
                    </h2>
                    <CmdContainer
                        style="border: 1px dotted gray"
                        ref="CmdContainer"
                        v-bind="cmdContainerSettingsData"
                        containerType="flex"
                        contentAboveSlot="<div>HTML-Content above slot</div>"
                        contentBelowSlot="<div>HTML-Content below slot</div>"
                    >
                        Slot-content
                    </CmdContainer>
                </CmdWidthLimitationWrapper>
                <!-- end container ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin cookie-disclaimer ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-cookie-disclaimer">Cookie Disclaimer</h2>
                    <a class="button" href="#" @click.prevent="fancyBoxCookieDisclaimer = true">
                        <span>Open Cookie Disclaimer</span>
                    </a>
                </CmdWidthLimitationWrapper>
                <!-- end cookie-disclaimer ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin forms ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-forms">Forms</h2>
                    <h3>Form elements given by data</h3>
                    <CmdForm
                        :useFieldset="true"
                        :useSlot="false"
                        textLegend="Legend"
                        id="form-component"
                        novalidate="novalidate"
                        :formElements="formElementsData"
                        @submit="doConsoleLog"
                    />
                    <h3>Form elements given by slot</h3>
                    <CmdForm
                        :use-fieldset="true"
                        textLegend="Legend"
                        id="form-component"
                        novalidate="novalidate"
                        @submit="doConsoleLog"
                    >
                        <CmdFormElement
                            element="input"
                            text="text"
                            name="input-text"
                            labelText="Text input"
                            placeholder="Text input"
                        />
                        <CmdFormElement
                            element="input"
                            text="number"
                            labelText="Number input"
                            name="input-number"
                            modelValue="1"
                        />
                        <CmdFormElement
                            element="input"
                            text="password"
                            labelText="Password input"
                            name="password-number"
                            placeholder="Password input"
                        />
                    </CmdForm>
                </CmdWidthLimitationWrapper>
                <!-- end forms ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin fancybox ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-fancybox">Fancybox</h2>
                    <h3>FancyBox with text</h3>
                    <a href="#" @click.prevent="showFancyBox('text','Some text', 'FancyBox with text')">Open FancyBox
                        with text</a>
                    <h3>FancyBox with large image given by url</h3>
                    <a href="#"
                       @click.prevent="showFancyBox('url', '/media/images/demo-images/large/landscape-01.jpg', 'FancyBox with large image given by url')"
                       title="Open FancyBox with large image given by url"
                       style="display: inline-flex;"
                    >
                        <img src="/media/images/demo-images/small/landscape-01.jpg" alt="Alternative text"/>
                    </a>
                    <h3>FancyBox with large image given by property</h3>
                    <a href="#"
                       @click.prevent="showFancyBox('image', {large:'/media/images/demo-images/large/landscape-02.jpg'}, 'FancyBox with large image given by property')"
                       title="Open FancyBox with large image given by property"
                       style="display: inline-flex;"
                    >
                        <img src="/media/images/demo-images/small/landscape-02.jpg" alt="Alternative text"/>
                    </a>
                    <h3>FancyBox with image as object give by property</h3>
                    <a href="#"
                       @click.prevent="showFancyBox('image', {
                        small: '/media/images/demo-images/medium/landscape-03.jpg',
                        medium: '/media/images/demo-images/medium/landscape-03.jpg',
                        large: '/media/images/demo-images/large/landscape-03.jpg'
                   }, 'FancyBox with large image given by property')"
                       title="Open FancyBox with large image given by property"
                       style="display: inline-flex;"
                    >
                        <img src="/media/images/demo-images/small/landscape-03.jpg" alt="Alternative text"/>
                    </a>

                </CmdWidthLimitationWrapper>
                <!-- end fancybox ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin google-maps ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-google-maps">Google Maps&trade;</h2>
                    <CmdGoogleMaps :address="addressData"/>
                </CmdWidthLimitationWrapper>
                <!-- end google-maps ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin headlines ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-headlines">
                        <span>Headlines</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdHeadline')"></a>
                    </h2>
                    <CmdHeadline
                        ref="CmdHeadline"
                        v-bind="cmdHeadlineSettingsData"
                    />
                    <CmdHeadline
                        ref="CmdHeadline"
                        :headlineIcon="{iconClass: 'icon-home'}"
                        v-bind="cmdHeadlineSettingsData"
                    />
                </CmdWidthLimitationWrapper>
                <!-- end headlines ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin icons ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-icons">Icons</h2>
                    <ul>
                        <li>
                            <span>Icon from local iconfont</span>
                            <CmdIcon iconClass="icon-home"/>
                        </li>
                        <li>
                            <span>Icon from iconify-api (icomoon-font)</span>
                            <CmdIcon iconClass="icomoon-free:home"/>
                        </li>
                        <li>
                            <span>Icon from iconify-api (bootstrap-font)</span>
                            <CmdIcon iconClass="bi:house-fill"/>
                        </li>
                        <li>
                            <span>Icon from iconify-api (material-design-font)</span>
                            <CmdIcon iconClass="mdi:home"/>
                        </li>
                        <li>
                            <span>Icon from iconify-api (font-awesome-solid-font)</span>
                            <CmdIcon iconClass="fa6-solid:house-chimney"/>
                        </li>
                    </ul>
                </CmdWidthLimitationWrapper>
                <!-- end icons ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin images ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-image">
                        <span>Image</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdImage')"></a>
                    </h2>
                    <div class="flex-container">
                        <CmdImage
                            ref="CmdImage"
                            :image="imageData[0].image"
                            :figcaption="imageData[0].figcaption"
                            v-bind="cmdImageSettingsData"
                        />
                        <CmdImage
                            :image="imageData[1].image"
                            :figcaption="imageData[1].figcaption"
                        />
                    </div>
                </CmdWidthLimitationWrapper>
                <!-- end images ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin image-gallery------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-image-gallery">
                        <span>Image-Gallery</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdImageGallery')"></a>
                    </h2>
                    <CmdImageGallery
                        ref="CmdImageGallery"
                        :images="imageGalleryData"
                        v-bind="cmdImageGallerySettingsData"
                    />
                </CmdWidthLimitationWrapper>
                <!-- end image-gallery ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin image-zoom ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-image-zoom">
                        Image-Zoom
                    </h2>
                    <CmdImageZoom
                        :imageSmall="imageData[2].image"
                        :imageLarge="imageData[3].image"
                    />
                </CmdWidthLimitationWrapper>
                <!-- end image-zoom ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin link ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-link">
                        <span>Link</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdLink')"></a>
                    </h2>
                    <CmdLink
                        linkType="href"
                        ref="CmdLink"
                        v-bind="cmdLinkSettingsData"
                        :icon="{iconClass: 'icon-chevron-one-stripe-right', position: 'right', tooltip: 'Tooltip for hyperlink'}"
                    />
                </CmdWidthLimitationWrapper>
                <!-- end link ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin list-of-links ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-list-of-links">
                        <span>List Of Links</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdListOfLinks')"></a>
                    </h2>
                    <CmdListOfLinks
                        ref="CmdListOfLinks"
                        v-bind="cmdListOfLinksSettingsData"
                        :links="listOfLinksData"
                    />
                </CmdWidthLimitationWrapper>
                <!-- end list-of-links ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin login-form ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-login-form">
                        <span>Login Form</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdLoginForm')"></a>
                    </h2>
                    <CmdForm :use-validation="true" :use-fieldset="false">
                        <CmdLoginForm ref="CmdLoginForm" v-bind="cmdLoginFormSettingsData" v-model="loginData"/>
                    </CmdForm>
                    <p>LoginData: {{ loginData }}</p>
                </CmdWidthLimitationWrapper>
                <!-- end login-form ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin main-navigation ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-main-navigation">
                        <span>Main Navigation</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdMainNavigation')"></a>
                    </h2>
                    <CmdMainNavigation
                        ref="CmdMainNavigation"
                        v-bind="cmdMainNavigationSettingsData"
                        :navigationEntries="navigationData.navigationEntries"
                    />
                </CmdWidthLimitationWrapper>
                <!-- end main-navigation ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin multistep-form-progress-bar ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-multistep-form-progress-bar">
                        <span>Multistepform-Progressbar</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdMultistepFormProgressBar')"></a>
                    </h2>
                    <h3>Steps with icons</h3>
                    <CmdMultistepFormProgressBar
                        ref="CmdMultistepFormProgressBar"
                        :multisteps="multistepsData.withIcon"
                        v-bind="cmdMultistepFormProgressBarSettingsData"
                        @click="showPageMultistep = $event.index + 1"
                    />
                    <div>
                        <p>Page {{ showPageMultistep }}</p>
                    </div>
                </CmdWidthLimitationWrapper>
                <!-- end multistep-form-progress-bar ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin newsletter-subscription ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-newsletter-subscription">
                        <span>Newsletter Subscription</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdNewsletterSubscription')"></a>
                    </h2>
                    <CmdForm textLegend="Stay-up-to-date" :use-fieldset="false">
                        <CmdNewsletterSubscription
                            ref="CmdNewsletterSubscription"
                            v-bind="cmdNewsletterSubscriptionSettingsData"
                            v-model="newsletter"
                            @buttonClick="submitNewsletterRegistration"
                        />
                    </CmdForm>
                </CmdWidthLimitationWrapper>
                <!-- end newsletter-subscription ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin opening-hours ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-opening-hours">
                        <span>Opening Hours</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdOpeningHours')"></a>
                    </h2>
                    <CmdOpeningHours
                        ref="CmdOpeningHours"
                        v-bind="cmdOpeningHoursSettingsData"
                        :openingHours="openingHoursData"
                        :checkInterval="0"
                    />
                </CmdWidthLimitationWrapper>
                <!-- end opening-hours ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin page-footer ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-page-footer">
                        <span>Page Footer</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdPageFooter')"></a>
                    </h2>
                    <CmdPageFooter
                        ref="CmdPageFooter"
                        v-bind="cmdPageFooterSettingsData"
                        :cmdSocialNetworks="socialNetworksData"
                    >
                        <button class="button primary" title="Button given by slot">
                            <span class="icon-mail"></span>
                            <span>Contact</span>
                        </button>
                    </CmdPageFooter>
                </CmdWidthLimitationWrapper>
                <!-- end page-footer ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin page-header ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-page-header">
                        <span>Page Header</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdPageHeader')"></a>
                    </h2>
                    <CmdPageHeader
                        ref="CmdPageHeader"
                        :cmdBreadcrumbs="breadcrumbsData"
                        :cmdHeadline="{headlineText: 'Main headline for page', headlineLevel: 1}">
                        <a href="#" title="Link given by slot">
                            <span class="icon-user-profile"></span>
                            <span>You are logged in</span>
                        </a>
                    </CmdPageHeader>
                </CmdWidthLimitationWrapper>
                <!-- end page-header ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin pagination ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-pagination">
                        <span>Pagination</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdPagination')"></a>
                    </h2>
                    <div>
                        <p>Page {{ showPagePager }}</p>
                    </div>
                    <CmdPagination
                        ref="CmdPagination"
                        v-bind="cmdPaginationSettingsData"
                        @click="showPagePager = $event"
                    />
                </CmdWidthLimitationWrapper>
                <!-- end pagination ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin site-footer ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-site-footer">Site Footer</h2>
                    <CmdSiteFooter>
                        Slotcontent
                    </CmdSiteFooter>
                </CmdWidthLimitationWrapper>
                <!-- end site-footer ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin site-header ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-site-header">
                        <span>Site Header</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdSiteHeader')"></a>
                    </h2>
                    <CmdSiteHeader
                        ref="CmdSiteHeader"
                        v-bind="cmdSiteHeaderSettingsData"
                        :cmdCompanyLogo="companyLogoData"
                    >
                        <template v-slot:topheader>
                            <CmdListOfLinks
                                :links="listOfLinksData"
                                orientation="horizontal"
                                align="right"
                            />
                        </template>
                    </CmdSiteHeader>
                </CmdWidthLimitationWrapper>
                <!-- end site-header ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin site-search ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-site-search">
                        <span>Site Search</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdSiteSearch')"></a>
                    </h2>
                    <CmdSiteSearch
                        ref="CmdSiteSearch"
                        v-bind="cmdSiteSearchSettingsData"
                        v-model:modelValueInput1="siteSearchInput1"
                        v-model:modelValueInput2="siteSearchInput2"
                        v-model:modelValueRadius="radius"
                        v-model:modelValueSearchFilters="filters"
                        @search="siteSearchOutput"
                        :cmdFakeSelect="siteSearchFilters"
                    />
                </CmdWidthLimitationWrapper>
                <!-- end site-search ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin slideshow ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-slideshow">
                        <span>Slideshow</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdSlideshow')"></a>
                    </h2>
                    <CmdSlideshow
                        ref="CmdSlideshow"
                        v-bind="cmdSlideshowSettingsData"
                        :slideshow-items="slideshowData"
                    >Slot-Content
                    </CmdSlideshow>
                </CmdWidthLimitationWrapper>
                <!-- end slideshow ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin social-networks ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-social-networks">
                        <span>Social Networks</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdSocialNetworks')"></a>
                    </h2>
                    <CmdSocialNetworks
                        ref="CmdSocialNetworks"
                        v-bind="cmdSocialNetworksSettingsData"
                        :networks="socialNetworksData"
                    />
                </CmdWidthLimitationWrapper>
                <!-- end social-networks ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin switch-language ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-switch-language">Switch Language</h2>
                    <CmdSwitchLanguage
                        :languages="languagesData"
                        @click="doSomething"
                    />
                </CmdWidthLimitationWrapper>
                <!-- end switch-language ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin system-message ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-system-message">
                        <span>System Message</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdSystemMessage')"></a>
                    </h2>
                    <CmdSystemMessage
                        ref="CmdSystemMessage"
                        v-bind="cmdSystemMessageSettingsData"
                        :iconMessage="{iconClass: 'icon-error-circle', show: true}">
                        <ul>
                            <li>Error #1</li>
                            <li>Error #2</li>
                            <li>Error #3</li>
                        </ul>
                    </CmdSystemMessage>
                </CmdWidthLimitationWrapper>
                <!-- end system-message ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin tables ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-tables">
                        <span>Tables</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdTable')"></a>
                    </h2>
                    <h3>Table as wide as its content (with caption)</h3>
                    <CmdTable
                        ref="CmdTable"
                        v-bind="cmdTableSettingsData"
                        :table-data="tableDataLarge"
                    />
                    <h3>Table as wide as possible</h3>
                    <CmdTable
                        :collapsible="true"
                        :fullWidthOnDefault="false"
                        :userCanToggleWidth="true"
                        :table-data="tableDataLarge"
                    />
                </CmdWidthLimitationWrapper>
                <!-- end tables ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin tabs ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-tabs">
                        <span>Tabs</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdTabs')"></a>
                    </h2>
                    <CmdTabs
                        ref="CmdTabs"
                        v-bind="cmdTabsSettingsData"
                        :tabs="tabsData">
                        <template v-slot:tab-content-0>
                            <h4>Tab 1 headline</h4>
                            <p>Slot-Content Tab 1</p>
                        </template>
                        <template v-slot:tab-content-1>
                            <h4>Tab 2 headline</h4>
                            <p>Slot-Content Tab 2</p>
                        </template>
                        <template v-slot:tab-content-2>
                            <h4>Tab 3 headline</h4>
                            <p>Slot-Content Tab 3</p>
                        </template>
                    </CmdTabs>
                </CmdWidthLimitationWrapper>
                <!-- end tabs ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin text-image-block ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-text-image-block">
                        <span>Text-Image-Block</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdTextImageBlock')"></a>
                    </h2>
                    <div class="flex-container">
                        <CmdTextImageBlock
                            ref="CmdTextImageBlock"
                            v-bind="cmdTextImageBlockSettingsData"
                            :cmdHeadline="{headlineText: 'Text-Image-Block (with image and plain text)', headlineLevel: 3}"
                            :cmdImage='{
                                "image": {
                                    "src": "/media/images/demo-images/large/landscape-01.jpg",
                                    "alt": "alternative text",
                                    "tooltip": "tooltip"
                                },
                                "figcaption": {
                                    "text": "figcaption",
                                    "position": "bottom",
                                    "textAlign": "center",
                                    "show": true
                                }
                            }'
                            htmlContent="This text is given as plain text and show below an optional image."
                        />
                        <CmdTextImageBlock
                            :cmdHeadline="{headlineText: 'Text-Image-Block (with image and html-text)', headlineLevel: 3}"
                            htmlContent="<p>This text is given as html-text and show below an optional image.</p>"
                            :cmdImage='{
                                "image": {
                                    "src": "/media/images/demo-images/large/landscape-02.jpg",
                                    "alt": "alternative text",
                                    "tooltip": "tooltip"
                                },
                                "figcaption": {
                                    "text": "figcaption",
                                    "position": "bottom",
                                    "textAlign": "center",
                                    "show": true
                                }
                            }'
                        />
                    </div>
                </CmdWidthLimitationWrapper>
                <!-- end text-image-block ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin thumbnail-scroller ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-thumbnail-scroller">
                        <span>Thumbnail-Scroller</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdThumbnailScroller')"></a>
                    </h2>
                    <div class="inline-size">
                        <CmdThumbnailScroller
                            ref="CmdThumbnailScroller"
                            v-bind="cmdThumbnailScrollerSettingsData"
                            :thumbnailScrollerItems="thumbnailScrollerData"
                        />
                    </div>
                </CmdWidthLimitationWrapper>
                <!-- end thumbnail-scroller ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin tooltip ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-tooltip">
                        <span>Tooltip</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdTooltip')"></a>
                    </h2>
                    <p>
                        <a href="#" @click.prevent id="show-on-hover">Show tooltip on hover!</a><br/>
                        <a href="#" @click.prevent id="show-with-delay">Show tooltip on hover with delay!</a><br/>
                        <a href="#" @click.prevent id="show-on-click" title="Native tooltip">Show tooltip on click!</a>
                    </p>
                    <CmdTooltip
                        ref="CmdTooltip"
                        related-id="show-on-hover"
                        v-bind="cmdTooltipSettingsData"
                    >
                        Tooltip on hover
                    </CmdTooltip>
                    <CmdTooltip
                        :delay-to-show-tooltip="2000"
                        related-id="show-with-delay"
                    >
                        Tooltip on hover with delay
                    </CmdTooltip>
                    <CmdTooltip
                        related-id="show-on-click"
                        :toggle-visibility-by-click="true"
                        :allowEscapeKey="true"
                    >
                        Tooltip on click
                    </CmdTooltip>
                </CmdWidthLimitationWrapper>
                <!-- end tooltip ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin upload-form ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-upload-form">
                        <span>Upload-Form</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdUploadForm')"></a>
                    </h2>
                    <CmdUploadForm
                        ref="CmdUploadForm"
                        v-bind="cmdUploadFormSettingsData"
                    />
                </CmdWidthLimitationWrapper>
                <!-- end upload-form ------------------------------------------------------------------------------------------------------------------------------------------------------->

                <!-- begin upload-form ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdWidthLimitationWrapper>
                    <h2 class="headline-demopage" id="section-width-limitation-wrapper">
                        <span>Width Limitation Wrapper</span>
                        <a href="#" class="icon-cog" title="Open Component Settings"
                           @click.prevent="openSettingsSidebar('CmdWidthLimitationWrapper')"></a>
                    </h2>
                    <CmdWidthLimitationWrapper
                        style="border: 1px dotted gray"
                        ref="CmdWidthLimitationWrapper"
                        v-bind="cmdWidthLimitationWrapperSettingsData"
                    >
                        Slot-content placed in inner section
                    </CmdWidthLimitationWrapper>
                </CmdWidthLimitationWrapper>
                <!-- end upload-form ------------------------------------------------------------------------------------------------------------------------------------------------------->
            </main>

            <!-- begin page view -->
            <main v-else id="content">
                <CmdWidthLimitationWrapper>
                    <h1 class="headline-demopage">Page Overview</h1>
                </CmdWidthLimitationWrapper>

                <!-- begin page-overview -->
                <PageOverview/>
                <!-- end page-overview -->
            </main>
            <!-- end page view -->

            <!-- begin cmd-site-footer -->
            <CmdSiteFooter>
                <!-- begin slot-content -->
                Slot-Content for Site-Footer
                <!-- end slot-content -->
            </CmdSiteFooter>
            <!-- end cmd-site-footer -->

            <!-- begin copyright-information ------------------------------------------------------------------------------------------------------------------------------------------------------->
            <CmdCopyrightInformation/>
            <!-- end copyright-information ------------------------------------------------------------------------------------------------------------------------------------------------------->

            <!-- begin fancy-box ------------------------------------------------------------------------------------------------------------------------------------------------------->
            <CmdFancyBox
                :show="fancyBoxCookieDisclaimer"
                :fancyboxOptions="{}"
                :allowEscapeKey="false"
                :cmdHeadline="{show: true, headlineText: 'Cookie Disclaimer', headlineLevel: 2}"
                ariaLabelText="Cookie Disclaimer"
            >
                <!-- begin cookie-disclaimer ------------------------------------------------------------------------------------------------------------------------------------------------------->
                <CmdCookieDisclaimer
                    :cookieOptions="cookieDisclaimerData"
                    buttonLabelAcceptAllCookies="Accept all cookies"
                    buttonLabelAcceptCurrentSettings="Accept current settings"
                    @closeCookieDisclaimer="closeCookieDisclaimer"
                    v-model="acceptedCookies"
                    :cmdHeadlineCookieDisclaimer="{ show: false }">
                    <template #privacy-text>
                        <p>
                            <strong>
                                By browsing this web site you accept the usage and saving of anonymous data!
                            </strong>
                        </p>
                    </template>
                </CmdCookieDisclaimer>
                <!-- end cookie-disclaimer ------------------------------------------------------------------------------------------------------------------------------------------------------->
            </CmdFancyBox>
            <!-- end fancy-box ------------------------------------------------------------------------------------------------------------------------------------------------------->

            <!-- begin component-settings-sidebar ------------------------------------------------------------------------------------------------------------------------------------------------------->
            <CmdSidebar
                v-if="showSettingsSidebar"
                id="component-settings"
                :cmdHeadline="{headlineText: 'Component Settings', headlineLevel: 3, textAlign: 'center'}"
                :openSidebar="openRightSidebar"
                @toggle-sidebar="setOpenStatusRightSidebar"
                :collapseToLeft="false"
            >
                <template #open>
                    <ComponentSettings
                        :componentName="componentName"
                        :componentProps="componentProps"
                        :componentSettings="componentSettings"
                        :componentControls="componentControls"
                    />
                </template>
            </CmdSidebar>
            <!-- end component-settings-sidebar ------------------------------------------------------------------------------------------------------------------------------------------------------->
        </div><!-- end .page-wrapper -->
</template>

<script>
// import example data
import addressData from '@/assets/data/address-data.json'
import bankAccountData from '@/assets/data/bank-account-data.json'
import boxUserData from '@/assets/data/box-user.json'
import boxProductData from '@/assets/data/box-product.json'
import breadcrumbsData from '@/assets/data/breadcrumbs.json'
import companyLogoData from '@/assets/data/company-logo.json'
import cookieDisclaimerData from '@/assets/data/cookie-disclaimer.json'
import fakeSelectColorsData from '@/assets/data/fake-select-colors.json'
import fakeSelectCountriesData from '@/assets/data/fake-select-countries.json'
import fakeSelectFilterOptionsData from '@/assets/data/fake-select-filter-options.json'
import fakeSelectOptionsData from '@/assets/data/fake-select-options.json'
import formElementsData from '@/assets/data/form-elements.json'
import imageData from '@/assets/data/image.json'
import imageGalleryData from '@/assets/data/image-gallery.json'
import inputGroupRadiobuttonsData from '@/assets/data/input-group-radiobuttons.json'
import inputGroupReplacedRadiobuttonsData from '@/assets/data/input-group-replaced-radiobuttons.json'
import inputGroupToggleSwitchRadiobuttonsData from '@/assets/data/input-group-toggle-switch-radiobuttons.json'
import listOfLinksData from '@/assets/data/list-of-links.json'
import languagesData from '@/assets/data/switch-language.json'
import multistepsData from '@/assets/data/multistep-form-progress-bar.json'
import navigationData from '@/assets/data/main-navigation.json'
import openingHoursData from '@/assets/data/opening-hours.json'
import selectOptionsData from '@/assets/data/select-options.json'
import slideshowData from '@/assets/data/slideshow.json'
import socialNetworksData from '@/assets/data/social-networks-page-by-json.json'
import tabsData from '@/assets/data/tabs.json'
import tableDataSmall from '@/assets/data/table-small.json'
import tableDataLarge from '@/assets/data/table-large.json'
import thumbnailScrollerImagesData from '@/assets/data/thumbnail-scroller-images.json'
import thumbnailScrollerTextData from '@/assets/data/thumbnail-scroller-text.json'

import packageJson from '../package.json'

import listOfComponents from "@/assets/data/listOfComponents.json"

import PageOverview from "@/pages/PageOverview.vue"

// import external functions
import * as functions from "@/mixins/FieldValidation.js"
import {openFancyBox} from "@/components/CmdFancyBox.vue"
import {localizedTime} from "./components/CmdOpeningHours.vue"

// import data and controls for settings
import componentSettingsDataAndControls from "@/componentSettingsDataAndControls.vue"

export default {
    name: "App",
    mixins: [componentSettingsDataAndControls],
    components: {
        PageOverview
    },
    data() {
        return {
            listOfComponents,
            activeEntry: "CmdAddressData",
            basicFormData: {},
            componentControls: {},
            componentView: true,
            colorScheme: "none",
            showLeftSidebar: true,
            selectedTemplate: "blank",
            acceptedCookies: ["google-maps"],
            showTooltip: false,
            showSettingsSidebar: false,
            disabledStatus: undefined,
            validationStatus: "",
            loginData: {
                username: "",
                password: ""
            },
            newsletter: {
                subscription: "",
                email: ""
            },
            inputFieldPattern: "",
            inputSearch: "",
            textarea: "",
            inputGroupRadio: "radiobuttonValue1",
            inputGroup: "website",
            inputGroupValueReplaceInputTypeRadio: "phone",
            inputGroupValueReplaceInputTypeCheckbox: ["phone"],
            inputGroupValueToggleSwitchCheckbox: ["phone"],
            inputGroupValueToggleSwitchRadio: "phone",
            inputGroupValue3: "email",
            inputGroupValue4: [],
            inputGroupCheckboxes: [
                {
                    labelText: "Website",
                    id: "checkbox-id-1",
                    name: "input-group-checkbox",
                    iconClass: "icon-globe",
                    value: "website"
                },
                {
                    labelText: "E-Mail",
                    id: "checkbox-id-2",
                    name: "input-group-checkbox",
                    iconClass: "icon-mail",
                    value: "email"
                },
                {
                    labelText: "Phone",
                    id: "checkbox-id-3",
                    name: "input-group-checkbox",
                    iconClass: "icon-phone",
                    value: "phone"
                }
            ],
            inputNumber: "",
            inputDate: "",
            accordionGroupOpen: false,
            showPageMultistep: 1,
            showPagePager: 1,
            selectedOption: "",
            selectedOptions: [],
            selectedCountry: "de",
            selectedColor: "",
            rangeValue: 50,
            siteSearchFilters: {
                show: true,
                selectData: fakeSelectFilterOptionsData,
                defaultOptionName: "Select filters:",
                labelText: "Filters:",
                type: "checkboxOptions"
            },
            siteSearchInput1: "Doctor",
            siteSearchInput2: "New York",
            radius: 5,
            filters: ["2"],
            switchButtonRadio: "radio1",
            switchButtonCheckboxToggleSwitch: false,
            switchButtonCheckboxToggleSwitchColored: false,
            switchButtonCheckbox: ["checkbox1"],
            switchButtonCheckboxColored: false,
            inputMail: "",
            inputUsername: "",
            inputPassword: "",
            inputField1: "",
            inputFieldRequired: "",
            componentName: "",
            componentProps: {},
            componentSettings: {},
            checkboxValue: true,
            checkboxRequiredValue: false,
            checkboxValues: ["checkboxValue1"],
            replacedCheckboxValue: "checkboxValue1",
            radiobuttonValue: "radiobuttonValue1",
            replacedRadiobuttonValue: "radiobuttonValue1",
            fancyBoxCookieDisclaimer: false,
            fakeSelectDefault: "",
            fakeSelectCheckbox: [1],
            fakeSelectFilters: [],
            datalist: {
                id: "datalist-id",
                options: [
                    "Option 1",
                    "Option 2",
                    "Option 3"
                ]
            },
            customRequirements: [
                functions.validateCharacters(),
                functions.validateNumbers(),
                functions.validateNumbersOnly(),
                functions.validateSpecialCharacters(),
                functions.validateCapitalLetters()
            ],
            openLeftSidebar: true,
            openRightSidebar: false,
            openBoxes: [1],

            // assign data from json files to data-properties
            addressData,
            bankAccountData,
            boxProductData,
            boxUserData,
            breadcrumbsData,
            companyLogoData,
            cookieDisclaimerData,
            fakeSelectColorsData,
            fakeSelectCountriesData,
            fakeSelectFilterOptionsData,
            fakeSelectOptionsData,
            formElementsData,
            imageData,
            imageGalleryData,
            inputGroupReplacedRadiobuttonsData,
            inputGroupToggleSwitchRadiobuttonsData,
            languagesData,
            listOfLinksData,
            multistepsData,
            navigationData,
            openingHoursData,
            selectOptionsData,
            slideshowData,
            socialNetworksData,
            tableDataSmall,
            tableDataLarge,
            tabsData,
            thumbnailScrollerImagesData,
            thumbnailScrollerTextData,
            packageJson
        }
    },
    computed: {
        cmdSocialNetworks() {
            return cmdSocialNetworks
        },
        templateId() {
            return "template-" + this.selectedTemplate
        },
        thumbnailScrollerData() {
            if (this.cmdThumbnailScrollerSettingsData.contentType === "image") {
                return this.thumbnailScrollerImagesData
            }
            return this.thumbnailScrollerTextData
        }
    },
    methods: {
        sendBasicForm(event) {
            // prevent original event
            event.originalEvent.preventDefault()

            // assign custom event to data-property
            this.basicFormData = event
        },
        sectionName(componentName) {
            let componentNameWithHyphens = componentName.replace(/([A-Z])/g, '-$1');
            return "#section" + componentNameWithHyphens.toLowerCase();
        },
        readableComponentName(componentName) {
            return componentName.replace(/(?!^)([A-Z])/g, ' $1');
        },
        componentNameWithPrefix(componentName) {
            return "Cmd" + componentName
        },
        setActiveEntry(componentName) {
            this.activeEntry = componentName
        },
        updateSettingsSidebar(componentName, type) {
            this.setActiveEntry(componentName)

            if (type !== 'page') {
                this.componentView = true

                if (this.openRightSidebar) {
                    this.openSettingsSidebar(componentName)
                }
            } else {
                this.componentView = false
            }
        },
        hideSettingsSidebar() {
            this.showSettingsSidebar = false
        },
        openSettingsSidebar(ComponentName) {
            this.showSettingsSidebar = true
            this.openRightSidebar = true
            this.componentName = ComponentName
            this.componentProps = this.$refs[ComponentName].$props
            let lowerCaseComponentName = ComponentName.charAt(0).toLowerCase() + ComponentName.slice(1)
            this.componentSettings = this[lowerCaseComponentName + "SettingsData"]

            const controlsName = lowerCaseComponentName + "SettingsControls"
            if (this[controlsName]) {
                this.componentControls = this[controlsName]
            }
        },
        setOpenStatusLeftSidebar(event) {
            this.openLeftSidebar = event
        },
        setOpenStatusRightSidebar(event) {
            this.openRightSidebar = event
        },
        openBox(boxIndex) {
            this.openLeftSidebar = true
            this.openBoxes = [boxIndex]
        },
        navigationDataRight() {
            setTimeout(() => {
                let navigationData = {}
                navigationData = [...this.navigationData.navigationEntries]
                navigationData.offcanvasPosition = "right"
                return navigationData
            }, 1000);
        },
        clickOnListOfLinks(event) {
            event.originalEvent.preventDefault()
            console.log(event)
        },
        localizedTime(language) {
            return (h, m) => (localizedTime(language))(h, m).toLowerCase()
        },
        idForReplacedInputsInInputGroup(prefix) {
            return inputGroupRadiobuttonsData.map(item => ({...item, id: prefix + item.id, name: prefix + item.name}))
        },
        closeCookieDisclaimer(event) {
            this.fancyBoxCookieDisclaimer = false
            alert(event.join(", "))
        },
        setStatus(validationStatus, disabledStatus) {
            this.validationStatus = validationStatus
            this.disabledStatus = disabledStatus
        },
        onClick(event) {
            alert(event)
        },
        siteSearchOutput(event) {
            alert(JSON.stringify(event))
        },
        showError() {
            alert("Error")
        },
        showFancyBox(type, content, ariaLabelText) {
            if (type === "text") {
                openFancyBox({
                    content: content,
                    cmdHeadline: {
                        show: true,
                        headlineText: "Fancybox with text", headlineLevel: 3
                    },
                    ariaLabelText: ariaLabelText
                })
            } else if (type === "url") {
                openFancyBox({
                    url: content,
                    cmdHeadline: {
                        show: true,
                        headlineText: "Fancybox with image given by url", headlineLevel: 3
                    },
                    ariaLabelText: ariaLabelText
                })
            } else if (type === "image") {
                openFancyBox({
                    cmdHeadline: {
                        show: true,
                        headlineText: "Fancybox with image given by property",
                        headlineLevel: 3
                    },
                    cmdImage: {
                        image: {
                            src: {
                                small: content.small,
                                medium: content.medium,
                                large: content.large
                            },
                            alt: "Alternative text",
                            tooltip: "This is a tooltip"
                        },
                        figcaption: {
                            show: true,
                            text: "figcaption"
                        }
                    },
                    ariaLabelText: ariaLabelText
                })
            }
        },
        getOptionName(option) {
            for (let i = 0; i < this.fakeSelectFilterOptionsData.length; i++) {
                if (option === this.fakeSelectFilterOptionsData[i].value) {
                    return this.fakeSelectFilterOptionsData[i].text
                }
            }
            return null
        },
        submitNewsletterRegistration(event) {
            alert(event.subscription + " " + event.email)
        },
        doSomething(event) {
            event.preventDefault()
            alert("Language changed!")
        },
        executeSearch() {
            return Math.floor(Math.random() * 100)
        },
        doConsoleLog(event) {
            event.originalEvent.preventDefault()
            console.log("event: ", event)
        },
        toggleAllAccordions() {
            if (this.accordionGroupOpen) {
                this.$refs.accordionGroup1.closeAll()
            } else {
                this.$refs.accordionGroup1.openAll()
            }
            this.accordionGroupOpen = !this.accordionGroupOpen
        },
        switchButtonChange() {
            alert("Changed")
        }
    },
    watch: {
        colorScheme: {
            handler() {
                const htmlTag = document.documentElement

                if (this.colorScheme === "light") {
                    htmlTag.classList.remove("dark-mode")
                    htmlTag.classList.add("light-mode")
                } else if (this.colorScheme === "dark") {
                    htmlTag.classList.remove("light-mode")
                    htmlTag.classList.add("dark-mode")
                } else {
                    htmlTag.classList.remove("dark-mode")
                    htmlTag.classList.remove("light-mode")
                }
            },
            immediate: true
        },
        selectedTemplate() {
            // change stylesheet
            let linkTag = document.querySelector('link')

            if (linkTag) {
                linkTag.parentNode.removeChild(linkTag)
            }

            if (this.selectedTemplate !== "blank") {
                let newLink = document.createElement('link');
                newLink.rel = 'stylesheet';
                newLink.href = 'https://cdn.jsdelivr.net/npm/comand-frontend-framework/dist/templates/' + this.selectedTemplate + '.css';

                document.head.appendChild(newLink);
            }

            if(this.selectedTemplate === "blank") {
                this.companyLogoData =
                    {
                        "link": {
                            "type": "href",
                            "path": "./",
                            "tooltip": "Tooltip"
                        },
                        "pathDefaultLogo": "/media/images/logos/logo.svg",
                        "pathDarkmodeLogo": "/media/images/logos/logo-darkmode.svg",
                        "altText": "Company Logo"
                    }

            }

            // change logo
            if(this.selectedTemplate === "dating") {
                this.companyLogoData =
                {
                    "link": {
                    "type": "href",
                        "path": "./",
                        "tooltip": "Tooltip"
                },
                    "pathDefaultLogo": "/media/images/logos/logo-dating.svg",
                    "pathDarkmodeLogo": "/media/images/logos/logo-dating-darkmode.svg",
                    "altText": "Company Logo"
                }

            }
        }
    }
}
</script>

<style>
.demopage {
    .list-status {
        .active {
            color: var(--default-text-color);
            text-decoration: none;
            background: none;
        }
    }

    main .cmd-width-limitation-wrapper:not(:last-child) {
        border-bottom: var(--default-border);
        border-style: dashed;

        section {
            padding-top: calc(var(--default-padding) * 6);
            padding-bottom: calc(var(--default-padding) * 6);
        }
    }

    .headline-demopage {
        [class*="icon-"] {
            font-size: 2rem;
            color: var(--pure-white);
            margin: 0;
        }
    }

    .cmd-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2000;
        max-width: 30rem;
        height: 100vh;
        margin: 0;
        padding: 0;
        gap: 0;
        border: 0;
        border-right-width: 0;
        border-right-style: none;
        border-right-color: currentcolor;
        border-right: var(--default-border);

        .box {
            border-right: 0;

            &:not(:last-child) {
                border-bottom: 0;
            }

            li.active a {
                padding: 0.1rem 0.3rem;
                text-decoration: none;
            }

            &#list-of-components {
                .box-body {
                    max-height: 70rem;
                    overflow: auto;
                }
            }
        }

        .open-slot-wrapper {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;

            .comand-versions {
                margin: 0;

                dd {
                    white-space: nowrap;
                }
            }
        }

        .closed-sidebar {
            display: flex;
            flex-direction: column;
            gap: var(--default-gap);
            padding: var(--default-padding);

            .button {
                align-self: center;
            }
        }

        &:last-child {
            left: auto;
            right: 0;
        }
    }

    #component-settings {
        .open-slot-wrapper {
            display: block;
        }
    }
}
</style>