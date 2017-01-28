(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _dom = require('./modules/dom');

var _dom2 = _interopRequireDefault(_dom);

var _storage = require('./modules/storage');

var _storage2 = _interopRequireDefault(_storage);

var _localStorage = require('./modules/storageEngines/localStorage');

var _localStorage2 = _interopRequireDefault(_localStorage);

var _statistics = require('./modules/statistics');

var _statistics2 = _interopRequireDefault(_statistics);

var _form = require('./modules/form');

var _form2 = _interopRequireDefault(_form);

var _dispatcher = require('./modules/dispatcher');

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _domFactory = require('./modules/domFactory');

var _domFactory2 = _interopRequireDefault(_domFactory);

var _formError = require('./modules/formError');

var _formError2 = _interopRequireDefault(_formError);

var _formValidator = require('./modules/formValidator');

var _formValidator2 = _interopRequireDefault(_formValidator);

var _errorsBag = require('./modules/errorsBag');

var _errorsBag2 = _interopRequireDefault(_errorsBag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dom = new _dom2.default();
var storage = new _storage2.default('entries', new _localStorage2.default());
var dispatcher = new _dispatcher2.default();
var statistics = new _statistics2.default(storage, dom, dispatcher);
var domFactory = new _domFactory2.default();
var formError = new _formError2.default();
var formElement = dom.get('[data-main-form]');
var formValidator = new _formValidator2.default(formElement, dom, new _errorsBag2.default());

// initiate the main form
var form = new _form2.default(formElement, formValidator, storage, dom, dispatcher, domFactory, formError);

},{"./modules/dispatcher":3,"./modules/dom":4,"./modules/domFactory":5,"./modules/errorsBag":6,"./modules/form":7,"./modules/formError":8,"./modules/formValidator":9,"./modules/statistics":11,"./modules/storage":12,"./modules/storageEngines/localStorage":13}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _strings = require('../strings');

var _strings2 = _interopRequireDefault(_strings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Entry = function () {
  function Entry(data, domFactory) {
    _classCallCheck(this, Entry);

    this.domFactory = domFactory;
    this.strings = _strings2.default;
    this._setData(data);
  }

  _createClass(Entry, [{
    key: '_setData',
    value: function _setData(data) {
      this.id = data.id || 1;
      this.category = data.category || '';
      this.amount = data.amount || 0;
      this.shortDescription = data.shortDescription || '';

      return this;
    }
  }, {
    key: 'toString',
    value: function toString() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.domFactory.entry().then(function (tpl) {
          resolve(Mustache.render(tpl, {
            id: _this.id,
            amount: _this.amount,
            shortDescription: _this.shortDescription,
            category: _this.strings.categories[_this.category]
          }));
        });
      });
    }
  }, {
    key: 'toJson',
    value: function toJson() {
      return {
        id: this.id,
        amount: this.amount,
        shortDescription: this.shortDescription,
        category: this.category
      };
    }
  }]);

  return Entry;
}();

exports.default = Entry;

},{"../strings":14}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var instance = null;

var Dispatcher = function () {
  function Dispatcher() {
    _classCallCheck(this, Dispatcher);

    if (!instance) {
      instance = this;
    }

    this.map = new Map();

    return instance;
  }

  _createClass(Dispatcher, [{
    key: "emit",
    value: function emit(evt, data) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.map.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var e = _step.value;

          if (e === evt) {
            this.map.get(evt).forEach(function (handler) {
              handler(data);
            });
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "subscribe",
    value: function subscribe(evt, handler) {
      if (this.map.has(evt)) {
        return this.map.get(evt).push(handler);
      }

      return this.map.set(evt, [handler]);
    }
  }]);

  return Dispatcher;
}();

exports.default = Dispatcher;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dom = function () {
  function Dom() {
    _classCallCheck(this, Dom);

    this.doc = document;
  }

  _createClass(Dom, [{
    key: "get",
    value: function get(selector) {
      return this.doc.querySelector(selector);
    }
  }, {
    key: "getAll",
    value: function getAll(selector) {
      return this.doc.querySelectorAll(selector);
    }
  }, {
    key: "remove",
    value: function remove(element) {
      return element.parentNode.removeChild(element);
    }
  }]);

  return Dom;
}();

exports.default = Dom;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DomFactory = function () {
  function DomFactory() {
    _classCallCheck(this, DomFactory);
  }

  _createClass(DomFactory, [{
    key: 'entry',
    value: function entry(id, amount, shortDescription, category) {
      return $.get('../../templates/entry.html');
    }
  }, {
    key: 'modal',
    value: function modal() {
      return $.get('../../templates/modal.html');
    }
  }, {
    key: 'categoryDropdownOption',
    value: function categoryDropdownOption(categoryIndex, category) {
      var isSelected = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var selected = isSelected ? 'selected="selected"' : '';
      return '<option value="' + categoryIndex + '" ' + selected + '>' + category + '</option>';
    }
  }]);

  return DomFactory;
}();

exports.default = DomFactory;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ErrorBag = function () {
  function ErrorBag() {
    _classCallCheck(this, ErrorBag);

    this.bag = new Map();
  }

  _createClass(ErrorBag, [{
    key: "set",
    value: function set(key, val) {
      this.bag.set(key, val);

      return this;
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.bag.get(key);
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      this.bag.delete(key);

      return this;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.bag.clear();

      return this;
    }
  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.bag.size === 0;
    }
  }, {
    key: "size",
    value: function size() {
      return this.bag.size;
    }
  }]);

  return ErrorBag;
}();

exports.default = ErrorBag;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _entry = require('../models/entry');

var _entry2 = _interopRequireDefault(_entry);

var _strings = require('../strings');

var _strings2 = _interopRequireDefault(_strings);

var _modal = require('./modal');

