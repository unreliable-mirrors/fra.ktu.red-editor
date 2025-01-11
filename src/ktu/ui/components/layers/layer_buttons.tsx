import jsx from "texsaur";

import { KTUComponent } from "../../core/ktu_component";
import { AVAILABLE_LAYER_NAMES } from "../../../helpers/layers";
import { AddLayerButtonComponent } from "./add_layer_button";

export class LayersButtons extends KTUComponent {
  render(): Element {
    const layerButtons: Element[] = [];
    for (const layerName of AVAILABLE_LAYER_NAMES) {
      layerButtons.push(new AddLayerButtonComponent(layerName));
    }
    return <div className="layerIcons">{layerButtons}</div>;
  }

  defaultBinding() {
    return { layers: [] };
  }
}

customElements.define("layers-buttons", LayersButtons);
