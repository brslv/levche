export default class ErrorBag {
  constructor() {
    this.bag = new Map();
  }

  set(key, val) {
    this.bag.set(key, val);

    return this;
  }

  get(key) {
    return this.bag.get(key);
  }

  delete(key) {
    this.bag.delete(key);

    return this;
  }

  clear() {
    this.bag.clear();

    return this;
  }

  isEmpty() {
    return this.bag.size === 0;
  }

  size() {
    return this.bag.size;
  }
}
