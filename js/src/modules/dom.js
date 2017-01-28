export default class Dom {
  constructor() {
    this.doc = document;
  }

  get(selector) {
    return this.doc.querySelector(selector);
  }

  getAll(selector) {
    return this.doc.querySelectorAll(selector);
  }

  remove(element) {
    return element.parentNode.removeChild(element);
  }
}
