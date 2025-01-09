import jsx from "texsaur";

import { KTUComponent } from "../core/ktu_component";
import { LayerComponent } from "./layer_component";
import { ContainerLayer } from "../../layers/container_layer";
import { AVAILABLE_LAYER_NAMES } from "../../helpers/layers";
import { AddLayerButtonComponent } from "./add_layer_button";

export class LayersList extends KTUComponent {
  render(): Element {
    console.log("LAYERS LIST RENDER", this.bindingData.length);
    const items: Element[] = [];
    const layerButtons: Element[] = [];
    for (const layerName of AVAILABLE_LAYER_NAMES) {
      layerButtons.push(new AddLayerButtonComponent(layerName));
    }
    for (const layer of [...(this.bindingData as ContainerLayer[])].reverse()) {
      items.push(new LayerComponent(layer));
    }
    return (
      <div>
        <h3>Layers</h3>
        <div className="layerIcons">{layerButtons}</div>
        <div className="layerList">{items}</div>
      </div>
    );
  }

  defaultBinding() {
    return [];
  }
}

customElements.define("layers-list", LayersList);
