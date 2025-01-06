import jsx from "texsaur";

import DataStore from "./data_store";
import EventDispatcher from "./event_dispatcher";

export class KTUComponent extends HTMLElement {
  bindingData: any;

  constructor() {
    super();
    this.updateState();
  }

  connectedCallback() {
    this.updateState();
    this.reRender();
    this.bindEvents();
  }

  updateStateWrapper() {
    this.updateState();

    this.reRender();
  }

  updateState() {
    this.bindingData =
      this.getAttribute("binding") &&
      DataStore.getInstance().getStore(this.getAttribute("binding")!)
        ? DataStore.getInstance().getStore(this.getAttribute("binding")!)
        : this.defaultBinding();
  }
  defaultBinding(): any {
    return null;
  }
  bindEvents() {
    if (this.getAttribute("binding")) {
      EventDispatcher.getInstance().addEventListener(
        this.getAttribute("binding")!,
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
