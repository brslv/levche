import strings from '../strings';

export default class Modal {
  constructor(entry, domFactory) {
    this.entry = entry;
    this.strings = strings;
    this.domFactory = domFactory;
  }

  toString() {
    return new Promise((resolve, reject) => {
      this.domFactory.modal()
        .then((modalTemplate) => {

          const rendered = Mustache.render(modalTemplate, {
            id: this.entry.id,
            amount: this.entry.amount,
            shortDescription: this.entry.shortDescription,
            category: this.strings.categories[this.entry.category],
            categories: this.strings.categories
          });

          resolve(rendered);
        })
    });
  }
}
