import jsx from "texsaur";

import EventDispatcher from "../../core/event_dispatcher";
import { KTUComponent } from "../../core/ktu_component";
import { ContainerLayer } from "../../../layers/container_layer";
import { getText } from "../../../helpers/localization_helper";

export class AddModulatorButtonComponent extends KTUComponent {
  containerLayer?: ContainerLayer;
  modulatorName: string;

  constructor(modulatorName: string) {
    super();
    this.modulatorName = modulatorName;
  }

  render(): Element {
    return (
      <button onclick={() => this.handleClick()}>
        {getText(`add_${this.modulatorName}_button`)}
      </button>
    );
  }

  handleClick() {
    EventDispatcher.getInstance().dispatchEvent(
      "scene",
      `add_modulator`,
      this.modulatorName
    );
  }
}

customElements.define("add-modulator-button", AddModulatorButtonComponent);
