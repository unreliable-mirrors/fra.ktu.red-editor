import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";

export class CreateVintageShaderButtonComponent extends KTUComponent {
  constructor() {
    super();
  }

  render(): Element {
    return (
      <div>
        <button onclick={this.handleClick}>Add Vintage Shader</button>
      </div>
    );
  }

  handleClick() {
    EventDispatcher.getInstance().dispatchEvent(
      "scene",
      "add_vintage_shader",
      {}
    );
  }
}

customElements.define(
  "create-vintage-shader-button",
  CreateVintageShaderButtonComponent
);
