export default class LocalStorage {
  constructor() {
    this.ls = localStorage;
    this.length = this.ls.length;
  }

  set(key, value) {
    return this.ls.setItem(key, value);
  }

  setJson(key, value) {
    return this.ls.setItem(key, JSON.stringify(value));
  }

  get(key) {
    return this.ls.getItem(key);
  }

  getObject(key) {
    return JSON.parse(this.ls.getItem(key));
  }

  has(key) {
    return this.get(key) !== undefined && this.get(key) !== null;
  }

  remove(key) {
    return this.ls.remove(key);
  }

  clear() {
    this.ls.clear;
    return this;
  }
}
