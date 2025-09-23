import { Modulator, ModulatorSetting } from "./modulator";
import { ModulatorState } from "../../engine/imodulator";
import { registerModulatorsFromState } from "../helpers/modulators";
import DataStore from "../ui/core/data_store";

export type FourBarModulatorState = ModulatorState & {
  hz: number;
  beat1: number;
  beat2: number;
  beat3: number;
  beat4: number;
  beat5: number;
  beat6: number;
  beat7: number;
  beat8: number;
  beat9: number;
  beat10: number;
  beat11: number;
  beat12: number;
  beat13: number;
  beat14: number;
  beat15: number;
  beat16: number;
};
export type FourBarModulatorSetting = {
  field:
    | ModulatorSetting["field"]
    | "hz"
    | "beat1"
    | "beat2"
    | "beat3"
    | "beat4"
    | "beat5"
    | "beat6"
    | "beat7"
    | "beat8"
    | "beat9"
    | "beat10"
    | "beat11"
    | "beat12"
    | "beat13"
    | "beat14"
    | "beat15"
    | "beat16";
  type: ModulatorSetting["type"] | "bigfloat" | "options";
  onchange: (value: string) => void;
  values?: string[];
};

export class FourBarModulator extends Modulator {
  static MODULATOR_NAME: string = "four_bar_modulator";
  declare state: FourBarModulatorState;
  settings: FourBarModulatorSetting[] = [
    {
      field: "hz",
      type: "bigfloat",
      onchange: (value) => {
        this.state.hz = parseFloat(value);
      },
    },
    {
      field: "beat1",
      type: "options",
      values: ["0", "0.25", "0.5", "0.75", "1"],
      onchange: (value) => {
        this.state.beat1 = parseFloat(value);
        DataStore.getInstance().touch("modulators");
      },
    },
    {
      field: "beat2",
      type: "options",
      values: ["0", "0.25", "0.5", "0.75", "1"],
      onchange: (value) => {
        this.state.beat2 = parseFloat(value);
        DataStore.getInstance().touch("modulators");
      },
    },
    {
      field: "beat3",
      type: "options",
      values: ["0", "0.25", "0.5", "0.75", "1"],
      onchange: (value) => {
        this.state.beat3 = parseFloat(value);
        DataStore.getInstance().touch("modulators");
      },
    },
    {
      field: "beat4",
      type: "options",
      values: ["0", "0.25", "0.5", "0.75", "1"],
      onchange: (value) => {
        this.state.beat4 = parseFloat(value);
        DataStore.getInstance().touch("modulators");
      },
    },
    {
      field: "beat5",
      type: "options",
      values: ["0", "0.25", "0.5", "0.75", "1"],
      onchange: (value) => {
        this.state.beat5 = parseFloat(value);
        DataStore.getInstance().touch("modulators");
      },
    },
    {
      field: "beat6",
      type: "options",
      values: ["0", "0.25", "0.5", "0.75", "1"],
      onchange: (value) => {
        this.state.beat6 = parseFloat(value);
        DataStore.getInstance().touch("modulators");
      },
    },
    {
      field: "beat7",
      type: "options",
      values: ["0", "0.25", "0.5", "0.75", "1"],
      onchange: (value) => {
        this.state.beat7 = parseFloat(value);
        DataStore.getInstance().touch("modulators");
      },
    },
    {
      field: "beat8",
      type: "options",
      values: ["0", "0.25", "0.5", "0.75", "1"],
      onchange: (value) => {
        this.state.beat8 = parseFloat(value);
        DataStore.getInstance().touch("modulators");
      },
    },
    {
      field: "beat9",
      type: "options",
      values: ["0", "0.25", "0.5", "0.75", "1"],
      onchange: (value) => {
        this.state.beat9 = parseFloat(value);
        DataStore.getInstance().touch("modulators");
      },
    },
    {
      field: "beat10",
      type: "options",
      values: ["0", "0.25", "0.5", "0.75", "1"],
      onchange: (value) => {
        this.state.beat10 = parseFloat(value);
        DataStore.getInstance().touch("modulators");
      },
    },
    {
      field: "beat11",
      type: "options",
      values: ["0", "0.25", "0.5", "0.75", "1"],
      onchange: (value) => {
        this.state.beat11 = parseFloat(value);
        DataStore.getInstance().touch("modulators");
      },
    },
    {
      field: "beat12",
      type: "options",
      values: ["0", "0.25", "0.5", "0.75", "1"],
      onchange: (value) => {
        this.state.beat12 = parseFloat(value);
        DataStore.getInstance().touch("modulators");
      },
    },
    {
      field: "beat13",
      type: "options",
      values: ["0", "0.25", "0.5", "0.75", "1"],
      onchange: (value) => {
        this.state.beat13 = parseFloat(value);
        DataStore.getInstance().touch("modulators");
      },
    },
    {
      field: "beat14",
      type: "options",
      values: ["0", "0.25", "0.5", "0.75", "1"],
      onchange: (value) => {
        this.state.beat14 = parseFloat(value);
        DataStore.getInstance().touch("modulators");
      },
    },
    {
      field: "beat15",
      type: "options",
      values: ["0", "0.25", "0.5", "0.75", "1"],
      onchange: (value) => {
        this.state.beat15 = parseFloat(value);
        DataStore.getInstance().touch("modulators");
      },
    },
    {
      field: "beat16",
      type: "options",
      values: ["0", "0.25", "0.5", "0.75", "1"],
      onchange: (value) => {
        this.state.beat16 = parseFloat(value);
        DataStore.getInstance().touch("modulators");
      },
    },
    ...this.defaultSettings(),
  ];

  public constructor(
    state?: FourBarModulatorState,
    includeModulators: boolean = false
  ) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        hz: state.hz,
        beat1: state.beat1,
        beat2: state.beat2,
        beat3: state.beat3,
        beat4: state.beat4,
        beat5: state.beat5,
        beat6: state.beat6,
        beat7: state.beat7,
        beat8: state.beat8,
        beat9: state.beat9,
        beat10: state.beat10,
        beat11: state.beat11,
        beat12: state.beat12,
        beat13: state.beat13,
        beat14: state.beat14,
        beat15: state.beat15,
        beat16: state.beat16,
      };
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }
  }

  defaultState(): FourBarModulatorState {
    return {
      ...super.defaultState(),
      hz: 1,
      beat1: 0,
      beat2: 0,
      beat3: 0,
      beat4: 0,
      beat5: 0,
      beat6: 0,
      beat7: 0,
      beat8: 0,
      beat9: 0,
      beat10: 0,
      beat11: 0,
      beat12: 0,
      beat13: 0,
      beat14: 0,
      beat15: 0,
      beat16: 0,
    };
  }

  computeValue(elapsedTime: number): number {
    const beats = [
      this.state.beat1,
      this.state.beat2,
      this.state.beat3,
      this.state.beat4,
      this.state.beat5,
      this.state.beat6,
      this.state.beat7,
      this.state.beat8,
      this.state.beat9,
      this.state.beat10,
      this.state.beat11,
      this.state.beat12,
      this.state.beat13,
      this.state.beat14,
      this.state.beat15,
      this.state.beat16,
    ];
    const beatDuration = 1000 / this.state.hz;
    const currentBeat = Math.floor(
      (elapsedTime % (beatDuration * beats.length)) / beatDuration
    );
    return beats[currentBeat];
  }

  modulatorName(): string {
    return FourBarModulator.MODULATOR_NAME;
  }
}
