import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";

export class CreateShaderLayerButtonComponent extends KTUComponent {
  constructor() {
    super();
  }

  render(): Element {
    return (
      <div>
        <button onclick={this.handleClick}>Add Shader Layer</button>
      </div>
    );
  }

  handleClick() {
    EventDispatcher.getInstance().dispatchEvent("scene", "addShaderLayer", {});
  }
}

customElements.define(
  "create-shader-layer-button",
  CreateShaderLayerButtonComponent
);
