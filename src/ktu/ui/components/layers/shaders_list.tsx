import jsx from "texsaur";

import { KTUComponent } from "../../core/ktu_component";
import { ShaderComponent } from "./shader_component";
import { ShaderLayer } from "../../../shaders/shader_layer";
import { AVAILABLE_SHADERS_NAMES } from "../../../helpers/shaders";
import { AddShaderButtonComponent } from "./add_shader_button";
import EventDispatcher from "../../core/event_dispatcher";
import { KeyboardManager } from "../../../helpers/keyboard_manager";

export class ShadersList extends KTUComponent {
  render(): Element {
    const items: Element[] = [];
    const shaderButtons: Element[] = [];
    for (const shaderName of AVAILABLE_SHADERS_NAMES) {
      shaderButtons.push(new AddShaderButtonComponent(shaderName));
    }
    for (const layer of [
      ...(this.bindingData["shaders"] as ShaderLayer[]),
    ].reverse()) {
      items.push(new ShaderComponent(layer));
    }

    const content = this.bindingData["shadersVisibility"] ? (
      <>
        {shaderButtons}
        <div className="shadersList">{items}</div>
      </>
    ) : (
      <></>
    );
    return (
      <div>
        <h3 onclick={() => this.click()}>{`Global Shaders ${
          KeyboardManager.keyboardExists() ? " (S)" : ""
        }`}</h3>
        {content}
      </div>
    );
  }

  defaultBinding() {
    return { shaders: [], shadersVisibility: true };
  }

  click() {
    EventDispatcher.getInstance().dispatchEvent("scene", "toggleShaders", {});
  }
}

customElements.define("shaders-list", ShadersList);
