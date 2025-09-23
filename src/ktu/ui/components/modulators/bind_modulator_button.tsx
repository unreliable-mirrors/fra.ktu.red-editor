import jsx from "texsaur";
import { KTUComponent } from "../../core/ktu_component";
import DataStore from "../../core/data_store";
import { Modulator } from "../../../modulators/modulator";
import { IModulable } from "../../../../engine/imodulable";
import { LayerSetting } from "../../../../engine/ilayer";
import { getModulatorById } from "../../../helpers/modulators";

export class BindModulatorButton extends KTUComponent {
  setting: LayerSetting;
  modulable: IModulable;

  constructor(modulable: IModulable, setting: LayerSetting) {
    super();
    this.setting = setting;
    this.modulable = modulable;
  }

  render(): Element {
    return (
      <select
        onchange={(e) => {
          this.selectModulator(e);
        }}
      >
        <option value="">No Modulator</option>
        {(DataStore.getInstance().getStore("modulators") as Modulator[])?.map(
          (modulator: Modulator) => {
            return (
              <option
                value={modulator.state.modulatorId}
                selected={
                  modulator.bindedSettings.find(
                    (bs) =>
                      bs.uniqueId === this.modulable.getUniqueId() &&
                      bs.setting.field === this.setting.field
                  ) !== undefined
                }
              >
                {modulator.state.name} - {modulator.state.modulatorId}
              </option>
            );
          }
        )}
      </select>
    );
  }

  selectModulator(e: Event) {
    const id = (e.target as HTMLSelectElement).value;
    console.log(id);
    if (id !== "") {
      this.unbindSetting();
      const modulator: Modulator = getModulatorById(parseInt(id))!;
      modulator.bind(this.modulable, this.setting);
    } else {
      this.unbindSetting();
    }
    DataStore.getInstance().touch("modulators");
  }

  unbindSetting() {
    if (this.setting.modulator_id) {
      const modulator: Modulator = getModulatorById(this.setting.modulator_id)!;
      modulator.unbind(this.modulable, this.setting);
    }
  }
}

customElements.define("bind-modulator-button", BindModulatorButton);
