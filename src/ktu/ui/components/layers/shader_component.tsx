import jsx from "texsaur";

import EventDispatcher from "../../core/event_dispatcher";
import { KTUComponent } from "../../core/ktu_component";
import { ShaderLayer } from "../../../shaders/shader_layer";
import { IconClose, IconDown, IconUp } from "../../../helpers/icons";
import { ContainerLayer } from "../../../layers/container_layer";
import DataStore from "../../core/data_store";

export class ShaderComponent extends KTUComponent {
  shader: ShaderLayer;
  containerLayer?: ContainerLayer;
  constructor(shader: ShaderLayer, containerLayer?: ContainerLayer) {
    super();
    this.shader = shader;
    this.containerLayer = containerLayer;
  }

  //TODO: DEDUPLICATE THIS CODE
  render(): Element {
    const active = this.shader.active ? "active" : "";
    const settings: Element[] = [];
    if (this.shader.active) {
      for (const setting of this.shader.settings) {
        if (setting.type === "color") {
          settings.push(
            <div>
              <span>{setting.field}: </span>
              <input
                type="color"
                value={this.shader.state[setting.field]}
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
                value={this.shader.state[setting.field]}
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
                value={this.shader.state[setting.field]}
                min="0"
                max="1"
                step="0.01"
                oninput={(e) => {
                  setting.onchange((e.target as HTMLInputElement).value);
                }}
              ></input>
            </div>
          );
        }
      }
    }
    return (
      <div className={`shaderItem ${active}`}>
        <div className="header">
          <div
            className="title"
            onclick={() => {
              this.handleClick();
            }}
          >
            {this.shader.state.name} - {this.shader.state.layerId}
          </div>
          <div className="icons">
            <span onclick={() => this.handleUpClick()}>
              {(this.containerLayer &&
                this.containerLayer?.shaders.indexOf(this.shader) + 1 !=
                  this.containerLayer?.shaders.length) ||
              (!this.containerLayer &&
                DataStore.getInstance()
                  .getStore("shaders")
                  .indexOf(this.shader) +
                  1 !=
                  DataStore.getInstance().getStore("shaders").length) ? (
                IconUp()
              ) : (
                <></>
              )}
            </span>
            <span onclick={() => this.handleDownClick()}>
              {(this.containerLayer &&
                this.containerLayer?.shaders.indexOf(this.shader) != 0) ||
              (!this.containerLayer &&
                DataStore.getInstance()
                  .getStore("shaders")
                  .indexOf(this.shader) != 0) ? (
                IconDown()
              ) : (
                <></>
              )}
            </span>
            <span onclick={() => this.handleCloseClick()}>{IconClose()}</span>
          </div>
        </div>
        {settings}
      </div>
    );
  }

  handleClick() {
    if (!this.shader.active) {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "activateLayer",
        this.shader
      );
    }
  }
  handleUpClick() {
    if (this.containerLayer) {
      this.containerLayer.moveUpShader(this.shader);
    } else {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "moveUpShader",
        this.shader
      );
    }
  }
  handleDownClick() {
    if (this.containerLayer) {
      this.containerLayer.moveDownShader(this.shader);
    } else {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "moveDownShader",
        this.shader
      );
    }
  }

  handleCloseClick() {
    if (this.containerLayer) {
      this.containerLayer.removeShader(this.shader);
    } else {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "removeShader",
        this.shader
      );
    }
  }
}

customElements.define("shader-component", ShaderComponent);
