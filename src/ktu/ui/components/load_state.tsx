import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";

export class LoadStateComponent extends KTUComponent {
  constructor() {
    super();
  }

  render(): Element {
    return (
      <div>
        <input type="text" id="stateInput"></input>
        <button onclick={this.handleClick}>LoadState</button>
      </div>
    );
  }

  handleClick() {
    const payload: any = JSON.parse(
      (document.getElementById("stateInput")! as HTMLInputElement).value
    );
    EventDispatcher.getInstance().dispatchEvent("scene", "loadState", payload);
  }
}

customElements.define("load-state", LoadStateComponent);
