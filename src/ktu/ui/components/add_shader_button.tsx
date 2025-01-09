import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";
import { ContainerLayer } from "../../layers/container_layer";
import { getText } from "../../helpers/localization_helper";

export class AddShaderButtonComponent extends KTUComponent {
  containerLayer?: ContainerLayer;
  shaderName: string;

  constructor(shaderName: string, containerLayer?: ContainerLayer) {
    super();
    this.containerLayer = containerLayer;
    this.shaderName = shaderName;
  }

  render(): Element {
    return (
      <div>
        <button onclick={() => this.handleClick()}>
          {getText(`add_${this.shaderName}_button`)}
        </button>
      </div>
    );
  }

  handleClick() {
    if (this.containerLayer) {
      this.containerLayer.addShaderFromState(this.shaderName);
    } else {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        `add_${this.shaderName}`,
        {}
      );
    }
  }
}

customElements.define("add-shader-button", AddShaderButtonComponent);
