import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";
import { IEditorLayer } from "../../layers/ieditor_layer";

export class LayerComponent extends KTUComponent {
  layer: IEditorLayer;
  constructor(layer: IEditorLayer) {
    super();
    this.layer = layer;
  }

  render(): Element {
    const active = this.layer.active ? "active" : "";
    return (
      <div
        className={`layerItem ${active}`}
        onclick={() => {
          this.handleClick();
        }}
      >
        {this.layer.state.name} - {this.layer.state.layerId}
      </div>
    );
  }

  handleClick() {
    EventDispatcher.getInstance().dispatchEvent(
      "scene",
      "activateLayer",
      this.layer
    );
  }
}

customElements.define("layer-component", LayerComponent);
