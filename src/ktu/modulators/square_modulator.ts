import { Ticker } from "pixi.js";
import { Modulator, ModulatorSetting } from "./modulator";
import { ModulatorState } from "../../engine/imodulator";

export type SquareModulatorState = ModulatorState & {
  hz: number;
};
export type SquareModulatorSetting = {
  field: ModulatorSetting["field"] | "hz";
  type: ModulatorSetting["type"] | "bigfloat";
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

    ...this.defaultSettings(),
  ];

  public constructor(state?: SquareModulatorState) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        hz: state.hz,
      };
    }
  }

  defaultState(): SquareModulatorState {
    return {
      ...super.defaultState(),
      hz: 1,
    };
  }

  computeValue(elapsedTime: number): number {
    return Math.round(
      Math.sin((elapsedTime / 1000) * Math.PI * 2 * this.state.hz) / 2 + 0.5
    );
  }

  modulatorName(): string {
    return SquareModulator.MODULATOR_NAME;
  }
}
