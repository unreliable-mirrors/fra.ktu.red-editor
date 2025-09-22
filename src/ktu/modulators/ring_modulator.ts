import { Ticker } from "pixi.js";
import { Modulator, ModulatorSetting } from "./modulator";
import { ModulatorState } from "../../engine/imodulator";
import DataStore from "../ui/core/data_store";

export type RingModulatorState = ModulatorState & {
  modulatorAId: number;
  modulatorBId: number;
};
export type RingModulatorSetting = {
  field: ModulatorSetting["field"] | "modulatorA" | "modulatorB";
  type: ModulatorSetting["type"] | "modulator";
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
        this.modulatorA = DataStore.getInstance()
          .getStore("modulators")
          .find((m: Modulator) => m.getUniqueId() === this.state.modulatorAId);
      },
    },
    {
      field: "modulatorB",
      type: "modulator",
      onchange: (value) => {
        this.state.modulatorBId = parseInt(value);
        this.modulatorB = DataStore.getInstance()
          .getStore("modulators")
          .find((m: Modulator) => m.getUniqueId() === this.state.modulatorBId);
      },
    },

    ...this.defaultSettings(),
  ];

  public constructor(state?: RingModulatorState) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        modulatorAId: state.modulatorAId,
        modulatorBId: state.modulatorBId,
      };
    }
  }

  defaultState(): RingModulatorState {
    return {
      ...super.defaultState(),
      modulatorAId: 0,
      modulatorBId: 0,
    };
  }

  computeValue(_elapsedTime: number): number {
    return (this.modulatorA?.value || 0) * (this.modulatorB?.value || 0);
  }

  modulatorName(): string {
    return RingModulator.MODULATOR_NAME;
  }
}
