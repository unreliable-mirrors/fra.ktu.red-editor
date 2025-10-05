import jsx from "texsaur";
import { KTUComponent } from "../../core/ktu_component";
import DataStore from "../../core/data_store";
import { LayerSetting } from "../../../../engine/ilayer";
import { IEditorLayer } from "../../../layers/ieditor_layer";

export class BindLayerButton extends KTUComponent {
  setting: LayerSetting;
  layer: IEditorLayer;

  constructor(layer: IEditorLayer, setting: LayerSetting) {
    super();
    this.setting = setting;
    this.layer = layer;
  }

  render(): Element {
    return (
      <select
        onchange={(e) => {
          this.selectLayer(e);
        }}
      >
        <option value="">No Layer</option>
        {(DataStore.getInstance().getStore("layers") as IEditorLayer[])?.map(
          (layer: IEditorLayer) => {
            return (
              <option
                value={layer.state.layerId}
                selected={
                  layer.state.layerId ===
                  (this.layer.state as { [key: string]: any })[
                    this.setting.field
                  ]
                }
              >
                {layer.state.name} - {layer.state.layerId}
              </option>
            );
          }
        )}
      </select>
    );
  }
  selectLayer(e: Event) {
    this.setting.onchange((e.currentTarget as HTMLSelectElement).value);
    DataStore.getInstance().touch("layers");
  }
}

customElements.define("bind-layer-button", BindLayerButton);
