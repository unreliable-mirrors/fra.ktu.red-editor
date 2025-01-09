import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";
import { FileLoaderComponent } from "./file_loader";
import { ContainerLayer } from "../../layers/container_layer";
import { ShaderComponent } from "./shader_component";
import DataStore from "../core/data_store";
import { AddShaderButtonComponent } from "./add_shader_button";
import { AVAILABLE_SHADERS_NAMES } from "../../helpers/shaders";
import {
  IconClose,
  IconDuplicate,
  IconHidden,
  IconVisible,
} from "../../helpers/icons";

export class LayerComponent extends KTUComponent {
  layer: ContainerLayer;
  constructor(layer: ContainerLayer) {
    super();
    this.layer = layer;
  }

  render(): Element {
    const active = this.layer.active ? "active" : "";
    const settings: Element[] = [];
    const shaders: Element[] = [];
    const shaderButtons: Element[] = [];
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
                  setting.onchange((e.target as HTMLInputElement).value);
                }}
              ></input>
            </div>
          );
        } else if (setting.type === "text") {
          settings.push(
            <div>
              <span>{setting.field}: </span>
              <input
                type="text"
                value={this.layer.state[setting.field]}
                oninput={(e) => {
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
      for (const shaderName of AVAILABLE_SHADERS_NAMES) {
        shaderButtons.push(
          new AddShaderButtonComponent(shaderName, this.layer)
        );
      }
    }
    for (const shader of [...this.layer.shaders].reverse()) {
      shaders.push(new ShaderComponent(shader, this.layer));
    }
    return (
      <div className={`layerItem ${active}`}>
        <div className="header">
          <div
            className="title"
            onclick={() => {
              this.handleClick();
            }}
          >
            {this.layer.state.name} - {this.layer.state.layerId}
          </div>
          <div className="icons">
            <span onclick={() => this.handleVisibleClick()}>
              {this.layer.visible ? IconVisible() : IconHidden()}
            </span>
            <span onclick={() => this.handleDuplicateClick()}>
              {IconDuplicate()}
            </span>
            <span onclick={() => this.handleCloseClick()}>{IconClose()}</span>
          </div>
        </div>
        {settings}
        {shaders}
        {shaderButtons}
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
  handleCloseClick() {
    EventDispatcher.getInstance().dispatchEvent(
      "scene",
      "removeLayer",
      this.layer
    );
  }
  handleVisibleClick() {
    this.layer.visible = !this.layer.visible;
    DataStore.getInstance().touch("layers");
  }
  handleDuplicateClick() {
    EventDispatcher.getInstance().dispatchEvent(
      "scene",
      "duplicateLayer",
      this.layer
    );
  }
}

customElements.define("layer-component", LayerComponent);
