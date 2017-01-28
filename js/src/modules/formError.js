export default class FormError {
  constructor() {
  }

  display(formValidator) {
    const formErrors = formValidator.errors();
    formErrors.forEach((error, key) => {
      let el = $(`[data-${key}]`).addClass('form-error');
    });
  }

  reset() {
    $('.form-error').removeClass('form-error');
  }
}
