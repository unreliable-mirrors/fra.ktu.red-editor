import { Modulator, ModulatorSetting } from "./modulator";
import { ModulatorState } from "../../engine/imodulator";
import { registerModulatorsFromState } from "../helpers/modulators";

export type SquareModulatorState = ModulatorState & {
  hz: number;
  phase: number;
};
export type SquareModulatorSetting = {
  field: ModulatorSetting["field"] | "hz" | "phase";
  type: ModulatorSetting["type"] | "bigfloat" | "float";
  onchange: (value: string) => void;
};

export class SquareModulator extends Modulator {
  static MODULATOR_NAME: string = "square_modulator";
  declare state: SquareModulatorState;
  settings: SquareModulatorSetting[] = [
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
    state?: SquareModulatorState,
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

  defaultState(): SquareModulatorState {
    return {
      ...super.defaultState(),
      hz: 1,
      phase: 0,
    };
  }

  computeValue(elapsedTime: number): number {
    return Math.round(
      Math.sin(
        ((elapsedTime % (1000 / this.state.hz)) / (1000 / this.state.hz) +
          this.state.phase) *
          Math.PI *
          2
      ) /
        2 +
        0.5
    );
  }

  modulatorName(): string {
    return SquareModulator.MODULATOR_NAME;
  }
}
