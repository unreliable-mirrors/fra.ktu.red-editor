import jsx from "texsaur";

import { KTUComponent } from "../core/ktu_component";
import { ShaderComponent } from "./shader_component";
import { ShaderLayer } from "../../shaders/shader_layer";
import { AVAILABLE_SHADERS_NAMES } from "../../helpers/shaders";
import { AddShaderButtonComponent } from "./add_shader_button";

export class ShadersList extends KTUComponent {
  render(): Element {
    const items: Element[] = [];
    const shaderButtons: Element[] = [];
    for (const shaderName of AVAILABLE_SHADERS_NAMES) {
      shaderButtons.push(new AddShaderButtonComponent(shaderName));
    }
    for (const layer of [...(this.bindingData as ShaderLayer[])].reverse()) {
      items.push(new ShaderComponent(layer));
    }
    return (
      <div>
        <h3>Global Shaders</h3>
        {shaderButtons}
        <div className="shadersList">{items}</div>
      </div>
    );
  }

  defaultBinding() {
    return [];
  }
}

customElements.define("shaders-list", ShadersList);
