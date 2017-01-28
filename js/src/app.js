'use strict';

import Dom from './modules/dom';
import Storage from './modules/storage';
import LocalStorage from './modules/storageEngines/localStorage';
import Statistics from './modules/statistics';
import Form from './modules/form';
import Dispatcher from './modules/dispatcher';
import DomFactory from './modules/domFactory';
import FormError from './modules/formError';
import FormValidator from './modules/formValidator';
import ErrorsBag from './modules/errorsBag';

const dom = new Dom();
const storage = new Storage('entries', new LocalStorage());
const dispatcher = new Dispatcher();
const statistics = new Statistics(storage, dom, dispatcher);
const domFactory = new DomFactory();
const formError = new FormError();
const formElement = dom.get('[data-main-form]');
const formValidator = new FormValidator(formElement, dom, new ErrorsBag());

// initiate the main form
const form = new Form(
    formElement, 
    formValidator,
    storage,
    dom,
    dispatcher,
    domFactory,
    formError
);
