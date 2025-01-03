class EventDispatcher {
  static _instance: EventDispatcher;

  _listeners: Record<string, Record<string, Function[]>>;
  constructor() {
    this._listeners = {};
  }

  addEventListener(target: string, event: string, callback: Function) {
    console.log("AEL", target, event, callback);
    this._listeners[target] ||= {};
    this._listeners[target][event] ||= [];
    this._listeners[target][event].push(callback);
    console.log("AEL2", this._listeners);
  }

  removeEventListener(target: string, event: string, callback: Function) {
    const i = this._listeners[target][event].indexOf(callback);
    this._listeners[target][event].splice(i, 1);
  }

  dispatchEvent(target: string, event: string, payload: any) {
    console.log("EVENT", target, event, payload);
    if (this._listeners[target] && this._listeners[target][event]) {
      console.log("FIRE EVENT", target, event, payload);
      this._listeners[target][event].forEach((callback) => callback(payload));
    }
  }

  static getInstance() {
    if (!this._instance) {
      this._instance = new EventDispatcher();
      if (window) {
        window.EventDispatcher = this._instance;
      }
    }
    return this._instance;
  }
}
export default EventDispatcher;
