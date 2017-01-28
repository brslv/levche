export default class Storage {
  constructor(key, storageEngine) {
    this.storageEngine = storageEngine;
    this.key = key;
  }

  getAll() {
    return this.storageEngine.getObject(this.key);
  }

  getById(id) {
    const entries = this.storageEngine.getObject(this.key) || [];

    return entries.find(entry => +(entry.id) === +(id));
  }

  removeByProp(opts) {
    const {prop, value} = opts;
    let entries = this.storageEngine.getObject(this.key);
    if (entries) {
      entries = entries.filter(e => e[prop] !== +value);
      this.storageEngine.setJson(this.key, entries);
    }
  }

  save(entry) {
    let entries = this.storageEngine.has(this.key) ?
      this.storageEngine.getObject(this.key) :
      [];

    // Get only the values, that are with different ids from the new entry (avoid duplication of ids).
    entries = entries.filter((existingEntry) => existingEntry.id !== entry.id);

    entries.push(entry.toJson());
    this.storageEngine.setJson(this.key, entries);
  }

  update(id, data) {
    const entries = this.storageEngine.getObject(this.key);

    const updatedEntries = entries.map((entry) => {
      if (+(entry.id) === +(id)) {
        return {
          id: entry.id,
          amount: data.amount || entry.amount,
          shortDescription: data.shortDescription || entry.shortDescription,
          category: data.category || entry.category
        }
      }
      return entry;
    });

    this.storageEngine.setJson(this.key, updatedEntries);
  }
}
