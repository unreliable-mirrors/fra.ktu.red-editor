import jsx from "texsaur";
import { KTUComponent } from "../../core/ktu_component";
import EventDispatcher from "../../core/event_dispatcher";
import { getLayerById } from "../../../helpers/layers";

export class LayerHint extends KTUComponent {
  layerId: number;
  layerName: string;

  constructor(layerId: number, layerName: string) {
    super();
    this.layerId = layerId;
    this.layerName = layerName;
  }

  render(): Element {
    return (
      <button
        onclick={() => {
          this.handleClick();
        }}
      >
        {this.layerName} - {this.layerId}
      </button>
    );
  }

  handleClick() {
    const layer = getLayerById(this.layerId)!;
    if (!layer.active) {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "activateLayer",
        layer
      );
    }
  }
}

customElements.define("layer-hint", LayerHint);
