import jsx from "texsaur";

import EventDispatcher from "../../core/event_dispatcher";
import { KTUComponent } from "../../core/ktu_component";
import { ShaderLayer } from "../../../shaders/shader_layer";
import {
  IconClose,
  IconDown,
  IconDuplicate,
  IconUp,
} from "../../../helpers/icons";
import { ContainerLayer } from "../../../layers/container_layer";
import DataStore from "../../core/data_store";
import { BindModulatorButton } from "../modulators/bind_modulator_button";
import { ModulatorHint } from "../modulators/modulator_hint";

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
                spellcheck="false"
                autocomplete="off"
                aria-autocomplete="none"
                value={
                  (this.shader.state as { [key: string]: any })[setting.field]
                }
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
              {setting.modulator_id === undefined ? (
                <input
                  type="number"
                  spellcheck="false"
                  autocomplete="off"
                  aria-autocomplete="none"
                  value={
                    (this.shader.state as { [key: string]: any })[setting.field]
                  }
                  oninput={(e) => {
                    setting.onchange((e.target as HTMLInputElement).value);
                  }}
                ></input>
              ) : (
                new ModulatorHint(setting.modulator_id, setting.modulator_name!)
              )}
              {new BindModulatorButton(this.shader, setting)}
            </div>
          );
        } else if (setting.type === "float") {
          settings.push(
            <div>
              <span>{setting.field}: </span>
              {setting.modulator_id === undefined ? (
                <input
                  type="number"
                  spellcheck="false"
                  autocomplete="off"
                  aria-autocomplete="none"
                  value={
                    (this.shader.state as { [key: string]: any })[setting.field]
                  }
                  min="0"
                  max="1"
                  step="0.01"
                  oninput={(e) => {
                    setting.onchange((e.target as HTMLInputElement).value);
                  }}
                ></input>
              ) : (
                new ModulatorHint(setting.modulator_id, setting.modulator_name!)
              )}
              {new BindModulatorButton(this.shader, setting)}
            </div>
          );
        } else if (setting.type === "boolean") {
          settings.push(
            <div>
              <span>{setting.field}: </span>
              {setting.modulator_id === undefined ? (
                <input
                  type="checkbox"
                  value="true"
                  defaultChecked={
                    (this.shader.state as { [key: string]: any })[setting.field]
                  }
                  oninput={(e) => {
                    setting.onchange(
                      (e.target as HTMLInputElement).checked ? "true" : "false"
                    );
                  }}
                ></input>
              ) : (
                new ModulatorHint(setting.modulator_id, setting.modulator_name!)
              )}
              {new BindModulatorButton(this.shader, setting)}
            </div>
          );
        } else if (setting.type === "floatRange") {
          settings.push(
            <div>
              <span>{setting.field}: </span>
              {setting.modulator_id === undefined ? (
                <input
                  type="range"
                  value={
                    (this.shader.state as { [key: string]: any })[setting.field]
                  }
                  min="0"
                  max="1"
                  step="0.01"
                  oninput={(e) => {
                    setting.onchange((e.target as HTMLInputElement).value);
                  }}
                ></input>
              ) : (
                new ModulatorHint(setting.modulator_id, setting.modulator_name!)
              )}
              {new BindModulatorButton(this.shader, setting)}
            </div>
          );
        } else if (setting.type === "modulator_only") {
          settings.push(
            <div>
              <span>{setting.field}: </span>
              {setting.modulator_id !== undefined
                ? new ModulatorHint(
                    setting.modulator_id,
                    setting.modulator_name!
                  )
                : "-"}
              {new BindModulatorButton(this.shader, setting)}
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
            <span onclick={(e: MouseEvent) => this.handleUpClick(e)}>
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
            <span onclick={(e: MouseEvent) => this.handleDownClick(e)}>
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
            <span onclick={() => this.handleDuplicateClick()}>
              {IconDuplicate()}
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
  handleUpClick(e: MouseEvent) {
    if (e.shiftKey) {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "moveToTop",
        this.shader
      );
    } else {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "moveUp",
        this.shader
      );
    }
  }
  handleDownClick(e: MouseEvent) {
    if (e.shiftKey) {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "moveToBottom",
        this.shader
      );
    } else {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "moveDown",
        this.shader
      );
    }
  }
  handleDuplicateClick() {
    EventDispatcher.getInstance().dispatchEvent(
      "scene",
      "duplicate",
      this.shader
    );
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
