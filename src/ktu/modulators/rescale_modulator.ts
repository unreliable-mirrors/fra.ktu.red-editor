import { Modulator, ModulatorSetting } from "./modulator";
import { ModulatorState } from "../../engine/imodulator";
import DataStore from "../ui/core/data_store";

export type RescaleModulatorState = ModulatorState & {
  modulator: number;
  flip: boolean;
};
export type RescaleModulatorSetting = {
  field: ModulatorSetting["field"] | "modulator" | "flip";
  type: ModulatorSetting["type"] | "modulator" | "boolean";
  onchange: (value: string) => void;
};

export class RescaleModulator extends Modulator {
  static MODULATOR_NAME: string = "rescale_modulator";
  declare state: RescaleModulatorState;
  modulator?: Modulator;

  settings: RescaleModulatorSetting[] = [
    {
      field: "modulator",
      type: "modulator",
      onchange: (value) => {
        this.state.modulator = parseInt(value);
        this.modulator = DataStore.getInstance()
          .getStore("modulators")
          .find((m: Modulator) => m.getUniqueId() === this.state.modulator);
      },
    },
    {
      field: "flip",
      type: "boolean",
      onchange: (value) => {
        this.state.flip = "true" === value;
      },
    },
    ...this.defaultSettings(),
  ];

  public constructor(state?: RescaleModulatorState) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        modulator: state.modulator,
        flip: state.flip,
      };
    }
  }

  defaultState(): RescaleModulatorState {
    return {
      ...super.defaultState(),
      modulator: 0,
      flip: false,
    };
  }

  computeValue(_elapsedTime: number): number {
    let originalValue = this.modulator?.value || 0;
    let outValue = originalValue;
    if (this.state.flip) {
      outValue = 1 - originalValue;
    }
    return outValue;
  }

  modulatorName(): string {
    return RescaleModulator.MODULATOR_NAME;
  }
}
