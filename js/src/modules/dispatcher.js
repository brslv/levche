let instance = null;

export default class Dispatcher {
  constructor() {
    if (!instance) {
      instance = this;
    }

    this.map = new Map();

    return instance;
  }

  emit(evt, data) {
    for (let e of this.map.keys()) {
      if (e === evt) {
        this.map.get(evt).forEach((handler) => {
            handler(data);
        });
      }
    }
  }

  subscribe(evt, handler) {
    if (this.map.has(evt)) {
      return this.map.get(evt).push(handler);
    }

    return this.map.set(evt, [handler]);
  }
}
