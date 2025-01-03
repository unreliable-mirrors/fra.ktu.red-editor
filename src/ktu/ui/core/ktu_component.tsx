import jsx from "texsaur";

import DataStore from "./data_store";
import EventDispatcher from "./event_dispatcher";

export class KTUComponent extends HTMLElement {
  binding: any;

  constructor() {
    super();
    this.updateState();
    this.bindEvents();
  }

  connectedCallback() {
    console.log("CONNECTED CALLBACK");
    this.updateState();
    this.reRender();
  }

  updateStateWrapper() {
    this.updateState();

    this.reRender();
  }

  updateState() {
    this.binding =
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
