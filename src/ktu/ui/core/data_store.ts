import EventDispatcher from "./event_dispatcher";

class DataStore {
  static _instance: DataStore;

  _data: Record<string, any>;
  constructor() {
    this._data = {};
  }

  setStore(key: string, value: any, silent: boolean = false): void {
    this._data[key] = value;
    if (!silent) {
      this.touch(key);
    }
  }

  getStore(key: string): any {
    return this._data[key];
  }

  touch(key: string): any {
    EventDispatcher.getInstance().dispatchEvent(key, "update", this._data[key]);
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new DataStore();
    }
    return this._instance;
  }
}
export default DataStore;
