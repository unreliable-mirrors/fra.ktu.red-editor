import jsx from "texsaur";
import { KTUComponent } from "../../core/ktu_component";
import { Modulator } from "../../../modulators/modulator";
import EventDispatcher from "../../core/event_dispatcher";
import DataStore from "../../core/data_store";
import { getModulatorById } from "../../../helpers/modulators";

export class ModulatorHint extends KTUComponent {
  modulatorId: number;
  modulatorName: string;

  constructor(modulatorId: number, modulatorName: string) {
    super();
    this.modulatorId = modulatorId;
    this.modulatorName = modulatorName;
  }

  render(): Element {
    return (
      <button
        onclick={() => {
          this.handleClick();
        }}
      >
        {this.modulatorName} - {this.modulatorId}
      </button>
    );
  }

  handleClick() {
    const modulator = getModulatorById(this.modulatorId)!;
    if (!modulator.active) {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "activateModulator",
        modulator
      );
    }
  }
}

customElements.define("modulator-hint", ModulatorHint);
