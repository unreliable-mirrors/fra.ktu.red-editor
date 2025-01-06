import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";
import { ILayer } from "../../../engine/ilayer";

export class LayerComponent extends KTUComponent {
  layer: ILayer;
  constructor(layer: ILayer) {
    super();
    this.layer = layer;
  }

  render(): Element {
    return (
      <div
        onclick={() => {
          this.handleClick();
        }}
      >
        LAYER
      </div>
    );
  }

  handleClick() {
    EventDispatcher.getInstance().dispatchEvent("scene", "activateLayer", {
      layer: this.layer,
    });
  }
}

customElements.define("layer-component", LayerComponent);
