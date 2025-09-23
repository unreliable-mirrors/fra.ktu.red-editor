import { Modulator, ModulatorSetting } from "./modulator";
import { ModulatorState } from "../../engine/imodulator";
import DataStore from "../ui/core/data_store";
import {
  getModulatorById,
  registerModulatorsFromState,
} from "../helpers/modulators";

export type ZeroOneGateModulatorState = ModulatorState & {
  modulator: number;
  cutoff: number;
  highCompress: boolean;
  highValue: number;
  lowCompress: boolean;
  lowValue: number;
  dryWet: number;
};
export type ZeroOneGateModulatorSetting = {
  field:
    | ModulatorSetting["field"]
    | "modulator"
    | "cutoff"
    | "highCompress"
    | "highValue"
    | "lowCompress"
    | "lowValue"
    | "dryWet";
  type:
    | ModulatorSetting["type"]
    | "modulator"
    | "bigfloat"
    | "boolean"
    | "float";
  onchange: (value: string) => void;
};

export class ZeroOneGateModulator extends Modulator {
  static MODULATOR_NAME: string = "zero_one_gate_modulator";
  declare state: ZeroOneGateModulatorState;
  modulator?: Modulator;

  settings: ZeroOneGateModulatorSetting[] = [
    {
      field: "modulator",
      type: "modulator",
      onchange: (value) => {
        this.state.modulator = parseInt(value);
        this.modulator = getModulatorById(this.state.modulator)!;
      },
    },
    {
      field: "cutoff",
      type: "bigfloat",
      onchange: (value) => {
        this.state.cutoff = parseFloat(value);
      },
    },
    {
      field: "highCompress",
      type: "boolean",
      onchange: (value) => {
        this.state.highCompress = "true" === value || parseFloat(value) >= 1;
      },
    },
    {
      field: "highValue",
      type: "bigfloat",
      onchange: (value) => {
        this.state.highValue = parseFloat(value);
      },
    },
    {
      field: "lowCompress",
      type: "boolean",
      onchange: (value) => {
        this.state.lowCompress = "true" === value || parseFloat(value) >= 1;
      },
    },
    {
      field: "lowValue",
      type: "bigfloat",
      onchange: (value) => {
        this.state.lowValue = parseFloat(value);
      },
    },
    {
      field: "dryWet",
      type: "float",
      onchange: (value) => {
        this.state.dryWet = parseFloat(value);
      },
    },
    ...this.defaultSettings(),
  ];

  public constructor(
    state?: ZeroOneGateModulatorState,
    includeModulators: boolean = false
  ) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        modulator: state.modulator,
        cutoff: state.cutoff,
        highCompress: state.highCompress,
        highValue: state.highValue,
        lowCompress: state.lowCompress,
        lowValue: state.lowValue,
        dryWet: state.dryWet,
      };
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  defaultState(): ZeroOneGateModulatorState {
    return {
      ...super.defaultState(),
      modulator: 0,
      cutoff: 0.5,
      highCompress: true,
      highValue: 1,
      lowCompress: true,
      lowValue: 0,
      dryWet: 1,
    };
  }

  computeValue(_elapsedTime: number): number {
    let originalValue = this.modulator?.value || 0;
    let outValue = this.modulator?.value || 0;
    if (outValue >= this.state.cutoff) {
      if (this.state.highCompress) {
        outValue = this.state.highValue;
      }
    } else {
      if (this.state.lowCompress) {
        outValue = this.state.lowValue;
      }
    }
    return (
      this.state.dryWet * outValue + (1 - this.state.dryWet) * originalValue
    );
  }

  modulatorName(): string {
    return ZeroOneGateModulator.MODULATOR_NAME;
  }
}
