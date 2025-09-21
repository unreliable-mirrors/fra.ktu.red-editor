import jsx from "texsaur";
import { KTUComponent } from "../../core/ktu_component";
import DataStore from "../../core/data_store";
import { Modulator } from "../../../modulators/modulator";
import {
  EditorLayerSetting,
  IEditorLayer,
} from "../../../layers/ieditor_layer";
import { IModulable } from "../../../../engine/imodulable";

export class BindModulatorButton extends KTUComponent {
  setting: EditorLayerSetting;
  modulable: IModulable;

  constructor(modulable: IModulable, setting: EditorLayerSetting) {
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
      const modulator: Modulator = (
        DataStore.getInstance().getStore("modulators") as Modulator[]
      ).find((modulator) => modulator.state.modulatorId === parseInt(id))!;
      modulator.bind(this.modulable, this.setting);
    }
  }
}

customElements.define("bind-modulator-button", BindModulatorButton);
