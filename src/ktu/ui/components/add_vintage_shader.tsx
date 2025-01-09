import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";
import { ContainerLayer } from "../../layers/container_layer";

export class CreateVintageShaderButtonComponent extends KTUComponent {
  containerLayer?: ContainerLayer;

  constructor(containerLayer?: ContainerLayer) {
    super();
    this.containerLayer = containerLayer;
  }

  render(): Element {
    return (
      <div>
        <button onclick={() => this.handleClick()}>Add Vintage Shader</button>
      </div>
    );
  }

  handleClick() {
    if (this.containerLayer) {
      this.containerLayer.addShaderFromState("vintage_shader");
    } else {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "add_vintage_shader",
        {}
      );
    }
  }
}

customElements.define(
  "create-vintage-shader-button",
  CreateVintageShaderButtonComponent
);