var _modal2 = _interopRequireDefault(_modal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Form = function () {
  function Form(form, formValidator, storage, dom, dispatcher, domFactory, formError) {
    _classCallCheck(this, Form);

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
    this.strings = _strings2.default;

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

  _createClass(Form, [{
    key: '_attachEventListeners',
    value: function _attachEventListeners() {
      this.form.addEventListener('submit', this._addNewEntry.bind(this));
      this.dispatcher.subscribe('onEntryUpdated', this._loadEntries.bind(this));
      this.entriesContainer.addEventListener('click', this._handleEntryEvents.bind(this));
    }
  }, {
    key: '_loadCategories',
    value: function _loadCategories() {
      this.dom.get('[data-category]').innerHTML = this._buildCategoriesHtml();
    }
  }, {
    key: '_loadEntries',
    value: function _loadEntries() {
      var _this = this;

      this.entriesContainer.innerHTML = '';
      var entries = this.storage.getAll();

      entries.forEach(function (e) {
        var newEntry = new _entry2.default({
          id: e.id,
          amount: e.amount,
          shortDescription: e.shortDescription,
          category: e.category
        }, _this.domFactory);

        newEntry.toString().then(function (entryTemplate) {
          _this.entriesContainer.innerHTML = entryTemplate + _this.entriesContainer.innerHTML;
        });
      });
    }
  }, {
    key: '_buildCategoriesHtml',
    value: function _buildCategoriesHtml() {
      var categoriesHtml = '';
      var categories = this.strings.categories;

      for (var categoryIndex in categories) {
        var selected = '';
        categoriesHtml += this.domFactory.categoryDropdownOption(categoryIndex, categories[categoryIndex], categoryIndex == 0);
      }

      return categoriesHtml;
    }
  }, {
    key: '_addNewEntry',
    value: function _addNewEntry(evt) {
      var _this2 = this;

      evt.preventDefault();

      this.formError.reset();
      if (!this.formValidator.validate()) {
        this.formError.display(this.formValidator);
        return false;
      }

      var id = this._getNextId();
      var newEntry = new _entry2.default({
        id: id,
        amount: this.amountInput.value,
        shortDescription: this.shortDescriptionInput.value,
        category: this.categoryInput.value
      }, this.domFactory);

      this.storage.save(newEntry);

      // load template and display the new entry
      newEntry.toString().then(function (entryTemplate) {
        _this2.entriesContainer.innerHTML = entryTemplate + _this2.entriesContainer.innerHTML;
      });

      this.dispatcher.emit('onEntryAdded', newEntry);

      return this._clear([this.amountInput, this.shortDescriptionInput])._focusOn(this.amountInput);
    }
  }, {
    key: '_getNextId',
    value: function _getNextId() {
      var _this3 = this;

      // gets the biggest id from the entries (max) -> max + 1
      var allEntries = this.dom.getAll('[data-entry]');
      var max = 0;
      allEntries.forEach(function (entry) {
        var currentMax = +entry.getAttribute(_this3.idIdentifier);
        if (currentMax >= max) {
          max = currentMax;
        }
        return currentMax;
      });
      return max + 1;
    }
  }, {
    key: '_handleEntryEvents',
    value: function _handleEntryEvents(evt) {
      var target = evt.target;

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
  }, {
    key: '_deleteEntryHandler',
    value: function _deleteEntryHandler(entryId) {
      this.dom.remove(this.dom.get('[' + this.idIdentifier + '="' + entryId + '"]'));

      // remove from the storage
      var deleted = this.storage.removeByProp({ prop: 'id', value: entryId });

      this.dispatcher.emit('onEntryDeleted', entryId);

      return deleted;
    }
  }, {
    key: '_editEntryHandler',
    value: function _editEntryHandler(entryId) {
      var _this4 = this;

      var entry = this.storage.getById(entryId);

      new _modal2.default(entry, this.domFactory).toString().then(function (modalTemplate) {
        $(_this4.entriesContainer).append(modalTemplate);
        $('#editModal__Entry__' + entry.id).modal().on('hidden.bs.modal', function (e) {
          $(e.target).remove();
        });
      });
    }
  }, {
    key: '_updateEntryHandler',
    value: function _updateEntryHandler(entryId) {
      this.storage.update(entryId, {
        amount: this.dom.get('[data-update-amount]').value,
        shortDescription: this.dom.get('[data-update-short-description]').value
      });

      this.dispatcher.emit('onEntryUpdated', entryId);
    }
  }, {
    key: '_clear',
    value: function _clear(fields) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var field = _step.value;

          field.value = '';
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this;
    }
  }, {
    key: '_focusOn',
    value: function _focusOn(field) {
      field.focus();
      return this;
    }
  }]);

  return Form;
}();

exports.default = Form;

},{"../models/entry":2,"../strings":14,"./modal":10}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormError = function () {
  function FormError() {
    _classCallCheck(this, FormError);
  }

  _createClass(FormError, [{
    key: 'display',
    value: function display(formValidator) {
      var formErrors = formValidator.errors();
      formErrors.forEach(function (error, key) {
        var el = $('[data-' + key + ']').addClass('form-error');
      });
    }
  }, {
    key: 'reset',
    value: function reset() {
      $('.form-error').removeClass('form-error');
    }
  }]);

  return FormError;
}();

exports.default = FormError;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormValidator = function () {
  function FormValidator(form, dom, errorsBag) {
    _classCallCheck(this, FormValidator);

    this.form = form;
    this.dom = dom;
    this.errorsBag = errorsBag;
  }

  _createClass(FormValidator, [{
    key: 'validate',
    value: function validate() {
      var _this = this;

      this.errorsBag.clear();
      var validatableFields = this.dom.getAll('[data-validate]');

      var _loop = function _loop(field) {
        var validationRules = field.dataset.validate.split('|');

        validationRules.forEach(function (rule) {
          return _this['_' + rule](field);
        });
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = validatableFields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var field = _step.value;

          _loop(field);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return this._isErrorsBagEmpty();
    }
  }, {
    key: 'errors',
    value: function errors() {
      return this.errorsBag.bag;
    }
  }, {
    key: '_number',
    value: function _number(field) {
      var value = field.value;

      if (!(!isNaN(parseFloat(value)) && isFinite(value))) {
        this.errorsBag.set(field.id, 'Number required, ' + value + ' given.');

        return false;
      }

      return true;
    }
  }, {
    key: '_isErrorsBagEmpty',
    value: function _isErrorsBagEmpty() {
      return this.errorsBag.isEmpty();
    }
  }]);

  return FormValidator;
}();

exports.default = FormValidator;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _strings = require('../strings');

var _strings2 = _interopRequireDefault(_strings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Modal = function () {
  function Modal(entry, domFactory) {
    _classCallCheck(this, Modal);

    this.entry = entry;
    this.strings = _strings2.default;
    this.domFactory = domFactory;
  }

  _createClass(Modal, [{
    key: 'toString',
    value: function toString() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.domFactory.modal().then(function (modalTemplate) {

          var rendered = Mustache.render(modalTemplate, {
            id: _this.entry.id,
            amount: _this.entry.amount,
            shortDescription: _this.entry.shortDescription,
            category: _this.strings.categories[_this.entry.category],
            categories: _this.strings.categories
          });

          resolve(rendered);
        });
      });
    }
  }]);

  return Modal;
}();

