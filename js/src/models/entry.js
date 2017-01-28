import strings from '../strings';

export default class Entry {
  constructor(data, domFactory) {
    this.domFactory = domFactory;
    this.strings = strings;
    this._setData(data);
  }

  _setData(data) {
    this.id = data.id || 1;
    this.category = data.category || '';
    this.amount = data.amount || 0;
    this.shortDescription = data.shortDescription || '';

    return this;
  }

  toString() {
    return new Promise((resolve, reject) => {
      this.domFactory.entry()
        .then((tpl) => {
          resolve(Mustache.render(tpl, {
            id: this.id,
            amount: this.amount,
            shortDescription: this.shortDescription,
            category: this.strings.categories[this.category]
          }));
        });
    });
  }

  toJson() {
    return {
      id: this.id,
      amount: this.amount,
      shortDescription: this.shortDescription,
      category: this.category
    };
  }
}
