import EventDispatcher from "./event_dispatcher";

class DataStore {
  static _instance: DataStore;

  _data: Record<string, any>;
  constructor() {
    this._data = {};
  }

  setStore(key: string, value: any) {
    this._data[key] = value;
    EventDispatcher.getInstance().dispatchEvent(key, "update", value);
  }

  getStore(key: string): any {
    console.log("DATA", this._data);
    return this._data[key];
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new DataStore();
    }
    return this._instance;
  }
}
export default DataStore;
