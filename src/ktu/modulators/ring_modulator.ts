import { Modulator, ModulatorSetting } from "./modulator";
import { ModulatorState } from "../../engine/imodulator";
import {
  getModulatorById,
  registerModulatorsFromState,
} from "../helpers/modulators";

export type RingModulatorState = ModulatorState & {
  modulatorAId: number;
  modulatorBId: number;
  abMix: number;
};
export type RingModulatorSetting = {
  field: ModulatorSetting["field"] | "modulatorA" | "modulatorB" | "abMix";
  type: ModulatorSetting["type"] | "modulator" | "float";
  onchange: (value: string) => void;
};

export class RingModulator extends Modulator {
  static MODULATOR_NAME: string = "ring_modulator";
  declare state: RingModulatorState;
  modulatorA?: Modulator;
  modulatorB?: Modulator;

  settings: RingModulatorSetting[] = [
    {
      field: "modulatorA",
      type: "modulator",
      onchange: (value) => {
        this.state.modulatorAId = parseInt(value);
        this.modulatorA = getModulatorById(this.state.modulatorAId)!;
      },
    },
    {
      field: "modulatorB",
      type: "modulator",
      onchange: (value) => {
        this.state.modulatorBId = parseInt(value);
        this.modulatorB = getModulatorById(this.state.modulatorBId)!;
      },
    },
    {
      field: "abMix",
      type: "float",
      onchange: (value) => {
        this.state.abMix = parseFloat(value);
      },
    },

    ...this.defaultSettings(),
  ];

  public constructor(
    state?: RingModulatorState,
    includeModulators: boolean = false
  ) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        modulatorAId: state.modulatorAId,
        modulatorBId: state.modulatorBId,
        abMix: state.abMix,
      };
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  defaultState(): RingModulatorState {
    return {
      ...super.defaultState(),
      modulatorAId: 0,
      modulatorBId: 0,
      abMix: 0.5,
    };
  }

  computeValue(_elapsedTime: number): number {
    return (
      (this.modulatorA?.value || 0) * (1 - this.state.abMix) +
      (this.modulatorB?.value || 0) * this.state.abMix
    );
  }

  modulatorName(): string {
    return RingModulator.MODULATOR_NAME;
  }
}
