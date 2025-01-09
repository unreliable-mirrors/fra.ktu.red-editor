import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";

export class CreatePixelateShaderButtonComponent extends KTUComponent {
  constructor() {
    super();
  }

  render(): Element {
    return (
      <div>
        <button onclick={this.handleClick}>Add Pixelate Shader</button>
      </div>
    );
  }

  handleClick() {
    EventDispatcher.getInstance().dispatchEvent(
      "scene",
      "add_pixelate_shader",
      {}
    );
  }
}

customElements.define(
  "create-pixelate-shader-button",
  CreatePixelateShaderButtonComponent
);
