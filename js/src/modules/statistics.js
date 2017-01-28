export default class Statistics {
  constructor(storage, dom, dispatcher) {
    this.storage = storage;
    this.dom = dom;
    this.dispatcher = dispatcher;

    this.stats = {
      total: 0
    };

    this._attachListeners();
    this._build();
    this._display();
  }

  _attachListeners() {
    this.dispatcher.subscribe('onEntryAdded', this._update.bind(this));
    this.dispatcher.subscribe('onEntryUpdated', this._update.bind(this));
    this.dispatcher.subscribe('onEntryDeleted', this._update.bind(this));
  }

  _update(data) {
    return this._build()._display();
  }

  _build() {
    this.entries = this.storage.getAll();
    this.stats.total = this._getTotal();

    return this;
  }

  _getTotal() {
    if (!this.entries) {
      return 0;
    }

    return this.entries.reduce((total, e) => {
      return total + parseFloat(e.amount);
    }, 0);
  }

  _display() {
    this.dom.get('[data-statistics-total]').innerHTML = this.stats.total;
  }
}
