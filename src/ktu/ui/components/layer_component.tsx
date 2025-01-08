import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";
import { IEditorLayer } from "../../layers/ieditor_layer";
import { FileLoaderComponent } from "./file_loader";

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
                  setting.onchange((e.target as HTMLInputElement).value);
                }}
              ></input>
            </div>
          );
        } else if (setting.type === "integer") {
          settings.push(
            <div>
              <span>{setting.field}: </span>
              <input
                type="number"
                value={this.layer.state[setting.field]}
                oninput={(e) => {
                  console.log((e.target as HTMLInputElement).value);
                  setting.onchange((e.target as HTMLInputElement).value);
                }}
              ></input>
            </div>
          );
        } else if (setting.type === "float") {
          settings.push(
            <div>
              <span>{setting.field}: </span>
              <input
                type="number"
                value={this.layer.state[setting.field]}
                min="0"
                max="1"
                step="0.01"
                oninput={(e) => {
                  console.log((e.target as HTMLInputElement).value);
                  setting.onchange((e.target as HTMLInputElement).value);
                }}
              ></input>
            </div>
          );
        } else if (setting.type === "file") {
          settings.push(
            <div>
              <span>{setting.field}: </span>
              {new FileLoaderComponent({ onchange: setting.onchange })}
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