exports.default = Modal;

},{"../strings":14}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Statistics = function () {
  function Statistics(storage, dom, dispatcher) {
    _classCallCheck(this, Statistics);

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

  _createClass(Statistics, [{
    key: '_attachListeners',
    value: function _attachListeners() {
      this.dispatcher.subscribe('onEntryAdded', this._update.bind(this));
      this.dispatcher.subscribe('onEntryUpdated', this._update.bind(this));
      this.dispatcher.subscribe('onEntryDeleted', this._update.bind(this));
    }
  }, {
    key: '_update',
    value: function _update(data) {
      return this._build()._display();
    }
  }, {
    key: '_build',
    value: function _build() {
      this.entries = this.storage.getAll();
      this.stats.total = this._getTotal();

      return this;
    }
  }, {
    key: '_getTotal',
    value: function _getTotal() {
      if (!this.entries) {
        return 0;
      }

      return this.entries.reduce(function (total, e) {
        return total + parseFloat(e.amount);
      }, 0);
    }
  }, {
    key: '_display',
    value: function _display() {
      this.dom.get('[data-statistics-total]').innerHTML = this.stats.total;
    }
  }]);

  return Statistics;
}();

exports.default = Statistics;

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Storage = function () {
  function Storage(key, storageEngine) {
    _classCallCheck(this, Storage);

    this.storageEngine = storageEngine;
    this.key = key;
  }

  _createClass(Storage, [{
    key: "getAll",
    value: function getAll() {
      return this.storageEngine.getObject(this.key);
    }
  }, {
    key: "getById",
    value: function getById(id) {
      var entries = this.storageEngine.getObject(this.key) || [];

      return entries.find(function (entry) {
        return +entry.id === +id;
      });
    }
  }, {
    key: "removeByProp",
    value: function removeByProp(opts) {
      var prop = opts.prop,
          value = opts.value;

      var entries = this.storageEngine.getObject(this.key);
      if (entries) {
        entries = entries.filter(function (e) {
          return e[prop] !== +value;
        });
        this.storageEngine.setJson(this.key, entries);
      }
    }
  }, {
    key: "save",
    value: function save(entry) {
      var entries = this.storageEngine.has(this.key) ? this.storageEngine.getObject(this.key) : [];

      // Get only the values, that are with different ids from the new entry (avoid duplication of ids).
      entries = entries.filter(function (existingEntry) {
        return existingEntry.id !== entry.id;
      });

      entries.push(entry.toJson());
      this.storageEngine.setJson(this.key, entries);
    }
  }, {
    key: "update",
    value: function update(id, data) {
      var entries = this.storageEngine.getObject(this.key);

      var updatedEntries = entries.map(function (entry) {
        if (+entry.id === +id) {
          return {
            id: entry.id,
            amount: data.amount || entry.amount,
            shortDescription: data.shortDescription || entry.shortDescription,
            category: data.category || entry.category
          };
        }
        return entry;
      });

      this.storageEngine.setJson(this.key, updatedEntries);
    }
  }]);

  return Storage;
}();

exports.default = Storage;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocalStorage = function () {
  function LocalStorage() {
    _classCallCheck(this, LocalStorage);

    this.ls = localStorage;
    this.length = this.ls.length;
  }

  _createClass(LocalStorage, [{
    key: "set",
    value: function set(key, value) {
      return this.ls.setItem(key, value);
    }
  }, {
    key: "setJson",
    value: function setJson(key, value) {
      return this.ls.setItem(key, JSON.stringify(value));
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.ls.getItem(key);
    }
  }, {
    key: "getObject",
    value: function getObject(key) {
      return JSON.parse(this.ls.getItem(key));
    }
  }, {
    key: "has",
    value: function has(key) {
      return this.get(key) !== undefined && this.get(key) !== null;
    }
  }, {
    key: "remove",
    value: function remove(key) {
      return this.ls.remove(key);
    }
  }, {
    key: "clear",
    value: function clear() {
      this.ls.clear;
      return this;
    }
  }]);

  return LocalStorage;
}();

exports.default = LocalStorage;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  categories: {
    '0': 'Храна',
    '1': 'Транспорт',
    '2': 'Забавления',
    '3': 'Дрехи'
  }
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvYXBwLmpzIiwianMvc3JjL21vZGVscy9lbnRyeS5qcyIsImpzL3NyYy9tb2R1bGVzL2Rpc3BhdGNoZXIuanMiLCJqcy9zcmMvbW9kdWxlcy9kb20uanMiLCJqcy9zcmMvbW9kdWxlcy9kb21GYWN0b3J5LmpzIiwianMvc3JjL21vZHVsZXMvZXJyb3JzQmFnLmpzIiwianMvc3JjL21vZHVsZXMvZm9ybS5qcyIsImpzL3NyYy9tb2R1bGVzL2Zvcm1FcnJvci5qcyIsImpzL3NyYy9tb2R1bGVzL2Zvcm1WYWxpZGF0b3IuanMiLCJqcy9zcmMvbW9kdWxlcy9tb2RhbC5qcyIsImpzL3NyYy9tb2R1bGVzL3N0YXRpc3RpY3MuanMiLCJqcy9zcmMvbW9kdWxlcy9zdG9yYWdlLmpzIiwianMvc3JjL21vZHVsZXMvc3RvcmFnZUVuZ2luZXMvbG9jYWxTdG9yYWdlLmpzIiwianMvc3JjL3N0cmluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxNQUFNLG1CQUFaO0FBQ0EsSUFBTSxVQUFVLHNCQUFZLFNBQVosRUFBdUIsNEJBQXZCLENBQWhCO0FBQ0EsSUFBTSxhQUFhLDBCQUFuQjtBQUNBLElBQU0sYUFBYSx5QkFBZSxPQUFmLEVBQXdCLEdBQXhCLEVBQTZCLFVBQTdCLENBQW5CO0FBQ0EsSUFBTSxhQUFhLDBCQUFuQjtBQUNBLElBQU0sWUFBWSx5QkFBbEI7QUFDQSxJQUFNLGNBQWMsSUFBSSxHQUFKLENBQVEsa0JBQVIsQ0FBcEI7QUFDQSxJQUFNLGdCQUFnQiw0QkFBa0IsV0FBbEIsRUFBK0IsR0FBL0IsRUFBb0MseUJBQXBDLENBQXRCOztBQUVBO0FBQ0EsSUFBTSxPQUFPLG1CQUNULFdB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QUFDRDs7OzRCQUVPO0FBQ04sV0FBSyxFQUFMLENBQVEsS0FBUjtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7Ozs7a0JBakNrQixZOzs7Ozs7OztrQkNBTjtBQUNiLGNBQVk7QUFDVixTQUFLLE9BREs7QUFFVixTQUFLLFdBRks7QUFHVixTQUFLLFlBSEs7QUFJVixTQUFLO0FBSks7QUFEQyxDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IERvbSBmcm9tICcuL21vZHVsZXMvZG9tJztcbmltcG9ydCBTdG9yYWdlIGZyb20gJy4vbW9kdWxlcy9zdG9yYWdlJztcbmltcG9ydCBMb2NhbFN0b3JhZ2UgZnJvbSAnLi9tb2R1bGVzL3N0b3JhZ2VFbmdpbmVzL2xvY2FsU3RvcmFnZSc7XG5pbXBvcnQgU3RhdGlzdGljcyBmcm9tICcuL21vZHVsZXMvc3RhdGlzdGljcyc7XG5pbXBvcnQgRm9ybSBmcm9tICcuL21vZHVsZXMvZm9ybSc7XG5pbXBvcnQgRGlzcGF0Y2hlciBmcm9tICcuL21vZHVsZXMvZGlzcGF0Y2hlcic7XG5pbXBvcnQgRG9tRmFjdG9yeSBmcm9tICcuL21vZHVsZXMvZG9tRmFjdG9yeSc7XG5pbXBvcnQgRm9ybUVycm9yIGZyb20gJy4vbW9kdWxlcy9mb3JtRXJyb3InO1xuaW1wb3J0IEZvcm1WYWxpZGF0b3IgZnJvbSAnLi9tb2R1bGVzL2Zvcm1WYWxpZGF0b3InO1xuaW1wb3J0IEVycm9yc0JhZyBmcm9tICcuL21vZHVsZXMvZXJyb3JzQmFnJztcblxuY29uc3QgZG9tID0gbmV3IERvbSgpO1xuY29uc3Qgc3RvcmFnZSA9IG5ldyBTdG9yYWdlKCdlbnRyaWVzJywgbmV3IExvY2FsU3RvcmFnZSgpKTtcbmNvbnN0IGRpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuY29uc3Qgc3RhdGlzdGljcyA9IG5ldyBTdGF0aXN0aWNzKHN0b3JhZ2UsIGRvbSwgZGlzcGF0Y2hlcik7XG5jb25zdCBkb21GYWN0b3J5ID0gbmV3IERvbUZhY3RvcnkoKTtcbmNvbnN0IGZvcm1FcnJvciA9IG5ldyBGb3JtRXJyb3IoKTtcbmNvbnN0IGZvcm1FbGVtZW50ID0gZG9tLmdldCgnW2RhdGEtbWFpbi1mb3JtXScpO1xuY29uc3QgZm9ybVZhbGlkYXRvciA9IG5ldyBGb3JtVmFsaWRhdG9yKGZvcm1FbGVtZW50LCBkb20sIG5ldyBFcnJvcnNCYWcoKSk7XG5cbi8vIGluaXRpYXRlIHRoZSBtYWluIGZvcm1cbmNvbnN0IGZvcm0gPSBuZXcgRm9ybShcbiAgICBmb3JtRWxlbWVudCwgXG4gICAgZm9ybVZhbGlkYXRvcixcbiAgICBzdG9yYWdlLFxuICAgIGRvbSxcbiAgICBkaXNwYXRjaGVyLFxuICAgIGRvbUZhY3RvcnksXG4gICAgZm9ybUVycm9yXG4pO1xuIiwiaW1wb3J0IHN0cmluZ3MgZnJvbSAnLi4vc3RyaW5ncyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVudHJ5IHtcbiAgY29uc3RydWN0b3IoZGF0YSwgZG9tRmFjdG9yeSkge1xuICAgIHRoaXMuZG9tRmFjdG9yeSA9IGRvbUZhY3Rvcnk7XG4gICAgdGhpcy5zdHJpbmdzID0gc3RyaW5ncztcbiAgICB0aGlzLl9zZXREYXRhKGRhdGEpO1xuICB9XG5cbiAgX3NldERhdGEoZGF0YSkge1xuICAgIHRoaXMuaWQgPSBkYXRhLmlkIHx8IDE7XG4gICAgdGhpcy5jYXRlZ29yeSA9IGRhdGEuY2F0ZWdvcnkgfHwgJyc7XG4gICAgdGhpcy5hbW91bnQgPSBkYXRhLmFtb3VudCB8fCAwO1xuICAgIHRoaXMuc2hvcnREZXNjcmlwdGlvbiA9IGRhdGEuc2hvcnREZXNjcmlwdGlvbiB8fCAnJztcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuZG9tRmFjdG9yeS5lbnRyeSgpXG4gICAgICAgIC50aGVuKCh0cGwpID0+IHtcbiAgICAgICAgICByZXNvbHZlKE11c3RhY2hlLnJlbmRlcih0cGwsIHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICAgICAgYW1vdW50OiB0aGlzLmFtb3VudCxcbiAgICAgICAgICAgIHNob3J0RGVzY3JpcHRpb246IHRoaXMuc2hvcnREZXNjcmlwdGlvbixcbiAgICAgICAgICAgIGNhdGVnb3J5OiB0aGlzLnN0cmluZ3MuY2F0ZWdvcmllc1t0aGlzLmNhdGVnb3J5XVxuICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICB0b0pzb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgYW1vdW50OiB0aGlzLmFtb3VudCxcbiAgICAgIHNob3J0RGVzY3JpcHRpb246IHRoaXMuc2hvcnREZXNjcmlwdGlvbixcbiAgICAgIGNhdGVnb3J5OiB0aGlzLmNhdGVnb3J5XG4gICAgfTtcbiAgfVxufVxuIiwibGV0IGluc3RhbmNlID0gbnVsbDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlzcGF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgIGluc3RhbmNlID0gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLm1hcCA9IG5ldyBNYXAoKTtcblxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIGVtaXQoZXZ0LCBkYXRhKSB7XG4gICAgZm9yIChsZXQgZSBvZiB0aGlzLm1hcC5rZXlzKCkpIHtcbiAgICAgIGlmIChlID09PSBldnQpIHtcbiAgICAgICAgdGhpcy5tYXAuZ2V0KGV2dCkuZm9yRWFjaCgoaGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgaGFuZGxlcihkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3Vic2NyaWJlKGV2dCwgaGFuZGxlcikge1xuICAgIGlmICh0aGlzLm1hcC5oYXMoZXZ0KSkge1xuICAgICAgcmV0dXJuIHRoaXMubWFwLmdldChldnQpLnB1c2goaGFuZGxlcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubWFwLnNldChldnQsIFtoYW5kbGVyXSk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIERvbSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZG9jID0gZG9jdW1lbnQ7XG4gIH1cblxuICBnZXQoc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5kb2MucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gIH1cblxuICBnZXRBbGwoc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5kb2MucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gIH1cblxuICByZW1vdmUoZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIERvbUZhY3Rvcnkge1xuICBlbnRyeShpZCwgYW1vdW50LCBzaG9ydERlc2NyaXB0aW9uLCBjYXRlZ29yeSkge1xuICAgIHJldHVybiAkLmdldCgnLi4vLi4vdGVtcGxhdGVzL2VudHJ5Lmh0bWwnKTtcbiAgfVxuXG4gIG1vZGFsKCkge1xuICAgIHJldHVybiAkLmdldCgnLi4vLi4vdGVtcGxhdGVzL21vZGFsLmh0bWwnKTtcbiAgfVxuXG4gIGNhdGVnb3J5RHJvcGRvd25PcHRpb24oY2F0ZWdvcnlJbmRleCwgY2F0ZWdvcnksIGlzU2VsZWN0ZWQgPSBmYWxzZSkge1xuICAgIGxldCBzZWxlY3RlZCA9IGlzU2VsZWN0ZWQgPyAnc2VsZWN0ZWQ9XCJzZWxlY3RlZFwiJyA6ICcnO1xuICAgIHJldHVybiBgPG9wdGlvbiB2YWx1ZT1cIiR7Y2F0ZWdvcnlJbmRleH1cIiAke3NlbGVjdGVkfT4ke2NhdGVnb3J5fTwvb3B0aW9uPmA7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEVycm9yQmFnIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5iYWcgPSBuZXcgTWFwKCk7XG4gIH1cblxuICBzZXQoa2V5LCB2YWwpIHtcbiAgICB0aGlzLmJhZy5zZXQoa2V5LCB2YWwpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXQoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuYmFnLmdldChrZXkpO1xuICB9XG5cbiAgZGVsZXRlKGtleSkge1xuICAgIHRoaXMuYmFnLmRlbGV0ZShrZXkpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLmJhZy5jbGVhcigpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIHJldHVybiB0aGlzLmJhZy5zaXplID09PSAwO1xuICB9XG5cbiAgc2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5iYWcuc2l6ZTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgRW50cnkgZnJvbSAnLi4vbW9kZWxzL2VudHJ5JztcbmltcG9ydCBzdHJpbmdzIGZyb20gJy4uL3N0cmluZ3MnO1xuaW1wb3J0IE1vZGFsIGZyb20gJy4vbW9kYWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb3JtIHtcbiAgY29uc3RydWN0b3IoZm9ybSwgZm9ybVZhbGlkYXRvciwgc3RvcmFnZSwgZG9tLCBkaXNwYXRjaGVyLCBkb21GYWN0b3J5LCBmb3JtRXJyb3IpIHtcbiAgICAvLyBpZGVudGlmaWVyc1xuICAgIHRoaXMuaWRJZGVudGlmaWVyID0gJ2RhdGEtZW50cnknO1xuICAgIHRoaXMuZWRpdEJ0bklkZW50aWZpZXIgPSAnZGF0YS1lZGl0LWJ0bic7XG4gICAgdGhpcy51cGRhdGVCdG5JZGVudGlmaWVyID0gJ2RhdGEtdXBkYXRlLWJ0bic7XG4gICAgdGhpcy5kZWxldGVCdG5JZGVudGlmaWVyID0gJ2RhdGEtZGVsZXRlLWJ0bic7XG5cbiAgICB0aGlzLmZvcm0gPSBmb3JtO1xuICAgIHRoaXMuZm9ybVZhbGlkYXRvciA9IGZvcm1WYWxpZGF0b3I7XG4gICAgdGhpcy5mb3JtRXJyb3IgPSBmb3JtRXJyb3I7XG4gICAgXG4gICAgdGhpcy5kb20gPSBkb207XG4gICAgdGhpcy5kb21GYWN0b3J5ID0gZG9tRmFjdG9yeTtcbiAgICBcbiAgICB0aGlzLmRpc3BhdGNoZXIgPSBkaXNwYXRjaGVyO1xuICAgIHRoaXMuc3RvcmFnZSA9IHN0b3JhZ2U7XG4gICAgdGhpcy5zdHJpbmdzID0gc3RyaW5ncztcbiAgICBcbiAgICAvLyBodG1sIGVsZW1lbnRzXG4gICAgdGhpcy5lbnRyaWVzQ29udGFpbmVyID0gdGhpcy5kb20uZ2V0KCcuZW50cmllcy1jb250YWluZXInKTtcbiAgICB0aGlzLmFtb3VudElucHV0ID0gdGhpcy5kb20uZ2V0KCdbZGF0YS1hbW91bnRdJyk7XG4gICAgdGhpcy5jYXRlZ29yeUlucHV0ID0gdGhpcy5kb20uZ2V0KCdbZGF0YS1jYXRlZ29yeV0nKTtcbiAgICB0aGlzLnNob3J0RGVzY3JpcHRpb25JbnB1dCA9IHRoaXMuZG9tLmdldCgnW2RhdGEtc2hvcnQtZGVzY3JpcHRpb25dJyk7XG5cbiAgICAvLyBjYWxsaW5nIG1ldGhvZHNcbiAgICB0aGlzLl9hdHRhY2hFdmVudExpc3RlbmVycygpO1xuICAgIHRoaXMuX2xvYWRDYXRlZ29yaWVzKCk7XG4gICAgdGhpcy5fbG9hZEVudHJpZXMoKTtcbiAgfVxuXG4gIF9hdHRhY2hFdmVudExpc3RlbmVycygpIHtcbiAgICB0aGlzLmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgdGhpcy5fYWRkTmV3RW50cnkuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5kaXNwYXRjaGVyLnN1YnNjcmliZSgnb25FbnRyeVVwZGF0ZWQnLCB0aGlzLl9sb2FkRW50cmllcy5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmVudHJpZXNDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9oYW5kbGVFbnRyeUV2ZW50cy5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIF9sb2FkQ2F0ZWdvcmllcygpIHtcbiAgICB0aGlzLmRvbS5nZXQoJ1tkYXRhLWNhdGVnb3J5XScpLmlubmVySFRNTCA9IHRoaXMuX2J1aWxkQ2F0ZWdvcmllc0h0bWwoKTtcbiAgfVxuXG4gIF9sb2FkRW50cmllcygpIHtcbiAgICB0aGlzLmVudHJpZXNDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gICAgY29uc3QgZW50cmllcyA9IHRoaXMuc3RvcmFnZS5nZXRBbGwoKTtcblxuICAgIGVudHJpZXMuZm9yRWFjaChlID0+IHtcbiAgICAgIGxldCBuZXdFbnRyeSA9IG5ldyBFbnRyeSh7XG4gICAgICAgIGlkOiBlLmlkLFxuICAgICAgICBhbW91bnQ6IGUuYW1vdW50LFxuICAgICAgICBzaG9ydERlc2NyaXB0aW9uOiBlLnNob3J0RGVzY3JpcHRpb24sXG4gICAgICAgIGNhdGVnb3J5OiBlLmNhdGVnb3J5XG4gICAgICB9LCB0aGlzLmRvbUZhY3RvcnkpO1xuXG4gICAgICBuZXdFbnRyeS50b1N0cmluZygpLnRoZW4oKGVudHJ5VGVtcGxhdGUpID0+IHtcbiAgICAgICAgdGhpcy5lbnRyaWVzQ29udGFpbmVyLmlubmVySFRNTCA9IGVudHJ5VGVtcGxhdGUgKyB0aGlzLmVudHJpZXNDb250YWluZXIuaW5uZXJIVE1MO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBfYnVpbGRDYXRlZ29yaWVzSHRtbCgpIHtcbiAgICBsZXQgY2F0ZWdvcmllc0h0bWwgPSAnJztcbiAgICBjb25zdCBjYXRlZ29yaWVzID0gdGhpcy5zdHJpbmdzLmNhdGVnb3JpZXM7XG5cbiAgICBmb3IgKGxldCBjYXRlZ29yeUluZGV4IGluIGNhdGVnb3JpZXMpIHtcbiAgICAgIGxldCBzZWxlY3RlZCA9ICcnO1xuICAgICAgY2F0ZWdvcmllc0h0bWwgKz0gdGhpcy5kb21GYWN0b3J5LmNhdGVnb3J5RHJvcGRvd25PcHRpb24oXG4gICAgICAgIGNhdGVnb3J5SW5kZXgsXG4gICAgICAgIGNhdGVnb3JpZXNbY2F0ZWdvcnlJbmRleF0sXG4gICAgICAgIGNhdGVnb3J5SW5kZXggPT0gMFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2F0ZWdvcmllc0h0bWw7XG4gIH1cblxuICBfYWRkTmV3RW50cnkoZXZ0KSB7XG4gICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB0aGlzLmZvcm1FcnJvci5yZXNldCgpO1xuICAgIGlmICghdGhpcy5mb3JtVmFsaWRhdG9yLnZhbGlkYXRlKCkpIHtcbiAgICAgIHRoaXMuZm9ybUVycm9yLmRpc3BsYXkodGhpcy5mb3JtVmFsaWRhdG9yKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBpZCA9IHRoaXMuX2dldE5leHRJZCgpO1xuICAgIGNvbnN0IG5ld0VudHJ5ID0gbmV3IEVudHJ5KHtcbiAgICAgIGlkOiBpZCxcbiAgICAgIGFtb3VudDogdGhpcy5hbW91bnRJbnB1dC52YWx1ZSxcbiAgICAgIHNob3J0RGVzY3JpcHRpb246IHRoaXMuc2hvcnREZXNjcmlwdGlvbklucHV0LnZhbHVlLFxuICAgICAgY2F0ZWdvcnk6IHRoaXMuY2F0ZWdvcnlJbnB1dC52YWx1ZVxuICAgIH0sIHRoaXMuZG9tRmFjdG9yeSk7XG5cbiAgICB0aGlzLnN0b3JhZ2Uuc2F2ZShuZXdFbnRyeSk7XG5cbiAgICAvLyBsb2FkIHRlbXBsYXRlIGFuZCBkaXNwbGF5IHRoZSBuZXcgZW50cnlcbiAgICBuZXdFbnRyeS50b1N0cmluZygpXG4gICAgICAudGhlbigoZW50cnlUZW1wbGF0ZSkgPT4ge1xuICAgICAgICB0aGlzLmVudHJpZXNDb250YWluZXIuaW5uZXJIVE1MID0gZW50cnlUZW1wbGF0ZSArIHRoaXMuZW50cmllc0NvbnRhaW5lci5pbm5lckhUTUw7XG4gICAgICB9KTtcblxuICAgIHRoaXMuZGlzcGF0Y2hlci5lbWl0KCdvbkVudHJ5QWRkZWQnLCBuZXdFbnRyeSk7XG5cbiAgICByZXR1cm4gdGhpcy5fY2xlYXIoW1xuICAgICAgICAgICAgdGhpcy5hbW91bnRJbnB1dCxcbiAgICAgICAgICAgIHRoaXMuc2hvcnREZXNjcmlwdGlvbklucHV0XG4gICAgICAgIF0pXG4gICAgICAgIC5fZm9jdXNPbih0aGlzLmFtb3VudElucHV0KTtcbiAgfVxuXG4gIF9nZXROZXh0SWQoKSB7XG4gICAgLy8gZ2V0cyB0aGUgYmlnZ2VzdCBpZCBmcm9tIHRoZSBlbnRyaWVzIChtYXgpIC0+IG1heCArIDFcbiAgICBjb25zdCBhbGxFbnRyaWVzID0gdGhpcy5kb20uZ2V0QWxsKCdbZGF0YS1lbnRyeV0nKTtcbiAgICBsZXQgbWF4ID0gMDtcbiAgICBhbGxFbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBsZXQgY3VycmVudE1heCA9ICsoZW50cnkuZ2V0QXR0cmlidXRlKHRoaXMuaWRJZGVudGlmaWVyKSk7XG4gICAgICBpZiAoY3VycmVudE1heCA+PSBtYXgpIHtcbiAgICAgICAgbWF4ID0gY3VycmVudE1heDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjdXJyZW50TWF4O1xuICAgIH0pO1xuICAgIHJldHVybiBtYXggKyAxO1xuICB9XG5cbiAgX2hhbmRsZUVudHJ5RXZlbnRzKGV2dCkge1xuICAgIGNvbnN0IHRhcmdldCA9IGV2dC50YXJnZXQ7XG5cbiAgICBpZiAodGFyZ2V0Lmhhc0F0dHJpYnV0ZSh0aGlzLmRlbGV0ZUJ0bklkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLl9kZWxldGVFbnRyeUhhbmRsZXIodGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmlkSWRlbnRpZmllcikpO1xuICAgIH1cblxuICAgIGlmICh0YXJnZXQuaGFzQXR0cmlidXRlKHRoaXMuZWRpdEJ0bklkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLl9lZGl0RW50cnlIYW5kbGVyKHRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5pZElkZW50aWZpZXIpKTtcbiAgICB9XG5cbiAgICBpZiAodGFyZ2V0Lmhhc0F0dHJpYnV0ZSh0aGlzLnVwZGF0ZUJ0bklkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLl91cGRhdGVFbnRyeUhhbmRsZXIodGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmlkSWRlbnRpZmllcikpO1xuICAgIH1cbiAgfVxuXG4gIF9kZWxldGVFbnRyeUhhbmRsZXIoZW50cnlJZCkge1xuICAgIHRoaXMuZG9tLnJlbW92ZSh0aGlzLmRvbS5nZXQoYFske3RoaXMuaWRJZGVudGlmaWVyfT1cIiR7ZW50cnlJZH1cIl1gKSk7XG5cbiAgICAvLyByZW1vdmUgZnJvbSB0aGUgc3RvcmFnZVxuICAgIGNvbnN0IGRlbGV0ZWQgPSB0aGlzLnN0b3JhZ2UucmVtb3ZlQnlQcm9wKHsgcHJvcDogJ2lkJywgdmFsdWU6IGVudHJ5SWQgfSk7XG5cbiAgICB0aGlzLmRpc3BhdGNoZXIuZW1pdCgnb25FbnRyeURlbGV0ZWQnLCBlbnRyeUlkKTtcblxuICAgIHJldHVybiBkZWxldGVkO1xuICB9XG5cbiAgX2VkaXRFbnRyeUhhbmRsZXIoZW50cnlJZCkge1xuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5zdG9yYWdlLmdldEJ5SWQoZW50cnlJZCk7XG5cbiAgICAobmV3IE1vZGFsKGVudHJ5LCB0aGlzLmRvbUZhY3RvcnkpKS50b1N0cmluZygpXG4gICAgICAudGhlbigobW9kYWxUZW1wbGF0ZSkgPT4ge1xuICAgICAgICAkKHRoaXMuZW50cmllc0NvbnRhaW5lcikuYXBwZW5kKG1vZGFsVGVtcGxhdGUpO1xuICAgICAgICAkKGAjZWRpdE1vZGFsX19FbnRyeV9fJHtlbnRyeS5pZH1gKVxuICAgICAgICAgIC5tb2RhbCgpXG4gICAgICAgICAgLm9uKCdoaWRkZW4uYnMubW9kYWwnLCAoZSkgPT4ge1xuICAgICAgICAgICAgJChlLnRhcmdldCkucmVtb3ZlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIF91cGRhdGVFbnRyeUhhbmRsZXIoZW50cnlJZCkge1xuICAgIHRoaXMuc3RvcmFnZS51cGRhdGUoZW50cnlJZCwge1xuICAgICAgYW1vdW50OiB0aGlzLmRvbS5nZXQoJ1tkYXRhLXVwZGF0ZS1hbW91bnRdJykudmFsdWUsXG4gICAgICBzaG9ydERlc2NyaXB0aW9uOiB0aGlzLmRvbS5nZXQoJ1tkYXRhLXVwZGF0ZS1zaG9ydC1kZXNjcmlwdGlvbl0nKS52YWx1ZVxuICAgIH0pO1xuXG4gICAgdGhpcy5kaXNwYXRjaGVyLmVtaXQoJ29uRW50cnlVcGRhdGVkJywgZW50cnlJZCk7XG4gIH1cblxuICBfY2xlYXIoZmllbGRzKSB7XG4gICAgZm9yIChsZXQgZmllbGQgb2YgZmllbGRzKSB7XG4gICAgICBmaWVsZC52YWx1ZSA9ICcnO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX2ZvY3VzT24oZmllbGQpIHtcbiAgICBmaWVsZC5mb2N1cygpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBGb3JtRXJyb3Ige1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIGRpc3BsYXkoZm9ybVZhbGlkYXRvcikge1xuICAgIGNvbnN0IGZvcm1FcnJvcnMgPSBmb3JtVmFsaWRhdG9yLmVycm9ycygpO1xuICAgIGZvcm1FcnJvcnMuZm9yRWFjaCgoZXJyb3IsIGtleSkgPT4ge1xuICAgICAgbGV0IGVsID0gJChgW2RhdGEtJHtrZXl9XWApLmFkZENsYXNzKCdmb3JtLWVycm9yJyk7XG4gICAgfSk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICAkKCcuZm9ybS1lcnJvcicpLnJlbW92ZUNsYXNzKCdmb3JtLWVycm9yJyk7XG4gIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEZvcm1WYWxpZGF0b3Ige1xuICBjb25zdHJ1Y3Rvcihmb3JtLCBkb20sIGVycm9yc0JhZykge1xuICAgIHRoaXMuZm9ybSA9IGZvcm07XG4gICAgdGhpcy5kb20gPSBkb207XG4gICAgdGhpcy5lcnJvcnNCYWcgPSBlcnJvcnNCYWc7XG4gIH1cblxuICB2YWxpZGF0ZSgpIHtcbiAgICB0aGlzLmVycm9yc0JhZy5jbGVhcigpO1xuICAgIGNvbnN0IHZhbGlkYXRhYmxlRmllbGRzID0gdGhpcy5kb20uZ2V0QWxsKCdbZGF0YS12YWxpZGF0ZV0nKTtcblxuICAgIGZvciAobGV0IGZpZWxkIG9mIHZhbGlkYXRhYmxlRmllbGRzKSB7XG4gICAgICBjb25zdCB2YWxpZGF0aW9uUnVsZXMgPSBmaWVsZC5kYXRhc2V0LnZhbGlkYXRlLnNwbGl0KCd8Jyk7XG5cbiAgICAgIHZhbGlkYXRpb25SdWxlcy5mb3JFYWNoKHJ1bGUgPT4gdGhpc1tgXyR7cnVsZX1gXShmaWVsZCkpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9pc0Vycm9yc0JhZ0VtcHR5KCk7XG4gIH1cblxuICBlcnJvcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXJyb3JzQmFnLmJhZztcbiAgfVxuXG4gIF9udW1iZXIoZmllbGQpIHtcbiAgICBjb25zdCB2YWx1ZSA9IGZpZWxkLnZhbHVlO1xuXG4gICAgaWYgKCEoIWlzTmFOKHBhcnNlRmxvYXQodmFsdWUpKSAmJiBpc0Zpbml0ZSh2YWx1ZSkpKSB7XG4gICAgICB0aGlzLmVycm9yc0JhZy5zZXQoZmllbGQuaWQsIGBOdW1iZXIgcmVxdWlyZWQsICR7dmFsdWV9IGdpdmVuLmApO1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBfaXNFcnJvcnNCYWdFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5lcnJvcnNCYWcuaXNFbXB0eSgpO1xuICB9XG59XG4iLCJpbXBvcnQgc3RyaW5ncyBmcm9tICcuLi9zdHJpbmdzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kYWwge1xuICBjb25zdHJ1Y3RvcihlbnRyeSwgZG9tRmFjdG9yeSkge1xuICAgIHRoaXMuZW50cnkgPSBlbnRyeTtcbiAgICB0aGlzLnN0cmluZ3MgPSBzdHJpbmdzO1xuICAgIHRoaXMuZG9tRmFjdG9yeSA9IGRvbUZhY3Rvcnk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5kb21GYWN0b3J5Lm1vZGFsKClcbiAgICAgICAgLnRoZW4oKG1vZGFsVGVtcGxhdGUpID0+IHtcblxuICAgICAgICAgIGNvbnN0IHJlbmRlcmVkID0gTXVzdGFjaGUucmVuZGVyKG1vZGFsVGVtcGxhdGUsIHtcbiAgICAgICAgICAgIGlkOiB0aGlzLmVudHJ5LmlkLFxuICAgICAgICAgICAgYW1vdW50OiB0aGlzLmVudHJ5LmFtb3VudCxcbiAgICAgICAgICAgIHNob3J0RGVzY3JpcHRpb246IHRoaXMuZW50cnkuc2hvcnREZXNjcmlwdGlvbixcbiAgICAgICAgICAgIGNhdGVnb3J5OiB0aGlzLnN0cmluZ3MuY2F0ZWdvcmllc1t0aGlzLmVudHJ5LmNhdGVnb3J5XSxcbiAgICAgICAgICAgIGNhdGVnb3JpZXM6IHRoaXMuc3RyaW5ncy5jYXRlZ29yaWVzXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXNvbHZlKHJlbmRlcmVkKTtcbiAgICAgICAgfSlcbiAgICB9KTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhdGlzdGljcyB7XG4gIGNvbnN0cnVjdG9yKHN0b3JhZ2UsIGRvbSwgZGlzcGF0Y2hlcikge1xuICAgIHRoaXMuc3RvcmFnZSA9IHN0b3JhZ2U7XG4gICAgdGhpcy5kb20gPSBkb207XG4gICAgdGhpcy5kaXNwYXRjaGVyID0gZGlzcGF0Y2hlcjtcblxuICAgIHRoaXMuc3RhdHMgPSB7XG4gICAgICB0b3RhbDogMFxuICAgIH07XG5cbiAgICB0aGlzLl9hdHRhY2hMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLl9idWlsZCgpO1xuICAgIHRoaXMuX2Rpc3BsYXkoKTtcbiAgfVxuXG4gIF9hdHRhY2hMaXN0ZW5lcnMoKSB7XG4gICAgdGhpcy5kaXNwYXRjaGVyLnN1YnNjcmliZSgnb25FbnRyeUFkZGVkJywgdGhpcy5fdXBkYXRlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZGlzcGF0Y2hlci5zdWJzY3JpYmUoJ29uRW50cnlVcGRhdGVkJywgdGhpcy5fdXBkYXRlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZGlzcGF0Y2hlci5zdWJzY3JpYmUoJ29uRW50cnlEZWxldGVkJywgdGhpcy5fdXBkYXRlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgX3VwZGF0ZShkYXRhKSB7XG4gICAgcmV0dXJuIHRoaXMuX2J1aWxkKCkuX2Rpc3BsYXkoKTtcbiAgfVxuXG4gIF9idWlsZCgpIHtcbiAgICB0aGlzLmVudHJpZXMgPSB0aGlzLnN0b3JhZ2UuZ2V0QWxsKCk7XG4gICAgdGhpcy5zdGF0cy50b3RhbCA9IHRoaXMuX2dldFRvdGFsKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9nZXRUb3RhbCgpIHtcbiAgICBpZiAoIXRoaXMuZW50cmllcykge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZW50cmllcy5yZWR1Y2UoKHRvdGFsLCBlKSA9PiB7XG4gICAgICByZXR1cm4gdG90YWwgKyBwYXJzZUZsb2F0KGUuYW1vdW50KTtcbiAgICB9LCAwKTtcbiAgfVxuXG4gIF9kaXNwbGF5KCkge1xuICAgIHRoaXMuZG9tLmdldCgnW2RhdGEtc3RhdGlzdGljcy10b3RhbF0nKS5pbm5lckhUTUwgPSB0aGlzLnN0YXRzLnRvdGFsO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTdG9yYWdlIHtcbiAgY29uc3RydWN0b3Ioa2V5LCBzdG9yYWdlRW5naW5lKSB7XG4gICAgdGhpcy5zdG9yYWdlRW5naW5lID0gc3RvcmFnZUVuZ2luZTtcbiAgICB0aGlzLmtleSA9IGtleTtcbiAgfVxuXG4gIGdldEFsbCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlRW5naW5lLmdldE9iamVjdCh0aGlzLmtleSk7XG4gIH1cblxuICBnZXRCeUlkKGlkKSB7XG4gICAgY29uc3QgZW50cmllcyA9IHRoaXMuc3RvcmFnZUVuZ2luZS5nZXRPYmplY3QodGhpcy5rZXkpIHx8IFtdO1xuXG4gICAgcmV0dXJuIGVudHJpZXMuZmluZChlbnRyeSA9PiArKGVudHJ5LmlkKSA9PT0gKyhpZCkpO1xuICB9XG5cbiAgcmVtb3ZlQnlQcm9wKG9wdHMpIHtcbiAgICBjb25zdCB7cHJvcCwgdmFsdWV9ID0gb3B0cztcbiAgICBsZXQgZW50cmllcyA9IHRoaXMuc3RvcmFnZUVuZ2luZS5nZXRPYmplY3QodGhpcy5rZXkpO1xuICAgIGlmIChlbnRyaWVzKSB7XG4gICAgICBlbnRyaWVzID0gZW50cmllcy5maWx0ZXIoZSA9PiBlW3Byb3BdICE9PSArdmFsdWUpO1xuICAgICAgdGhpcy5zdG9yYWdlRW5naW5lLnNldEpzb24odGhpcy5rZXksIGVudHJpZXMpO1xuICAgIH1cbiAgfVxuXG4gIHNhdmUoZW50cnkpIHtcbiAgICBsZXQgZW50cmllcyA9IHRoaXMuc3RvcmFnZUVuZ2luZS5oYXModGhpcy5rZXkpID9cbiAgICAgIHRoaXMuc3RvcmFnZUVuZ2luZS5nZXRPYmplY3QodGhpcy5rZXkpIDpcbiAgICAgIFtdO1xuXG4gICAgLy8gR2V0IG9ubHkgdGhlIHZhbHVlcywgdGhhdCBhcmUgd2l0aCBkaWZmZXJlbnQgaWRzIGZyb20gdGhlIG5ldyBlbnRyeSAoYXZvaWQgZHVwbGljYXRpb24gb2YgaWRzKS5cbiAgICBlbnRyaWVzID0gZW50cmllcy5maWx0ZXIoKGV4aXN0aW5nRW50cnkpID0+IGV4aXN0aW5nRW50cnkuaWQgIT09IGVudHJ5LmlkKTtcblxuICAgIGVudHJpZXMucHVzaChlbnRyeS50b0pzb24oKSk7XG4gICAgdGhpcy5zdG9yYWdlRW5naW5lLnNldEpzb24odGhpcy5rZXksIGVudHJpZXMpO1xuICB9XG5cbiAgdXBkYXRlKGlkLCBkYXRhKSB7XG4gICAgY29uc3QgZW50cmllcyA9IHRoaXMuc3RvcmFnZUVuZ2luZS5nZXRPYmplY3QodGhpcy5rZXkpO1xuXG4gICAgY29uc3QgdXBkYXRlZEVudHJpZXMgPSBlbnRyaWVzLm1hcCgoZW50cnkpID0+IHtcbiAgICAgIGlmICgrKGVudHJ5LmlkKSA9PT0gKyhpZCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogZW50cnkuaWQsXG4gICAgICAgICAgYW1vdW50OiBkYXRhLmFtb3VudCB8fCBlbnRyeS5hbW91bnQsXG4gICAgICAgICAgc2hvcnREZXNjcmlwdGlvbjogZGF0YS5zaG9ydERlc2NyaXB0aW9uIHx8IGVudHJ5LnNob3J0RGVzY3JpcHRpb24sXG4gICAgICAgICAgY2F0ZWdvcnk6IGRhdGEuY2F0ZWdvcnkgfHwgZW50cnkuY2F0ZWdvcnlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGVudHJ5O1xuICAgIH0pO1xuXG4gICAgdGhpcy5zdG9yYWdlRW5naW5lLnNldEpzb24odGhpcy5rZXksIHVwZGF0ZWRFbnRyaWVzKTtcbiAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9jYWxTdG9yYWdlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5scyA9IGxvY2FsU3RvcmFnZTtcbiAgICB0aGlzLmxlbmd0aCA9IHRoaXMubHMubGVuZ3RoO1xuICB9XG5cbiAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5scy5zZXRJdGVtKGtleSwgdmFsdWUpO1xuICB9XG5cbiAgc2V0SnNvbihrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMubHMuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gIH1cblxuICBnZXQoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMubHMuZ2V0SXRlbShrZXkpO1xuICB9XG5cbiAgZ2V0T2JqZWN0KGtleSkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMubHMuZ2V0SXRlbShrZXkpKTtcbiAgfVxuXG4gIGhhcyhrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoa2V5KSAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZ2V0KGtleSkgIT09IG51bGw7XG4gIH1cblxuICByZW1vdmUoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMubHMucmVtb3ZlKGtleSk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLmxzLmNsZWFyO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCB7XG4gIGNhdGVnb3JpZXM6IHtcbiAgICAnMCc6ICfQpdGA0LDQvdCwJyxcbiAgICAnMSc6ICfQotGA0LDQvdGB0L/QvtGA0YInLFxuICAgICcyJzogJ9CX0LDQsdCw0LLQu9C10L3QuNGPJyxcbiAgICAnMyc6ICfQlNGA0LXRhdC4J1xuICB9XG59O1xuIl19
