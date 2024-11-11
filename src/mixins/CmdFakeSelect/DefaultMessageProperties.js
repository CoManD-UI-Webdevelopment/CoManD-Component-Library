import FormElementMessageProperties from "../CmdFormElement/DefaultMessageProperties.js"
export default {
  data() {
    return {
      defaultMessageProperties: {
        "fake_select.headline.requirements_for_input": "Requirements for input",
        "fake_select.linktext.deselect_all_options": "Deselect all options",
        "fake_select.linktext.select_all_options": "Select all options",
        "fake_select.headline.an_option_is_selected": "An option is selected",
        "fake_select.option.options_selected": "{0} options selected",
      ...FormElementMessageProperties.data().defaultMessageProperties
      }
    }
  }
}
