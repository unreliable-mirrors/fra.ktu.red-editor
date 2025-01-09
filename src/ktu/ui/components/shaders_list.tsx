import jsx from "texsaur";

import { KTUComponent } from "../core/ktu_component";
import { ShaderComponent } from "./shader_component";
import { ShaderLayer } from "../../shaders/shader_layer";

export class ShadersList extends KTUComponent {
  render(): Element {
    const items: Element[] = [];
    for (const layer of [...(this.bindingData as ShaderLayer[])].reverse()) {
      items.push(new ShaderComponent(layer));
    }
    return (
      <div>
        <div className="shadersList">
          <h3>Global Shaders</h3>
          {items}
        </div>
        <create-bnw-shader-button></create-bnw-shader-button>
        <create-vintage-shader-button></create-vintage-shader-button>
        <create-pixelate-shader-button></create-pixelate-shader-button>
      </div>
    );
  }

  defaultBinding() {
    return [];
  }
}

customElements.define("shaders-list", ShadersList);
