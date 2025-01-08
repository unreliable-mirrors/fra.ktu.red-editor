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
    const settings: Element[] = [];
    if (this.layer.active) {
      for (const setting of this.layer.settings) {
        if (setting.type === "color") {
          settings.push(
            <div>
              <span>{setting.field}: </span>
              <input
                type="color"
                value={this.layer.state[setting.field]}
                oninput={(e) => {
                  console.log((e.target as HTMLInputElement).value);
                  setting.onchange((e.target as HTMLInputElement).value);
                }}
              ></input>
            </div>
          );
        }
      }
    }
    return (
      <div
        className={`layerItem ${active}`}
        onclick={() => {
          this.handleClick();
        }}
      >
        {this.layer.state.name} - {this.layer.state.layerId}
        {settings}
      </div>
    );
  }

  handleClick() {
    if (!this.layer.active) {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "activateLayer",
        this.layer
      );
    }
  }
}

customElements.define("layer-component", LayerComponent);
