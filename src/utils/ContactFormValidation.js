// noinspection CommaExpressionJS
class ContactFormValidator {
    static PATTERN_SURNAME = /^[a-züöäßáéíóàèìòêîô '-]+$/i
    static PATTERN_EMAIL = /^[a-z\d._%+-]+@[a-z\d._%+-]+\.[a-z]{2,}$/i
    static PATTERN_MESSAGE = /^.{2,500}$/

    label

    constructor(label) {
        this.label = label
    }

    validate(formData) {
        const lastNameValidationResult = this.validateRequired(formData.lastName.value, ContactFormValidator.PATTERN_SURNAME, this.label('form_error_invalid_surname'))
        const emailValidationResult = this.validateRequired(formData.email.value, ContactFormValidator.PATTERN_EMAIL, this.label('form_error_invalid_email'))
        const userMessageValidationResult = this.validateRequired(formData.userMessage.value, ContactFormValidator.PATTERN_MESSAGE, this.label('form_error_invalid_message'))
        formData.lastName.error = lastNameValidationResult[0]
        formData.lastName.errorMessage = lastNameValidationResult[1]
        formData.email.error = emailValidationResult[0]
        formData.email.errorMessage = emailValidationResult[1]
        formData.userMessage.error = userMessageValidationResult[0]
        formData.userMessage.errorMessage = userMessageValidationResult[1]
        console.log("validate", formData.email)
        formData.acceptPrivacy.error = false
        formData.error = formData.lastName.error
            || formData.email.error
            || formData.userMessage.error
        return formData
    }

    validatePrivacy(formData) {
        formData.acceptPrivacy.error = !formData.acceptPrivacy.value
        formData.acceptPrivacy.errorMessage = formData.acceptPrivacy.error ? this.label('form_error_missing_privacy_consent') : ''
        formData.error = formData.error || formData.acceptPrivacy.error
        return formData
    }

    validateRequired(value, pattern, errorMessage) {
        if (!value || value.trim().length === 0) {
            return [true, this.label('form_error_empty')]
        }
        if (pattern && !pattern.test(value)) {
            return [true, errorMessage || this.label('form_error_invalid')]
        }
        return [false, '']
    }
}

export { ContactFormValidator }
