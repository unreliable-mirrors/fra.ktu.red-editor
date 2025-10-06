import jsx from "texsaur";

import EventDispatcher from "../../core/event_dispatcher";
import { KTUComponent } from "../../core/ktu_component";
import { FileLoaderComponent } from "./file_loader";
import { ContainerLayer } from "../../../layers/container_layer";
import { ShaderComponent } from "./shader_component";
import DataStore from "../../core/data_store";
import { AddShaderButtonComponent } from "./add_shader_button";
import { AVAILABLE_SHADERS_NAMES } from "../../../helpers/shaders";
import {
  IconClose,
  IconDown,
  IconDuplicate,
  IconHidden,
  IconUp,
  IconVisible,
} from "../../../helpers/icons";
import { ImageLayer } from "../../../layers/image_layer";
import { BindModulatorButton } from "../modulators/bind_modulator_button";
import { ModulatorHint } from "../modulators/modulator_hint";
import { BindLayerButton } from "./bind_layer_button";
import { LayerHint } from "./layer_hint";
import { getLayerById } from "../../../helpers/layers";

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
        let input = <></>;
        if (setting.type === "color") {
          input = (
            <>
              <input
                type="color"
                value={
                  (this.layer.state as { [key: string]: any })[setting.field]
                }
                oninput={(e) => {
                  setting.onchange((e.target as HTMLInputElement).value);
                }}
              ></input>
            </>
          );
        } else if (setting.type === "integer") {
          input = (
            <>
              {" "}
              {setting.modulator_id === undefined ? (
                <input
                  type="number"
                  value={
                    (this.layer.state as { [key: string]: any })[setting.field]
                  }
                  spellcheck="false"
                  autocomplete="off"
                  aria-autocomplete="none"
                  oninput={(e) => {
                    setting.onchange((e.target as HTMLInputElement).value);
                  }}
                ></input>
              ) : (
                new ModulatorHint(setting.modulator_id, setting.modulator_name!)
              )}
              {new BindModulatorButton(this.layer, setting)}
            </>
          );
        } else if (setting.type === "float") {
          input = (
            <>
              {setting.modulator_id === undefined ? (
                <input
                  type="number"
                  value={
                    (this.layer.state as { [key: string]: any })[setting.field]
                  }
                  min="0"
                  max="1"
                  step="0.01"
                  spellcheck="false"
                  autocomplete="off"
                  aria-autocomplete="none"
                  oninput={(e) => {
                    setting.onchange((e.target as HTMLInputElement).value);
                  }}
                ></input>
              ) : (
                new ModulatorHint(setting.modulator_id, setting.modulator_name!)
              )}
              {new BindModulatorButton(this.layer, setting)}
            </>
          );
        } else if (setting.type === "text") {
          input = (
            <>
              <input
                type="text"
                value={
                  (this.layer.state as { [key: string]: any })[setting.field]
                }
                spellcheck="false"
                autocomplete="off"
                aria-autocomplete="none"
                oninput={(e) => {
                  setting.onchange((e.target as HTMLInputElement).value);
                }}
              ></input>
            </>
          );
        } else if (setting.type === "file") {
          input = (
            <>
              {
                new FileLoaderComponent({
                  onchange: setting.onchange,
                  layer: this.layer as ImageLayer,
                })
              }
            </>
          );
        } else if (setting.type === "options") {
          input = (
            <>
              {setting.values ? (
                setting.values.map((e) => (
                  <button
                    onclick={() => setting.onchange(e)}
                    className={
                      e ===
                      (this.layer.state as { [key: string]: any })[
                        setting.field
                      ].toString()
                        ? "selected"
                        : ""
                    }
                  >
                    {e}
                  </button>
                ))
              ) : (
                <></>
              )}
            </>
          );
        } else if (setting.type === "boolean") {
          input = (
            <>
              {" "}
              {setting.modulator_id === undefined ? (
                <input
                  type="checkbox"
                  value="true"
                  defaultChecked={
                    (this.layer.state as { [key: string]: any })[setting.field]
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
              {new BindModulatorButton(this.layer, setting)}
            </>
          );
        } else if (setting.type === "layer") {
          input = (
            <>
              {" "}
              {(this.layer.state as { [key: string]: any })[setting.field] >=
                0 &&
              getLayerById(
                (this.layer.state as { [key: string]: any })[setting.field]
              ) ? (
                new LayerHint(
                  (this.layer.state as { [key: string]: any })[
                    setting.field
                  ] as number,
                  getLayerById(
                    (this.layer.state as { [key: string]: any })[setting.field]
                  )!.layerName()
                )
              ) : (
                <></>
              )}
              {new BindLayerButton(this.layer, setting)}
            </>
          );
        } else if (setting.type === "bigfloat") {
          input = (
            <>
              {setting.modulator_id === undefined ? (
                <input
                  type="number"
                  value={
                    (this.layer.state as { [key: string]: any })[setting.field]
                  }
                  min="0"
                  step="0.01"
                  spellcheck="false"
                  autocomplete="off"
                  aria-autocomplete="none"
                  oninput={(e) => {
                    setting.onchange((e.target as HTMLInputElement).value);
                  }}
                ></input>
              ) : (
                new ModulatorHint(setting.modulator_id, setting.modulator_name!)
              )}
              {new BindModulatorButton(this.layer, setting)}
            </>
          );
        }
        settings.push(
          <div>
            <span>{setting.field}: </span>
            {input}
          </div>
        );
      }
    }
    let anyActive = false;
    for (const shader of this.layer.shaders) {
      anyActive = anyActive || shader.active;
    }
    if (this.layer.active || anyActive) {
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
            <span onclick={(e) => this.handleUpClick(e)}>
              {DataStore.getInstance().getStore("layers").indexOf(this.layer) +
                1 !=
              DataStore.getInstance().getStore("layers").length ? (
                IconUp()
              ) : (
                <></>
              )}
            </span>
            <span onclick={(e) => this.handleDownClick(e)}>
              {DataStore.getInstance().getStore("layers").indexOf(this.layer) !=
              0 ? (
                IconDown()
              ) : (
                <></>
              )}
            </span>
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
        {shaderButtons.length > 0 ? <h4>Shaders</h4> : <></>}
        {shaderButtons}
        {shaders}
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
  handleUpClick(e: MouseEvent) {
    if (e.shiftKey) {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "moveToTop",
        this.layer
      );
    } else {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "moveUp",
        this.layer
      );
    }
  }
  handleDownClick(e: MouseEvent) {
    if (e.shiftKey) {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "moveToBottom",
        this.layer
      );
    } else {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "moveDown",
        this.layer
      );
    }
  }
  handleDuplicateClick() {
    EventDispatcher.getInstance().dispatchEvent(
      "scene",
      "duplicate",
      this.layer
    );
  }
}

customElements.define("layer-component", LayerComponent);
