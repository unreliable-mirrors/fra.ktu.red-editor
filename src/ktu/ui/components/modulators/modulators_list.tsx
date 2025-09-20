import jsx from "texsaur";

import { KTUComponent } from "../../core/ktu_component";
import EventDispatcher from "../../core/event_dispatcher";
import { KeyboardManager } from "../../../helpers/keyboard_manager";
import { AVAILABLE_MODULATORS_NAMES } from "../../../helpers/modulators";
import { Modulator } from "../../../modulators/modulator";
import { ModulatorComponent } from "./modulator_component";
import { AddModulatorButtonComponent } from "./add_modulator_button";

export class ModulatorsList extends KTUComponent {
  render(): Element {
    const items: Element[] = [];
    const modulatorButtons: Element[] = [];
    for (const modulatorName of AVAILABLE_MODULATORS_NAMES) {
      modulatorButtons.push(new AddModulatorButtonComponent(modulatorName));
    }
    for (const modulator of [
      ...(this.bindingData["modulators"] as Modulator[]),
    ].reverse()) {
      items.push(new ModulatorComponent(modulator));
    }

    const content = this.bindingData["modulatorsVisibility"] ? (
      <>
        {modulatorButtons}
        <div className="modulatorsList">{items}</div>
      </>
    ) : (
      <></>
    );
    return (
      <div>
        <h3 onclick={() => this.click()}>{`Modulators ${
          KeyboardManager.keyboardExists() ? " (M)" : ""
        }`}</h3>
        {content}
      </div>
    );
  }

  defaultBinding() {
    return { modulators: [], modulatorsVisibility: true };
  }

  click() {
    EventDispatcher.getInstance().dispatchEvent(
      "scene",
      "toggleModulators",
      {}
    );
  }
}

customElements.define("modulators-list", ModulatorsList);
