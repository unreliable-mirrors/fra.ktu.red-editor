import jsx from "texsaur";

import DataStore from "./data_store";
import EventDispatcher from "./event_dispatcher";

export class KTUComponent extends HTMLElement {
  //TODO: CHANGE THIS TO GENERICS
  bindingKeys!: string[];
  bindingData: any;

  constructor() {
    super();
    this.bindingKeys = this.getAttribute("binding")
      ? this.getAttribute("binding")!.split(",")
      : [];
    this.updateState();
  }

  connectedCallback() {
    this.bindingKeys = this.getAttribute("binding")
      ? this.getAttribute("binding")!.split(",")
      : [];
    this.bindingData = this.defaultBinding();
    this.updateState();
    this.reRender();
    this.bindEvents();
  }

  updateStateWrapper() {
    this.updateState();

    this.reRender();
  }

  updateState() {
    for (const bindingKey of this.bindingKeys) {
      if (DataStore.getInstance().getStore(bindingKey)) {
        this.bindingData[bindingKey] =
          DataStore.getInstance().getStore(bindingKey);
      }
    }
  }
  defaultBinding(): Record<string, any> {
    return {};
  }
  bindEvents() {
    for (const bindingKey of this.bindingKeys) {
      EventDispatcher.getInstance().addEventListener(
        bindingKey,
        "update",
        () => {
          this.updateStateWrapper();
        }
      );
    }
  }

  reRender() {
    this.innerHTML = "";
    this.appendChild(this.render());
  }
  render(): Element {
    return <></>;
  }
}
