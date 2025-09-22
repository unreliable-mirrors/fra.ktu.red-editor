import { Modulator, ModulatorSetting } from "./modulator";
import { ModulatorState } from "../../engine/imodulator";
import Rand from "rand-seed";
import { registerModulatorsFromState } from "../helpers/modulators";

export type RandomModulatorState = ModulatorState & {
  hz: number;
  salt: string;
};
export type RandomModulatorSetting = {
  field: ModulatorSetting["field"] | "hz" | "salt";
  type: ModulatorSetting["type"] | "bigfloat" | "text";
  onchange: (value: string) => void;
};

export class RandomModulator extends Modulator {
  static MODULATOR_NAME: string = "random_modulator";
  declare state: RandomModulatorState;
  settings: RandomModulatorSetting[] = [
    {
      field: "hz",
      type: "bigfloat",
      onchange: (value) => {
        this.state.hz = parseFloat(value);
      },
    },
    {
      field: "salt",
      type: "text",
      onchange: (value) => {
        this.state.salt = value;
      },
    },
    ...this.defaultSettings(),
  ];

  public constructor(
    state?: RandomModulatorState,
    includeModulators: boolean = false
  ) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        hz: state.hz,
        salt: state.salt,
      };
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  defaultState(): RandomModulatorState {
    return {
      ...super.defaultState(),
      hz: 1,
      salt: Math.floor(Math.random() * 10000000) + "",
    };
  }

  computeValue(elapsedTime: number): number {
    const seed = Math.floor((elapsedTime / 1000) * this.state.hz);
    const rand = new Rand(seed.toString() + this.state.salt);
    return rand.next();
  }

  modulatorName(): string {
    return RandomModulator.MODULATOR_NAME;
  }
}
