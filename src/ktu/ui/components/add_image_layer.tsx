import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";

export class CreateImageLayerButtonComponent extends KTUComponent {
  constructor() {
    super();
  }

  render(): Element {
    return (
      <div>
        <button onclick={this.handleClick}>Add Image Layer</button>
      </div>
    );
  }

  handleClick() {
    EventDispatcher.getInstance().dispatchEvent("scene", "add_image_layer", {});
  }
}

customElements.define(
  "create-image-layer-button",
  CreateImageLayerButtonComponent
);
