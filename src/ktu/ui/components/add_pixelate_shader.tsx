import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";
import { ContainerLayer } from "../../layers/container_layer";

export class CreatePixelateShaderButtonComponent extends KTUComponent {
  containerLayer?: ContainerLayer;

  constructor(containerLayer?: ContainerLayer) {
    super();
    this.containerLayer = containerLayer;
  }

  render(): Element {
    return (
      <div>
        <button onclick={() => this.handleClick()}>Add Pixelate Shader</button>
      </div>
    );
  }

  handleClick() {
    if (this.containerLayer) {
      this.containerLayer.addShaderFromState("pixelate_shader");
    } else {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "add_pixelate_shader",
        {}
      );
    }
  }
}

customElements.define(
  "create-pixelate-shader-button",
  CreatePixelateShaderButtonComponent
);
