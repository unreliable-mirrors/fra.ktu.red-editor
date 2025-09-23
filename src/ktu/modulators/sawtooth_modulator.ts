import { Modulator, ModulatorSetting } from "./modulator";
import { ModulatorState } from "../../engine/imodulator";
import { registerModulatorsFromState } from "../helpers/modulators";

export type SawtoothModulatorState = ModulatorState & {
  hz: number;
  phase: number;
};
export type SawtoothModulatorSetting = {
  field: ModulatorSetting["field"] | "hz" | "phase";
  type: ModulatorSetting["type"] | "bigfloat" | "float";
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
    {
      field: "phase",
      type: "float",
      onchange: (value) => {
        this.state.phase = parseFloat(value);
      },
    },

    ...this.defaultSettings(),
  ];

  public constructor(
    state?: SawtoothModulatorState,
    includeModulators: boolean = false
  ) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        hz: state.hz,
        phase: state.phase,
      };
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  defaultState(): SawtoothModulatorState {
    return {
      ...super.defaultState(),
      hz: 1,
      phase: 0,
    };
  }

  computeValue(elapsedTime: number): number {
    return (
      ((elapsedTime % (1000 / this.state.hz)) / (1000 / this.state.hz) +
        this.state.phase) %
      1
    );
  }

  modulatorName(): string {
    return SawtoothModulator.MODULATOR_NAME;
  }
}
