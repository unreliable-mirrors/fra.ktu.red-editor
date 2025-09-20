import jsx from "texsaur";
import { KTUComponent } from "../../core/ktu_component";
import DataStore from "../../core/data_store";
import { Modulator } from "../../../modulators/modulator";
import { ShaderSetting } from "../../../shaders/shader_layer";
import {
  EditorLayerSetting,
  IEditorLayer,
} from "../../../layers/ieditor_layer";

export class BindModulatorButton extends KTUComponent {
  setting: ShaderSetting | EditorLayerSetting;
  layer: IEditorLayer;

  constructor(
    layer: IEditorLayer,
    setting: ShaderSetting | EditorLayerSetting
  ) {
    super();
    this.setting = setting;
    this.layer = layer;
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
                      bs.layerId === this.layer.layerId &&
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
      modulator.bind(this.layer, this.setting);
    }
  }
}

customElements.define("bind-modulator-button", BindModulatorButton);
