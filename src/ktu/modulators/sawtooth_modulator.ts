import { Modulator, ModulatorSetting } from "./modulator";
import { ModulatorState } from "../../engine/imodulator";

export type SawtoothModulatorState = ModulatorState & {
  hz: number;
};
export type SawtoothModulatorSetting = {
  field: ModulatorSetting["field"] | "hz";
  type: ModulatorSetting["type"] | "bigfloat";
  onchange: (value: string) => void;
};

export class SawtoothModulator extends Modulator {
  static MODULATOR_NAME: string = "sawtooth_modulator";
  declare state: SawtoothModulatorState;
  settings: SawtoothModulatorSetting[] = [
    {
      field: "hz",
      type: "bigfloat",
      onchange: (value) => {
        this.state.hz = parseFloat(value);
      },
    },

    ...this.defaultSettings(),
  ];

  public constructor(state?: SawtoothModulatorState) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        hz: state.hz,
      };
    }
  }

  defaultState(): SawtoothModulatorState {
    return {
      ...super.defaultState(),
      hz: 1,
    };
  }

  computeValue(elapsedTime: number): number {
    return (elapsedTime % (1000 / this.state.hz)) / (1000 / this.state.hz);
  }

  modulatorName(): string {
    return SawtoothModulator.MODULATOR_NAME;
  }
}
