export default class FormValidator {
  constructor(form, dom, errorsBag) {
    this.form = form;
    this.dom = dom;
    this.errorsBag = errorsBag;
  }

  validate() {
    this.errorsBag.clear();
    const validatableFields = this.dom.getAll('[data-validate]');

    for (let field of validatableFields) {
      const validationRules = field.dataset.validate.split('|');

      validationRules.forEach(rule => this[`_${rule}`](field));
    }

    return this._isErrorsBagEmpty();
  }

  errors() {
    return this.errorsBag.bag;
  }

  _number(field) {
    const value = field.value;

    if (!(!isNaN(parseFloat(value)) && isFinite(value))) {
      this.errorsBag.set(field.id, `Number required, ${value} given.`);

      return false;
    }

    return true;
  }

  _isErrorsBagEmpty() {
    return this.errorsBag.isEmpty();
  }
}
