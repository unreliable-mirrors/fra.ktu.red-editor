import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";
import { LayerComponent } from "./layer_component";
import { IEditorLayer } from "../../layers/ieditor_layer";

export class LayersList extends KTUComponent {
  render(): Element {
    console.log("LAYERS LIST RENDER", this.bindingData.length);
    const items: Element[] = [];
    for (const layer of [...(this.bindingData as IEditorLayer[])].reverse()) {
      items.push(new LayerComponent(layer));
    }
    return <div className="layerList">{items}</div>;
  }

  handleClick() {
    EventDispatcher.getInstance().dispatchEvent("scene", "addShaderLayer", {});
  }

  defaultBinding() {
    return [];
  }
}

customElements.define("layers-list", LayersList);
