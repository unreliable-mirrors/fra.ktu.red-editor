import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";

export class CreateSpriteLayerButtonComponent extends KTUComponent {
  constructor() {
    super();
  }

  render(): Element {
    return (
      <div>
        <button onclick={this.handleClick}>Add Sprite Layer</button>
      </div>
    );
  }

  handleClick() {
    EventDispatcher.getInstance().dispatchEvent("scene", "addSpriteLayer", {});
  }
}

customElements.define(
  "create-sprite-layer-button",
  CreateSpriteLayerButtonComponent
);
