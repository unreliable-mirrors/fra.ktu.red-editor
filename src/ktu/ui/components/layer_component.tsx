import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";
import { FileLoaderComponent } from "./file_loader";
import { ContainerLayer } from "../../layers/container_layer";
import { ShaderComponent } from "./shader_component";
import { CreateBnwShaderButtonComponent } from "./add_bnw_shader";
import { CreateVintageShaderButtonComponent } from "./add_vintage_shader";
import { CreatePixelateShaderButtonComponent } from "./add_pixelate_shader";

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
      shaderButtons.push(new CreateBnwShaderButtonComponent(this.layer));
      shaderButtons.push(new CreateVintageShaderButtonComponent(this.layer));
      shaderButtons.push(new CreatePixelateShaderButtonComponent(this.layer));
    }
    for (const shader of [...this.layer.shaders].reverse()) {
      shaders.push(new ShaderComponent(shader));
    }
    return (
      <div className={`layerItem ${active}`}>
        <div
          onclick={() => {
            this.handleClick();
          }}
        >
          {this.layer.state.name} - {this.layer.state.layerId}
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
}

customElements.define("layer-component", LayerComponent);
