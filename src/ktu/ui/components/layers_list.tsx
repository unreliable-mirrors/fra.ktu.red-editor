import jsx from "texsaur";

import { KTUComponent } from "../core/ktu_component";
import { LayerComponent } from "./layer_component";
import { ContainerLayer } from "../../layers/container_layer";

export class LayersList extends KTUComponent {
  render(): Element {
    console.log("LAYERS LIST RENDER", this.bindingData.length);
    const items: Element[] = [];
    for (const layer of [...(this.bindingData as ContainerLayer[])].reverse()) {
      items.push(new LayerComponent(layer));
    }
    return (
      <div>
        <div className="layerList">
          <h3>Layers</h3>
          {items}
        </div>
        <create-background-layer-button></create-background-layer-button>
        <create-sprite-layer-button></create-sprite-layer-button>
        <create-image-layer-button></create-image-layer-button>
      </div>
    );
  }

  defaultBinding() {
    return [];
  }
}

customElements.define("layers-list", LayersList);
