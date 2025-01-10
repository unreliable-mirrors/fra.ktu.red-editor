import jsx from "texsaur";
import { KTUComponent } from "../../core/ktu_component";
import { ContainerLayer } from "../../../layers/container_layer";
import { getIcon, IconPlus } from "../../../helpers/icons";
import EventDispatcher from "../../core/event_dispatcher";

export class AddLayerButtonComponent extends KTUComponent {
  containerLayer?: ContainerLayer;
  layerName: string;

  constructor(layerName: string) {
    super();
    this.layerName = layerName;
  }

  render(): Element {
    return (
      <button onclick={() => this.handleClick()}>
        {IconPlus()}
        {getIcon(this.layerName)}
      </button>
    );
  }

  handleClick() {
    if (this.containerLayer) {
      this.containerLayer.addShaderFromState(this.layerName);
    } else {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        `add_${this.layerName}`,
        {}
      );
    }
  }
}

customElements.define("add-layer-button", AddLayerButtonComponent);
