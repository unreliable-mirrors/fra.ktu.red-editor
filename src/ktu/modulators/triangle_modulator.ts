import { Modulator, ModulatorSetting } from "./modulator";
import { ModulatorState } from "../../engine/imodulator";
import { registerModulatorsFromState } from "../helpers/modulators";

export type TriangleModulatorState = ModulatorState & {
  hz: number;
  phase: number;
};
export type TriangleModulatorSetting = {
  field: ModulatorSetting["field"] | "hz" | "phase";
  type: ModulatorSetting["type"] | "bigfloat" | "float";
  onchange: (value: string) => void;
};

export class TriangleModulator extends Modulator {
  static MODULATOR_NAME: string = "triangle_modulator";
  declare state: TriangleModulatorState;
  settings: TriangleModulatorSetting[] = [
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
    state?: TriangleModulatorState,
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

  defaultState(): TriangleModulatorState {
    return {
      ...super.defaultState(),
      hz: 1,
      phase: 0,
    };
  }

  computeValue(elapsedTime: number): number {
    const beatDuration = 1000 / this.state.hz;
    const position =
      ((elapsedTime % beatDuration) / beatDuration + this.state.phase) % 1;
    if (position < 0.5) {
      return position * 2;
    } else {
      return (1 - position) * 2;
    }
  }

  modulatorName(): string {
    return TriangleModulator.MODULATOR_NAME;
  }
}
