import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";
import { ContainerLayer } from "../../layers/container_layer";

export class CreateBnwShaderButtonComponent extends KTUComponent {
  containerLayer?: ContainerLayer;

  constructor(containerLayer?: ContainerLayer) {
    super();
    console.log("CONTAINER LAYER CONSTRUCTOR", containerLayer);
    this.containerLayer = containerLayer;
  }

  render(): Element {
    return (
      <div>
        <button onclick={() => this.handleClick()}>
          Add Black&White Shader
        </button>
      </div>
    );
  }

  handleClick() {
    console.log("CONTAINER LAYER CLICK", this.containerLayer);
    if (this.containerLayer) {
      this.containerLayer.addShaderFromState("bnw_shader");
    } else {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "add_bnw_shader",
        {}
      );
    }
  }
}

customElements.define(
  "create-bnw-shader-button",
  CreateBnwShaderButtonComponent
);
