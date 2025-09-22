import { Ticker } from "pixi.js";
import { Modulator, ModulatorSetting } from "./modulator";
import { ModulatorState } from "../../engine/imodulator";

export type SineModulatorState = ModulatorState & {
  hz: number;
};
export type SineModulatorSetting = {
  field: ModulatorSetting["field"] | "hz";
  type: ModulatorSetting["type"] | "bigfloat";
  onchange: (value: string) => void;
};

export class SineModulator extends Modulator {
  static MODULATOR_NAME: string = "sine_modulator";
  declare state: SineModulatorState;
  settings: SineModulatorSetting[] = [
    {
      field: "hz",
      type: "bigfloat",
      onchange: (value) => {
        this.state.hz = parseFloat(value);
      },
    },

    ...this.defaultSettings(),
  ];

  public constructor(state?: SineModulatorState) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        hz: state.hz,
      };
    }
  }

  defaultState(): SineModulatorState {
    return {
      ...super.defaultState(),
      hz: 1,
    };
  }

  computeValue(elapsedTime: number): number {
    return (
      Math.sin((elapsedTime / 1000) * Math.PI * 2 * this.state.hz) / 2 + 0.5
    );
  }

  modulatorName(): string {
    return SineModulator.MODULATOR_NAME;
  }
}
