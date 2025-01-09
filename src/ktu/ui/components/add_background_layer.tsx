import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";

export class CreateBackgroundLayerButtonComponent extends KTUComponent {
  constructor() {
    super();
  }

  render(): Element {
    return (
      <div>
        <button onclick={() => this.handleClick()}>Add Background Layer</button>
      </div>
    );
  }

  handleClick() {
    EventDispatcher.getInstance().dispatchEvent(
      "scene",
      "add_background_layer",
      {}
    );
  }
}

customElements.define(
  "create-background-layer-button",
  CreateBackgroundLayerButtonComponent
);
