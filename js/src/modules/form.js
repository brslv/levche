'use strict';

import Entry from '../models/entry';
import strings from '../strings';
import Modal from './modal';

export default class Form {
  constructor(form, formValidator, storage, dom, dispatcher, domFactory, formError) {
    // identifiers
    this.idIdentifier = 'data-entry';
    this.editBtnIdentifier = 'data-edit-btn';
    this.updateBtnIdentifier = 'data-update-btn';
    this.deleteBtnIdentifier = 'data-delete-btn';

    this.form = form;
    this.formValidator = formValidator;
    this.formError = formError;
    
    this.dom = dom;
    this.domFactory = domFactory;
    
    this.dispatcher = dispatcher;
    this.storage = storage;
    this.strings = strings;
    
    // html elements
    this.entriesContainer = this.dom.get('.entries-container');
    this.amountInput = this.dom.get('[data-amount]');
    this.categoryInput = this.dom.get('[data-category]');
    this.shortDescriptionInput = this.dom.get('[data-short-description]');

    // calling methods
    this._attachEventListeners();
    this._loadCategories();
    this._loadEntries();
  }

  _attachEventListeners() {
    this.form.addEventListener('submit', this._addNewEntry.bind(this));
    this.dispatcher.subscribe('onEntryUpdated', this._loadEntries.bind(this));
    this.entriesContainer.addEventListener('click', this._handleEntryEvents.bind(this));
  }

  _loadCategories() {
    this.dom.get('[data-category]').innerHTML = this._buildCategoriesHtml();
  }

  _loadEntries() {
    this.entriesContainer.innerHTML = '';
    const entries = this.storage.getAll();

    entries.forEach(e => {
      let newEntry = new Entry({
        id: e.id,
        amount: e.amount,
        shortDescription: e.shortDescription,
        category: e.category
      }, this.domFactory);

      newEntry.toString().then((entryTemplate) => {
        this.entriesContainer.innerHTML = entryTemplate + this.entriesContainer.innerHTML;
      });
    });
  }

  _buildCategoriesHtml() {
    let categoriesHtml = '';
    const categories = this.strings.categories;

    for (let categoryIndex in categories) {
      let selected = '';
      categoriesHtml += this.domFactory.categoryDropdownOption(
        categoryIndex,
        categories[categoryIndex],
        categoryIndex == 0
      );
    }

    return categoriesHtml;
  }

  _addNewEntry(evt) {
    evt.preventDefault();

    this.formError.reset();
    if (!this.formValidator.validate()) {
      this.formError.display(this.formValidator);
      return false;
    }

    const id = this._getNextId();
    const newEntry = new Entry({
      id: id,
      amount: this.amountInput.value,
      shortDescription: this.shortDescriptionInput.value,
      category: this.categoryInput.value
    }, this.domFactory);

    this.storage.save(newEntry);

    // load template and display the new entry
    newEntry.toString()
      .then((entryTemplate) => {
        this.entriesContainer.innerHTML = entryTemplate + this.entriesContainer.innerHTML;
      });

    this.dispatcher.emit('onEntryAdded', newEntry);

    return this._clear([
            this.amountInput,
            this.shortDescriptionInput
        ])
        ._focusOn(this.amountInput);
  }

  _getNextId() {
    // gets the biggest id from the entries (max) -> max + 1
    const allEntries = this.dom.getAll('[data-entry]');
    let max = 0;
    allEntries.forEach((entry) => {
      let currentMax = +(entry.getAttribute(this.idIdentifier));
      if (currentMax >= max) {
        max = currentMax;
      }
      return currentMax;
    });
    return max + 1;
  }

  _handleEntryEvents(evt) {
    const target = evt.target;

    if (target.hasAttribute(this.deleteBtnIdentifier)) {
      this._deleteEntryHandler(target.getAttribute(this.idIdentifier));
    }

    if (target.hasAttribute(this.editBtnIdentifier)) {
      this._editEntryHandler(target.getAttribute(this.idIdentifier));
    }

    if (target.hasAttribute(this.updateBtnIdentifier)) {
      this._updateEntryHandler(target.getAttribute(this.idIdentifier));
    }
  }

  _deleteEntryHandler(entryId) {
    this.dom.remove(this.dom.get(`[${this.idIdentifier}="${entryId}"]`));

    // remove from the storage
    const deleted = this.storage.removeByProp({ prop: 'id', value: entryId });

    this.dispatcher.emit('onEntryDeleted', entryId);

    return deleted;
  }

  _editEntryHandler(entryId) {
    const entry = this.storage.getById(entryId);

    (new Modal(entry, this.domFactory)).toString()
      .then((modalTemplate) => {
        $(this.entriesContainer).append(modalTemplate);
        $(`#editModal__Entry__${entry.id}`)
          .modal()
          .on('hidden.bs.modal', (e) => {
            $(e.target).remove();
          });
      });
  }

  _updateEntryHandler(entryId) {
    this.storage.update(entryId, {
      amount: this.dom.get('[data-update-amount]').value,
      shortDescription: this.dom.get('[data-update-short-description]').value
    });

    this.dispatcher.emit('onEntryUpdated', entryId);
  }

  _clear(fields) {
    for (let field of fields) {
      field.value = '';
    }

    return this;
  }

  _focusOn(field) {
    field.focus();
    return this;
  }
}
