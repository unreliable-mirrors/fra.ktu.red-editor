import jsx from "texsaur";

import { KTUComponent } from "../core/ktu_component";
import { LayerComponent } from "./layer_component";
import { IEditorLayer } from "../../layers/ieditor_layer";

export class ShadersList extends KTUComponent {
  render(): Element {
    const items: Element[] = [];
    for (const layer of [...(this.bindingData as IEditorLayer[])].reverse()) {
      items.push(new LayerComponent(layer));
    }
    return (
      <div>
        <div className="shadersList">
          <h3>Global Shaders</h3>
          {items}
        </div>
        <create-bnw-shader-button></create-bnw-shader-button>
      </div>
    );
  }

  defaultBinding() {
    return [];
  }
}

customElements.define("shaders-list", ShadersList);
