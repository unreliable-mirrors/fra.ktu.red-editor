import {
  SineModulator,
  SineModulatorState,
} from "../modulators/sine_modulator";
import { Modulator } from "../modulators/modulator";
import { ModulatorState } from "../../engine/imodulator";
import {
  SquareModulator,
  SquareModulatorState,
} from "../modulators/square_modulator";
import {
  RingModulator,
  RingModulatorState,
} from "../modulators/ring_modulator";
import {
  SawtoothModulator,
  SawtoothModulatorState,
} from "../modulators/sawtooth_modulator";
import {
  ZeroOneGateModulator,
  ZeroOneGateModulatorState,
} from "../modulators/zero_one_gate_modulator";
import {
  RandomModulator,
  RandomModulatorState,
} from "../modulators/random_modulator";
import {
  RescaleModulator,
  RescaleModulatorState,
} from "../modulators/rescale_modulator";

export type ModulatorClass = {
  MODULATOR_NAME: string;
};
export const AVAILABLE_MODULATORS: ModulatorClass[] = [
  SineModulator,
  SquareModulator,
  SawtoothModulator,
  RingModulator,
  ZeroOneGateModulator,
  RandomModulator,
  RescaleModulator,
];

export const AVAILABLE_MODULATORS_MAP: Record<string, ModulatorClass> =
  Object.fromEntries(
    AVAILABLE_MODULATORS.map((cls: ModulatorClass) => [cls.MODULATOR_NAME, cls])
  );

export const AVAILABLE_MODULATORS_NAMES: string[] = AVAILABLE_MODULATORS.map(
  (e) => e.MODULATOR_NAME
);

export const getModulatorByName = (
  modulatorName: string,
  state?: ModulatorState
): Modulator | null => {
  if (modulatorName === SineModulator.MODULATOR_NAME) {
    return new SineModulator(state as SineModulatorState);
  } else if (modulatorName === SquareModulator.MODULATOR_NAME) {
    return new SquareModulator(state as SquareModulatorState);
  } else if (modulatorName === RingModulator.MODULATOR_NAME) {
    return new RingModulator(state as RingModulatorState);
  } else if (modulatorName === SawtoothModulator.MODULATOR_NAME) {
    return new SawtoothModulator(state as SawtoothModulatorState);
  } else if (modulatorName === ZeroOneGateModulator.MODULATOR_NAME) {
    return new ZeroOneGateModulator(state as ZeroOneGateModulatorState);
  } else if (modulatorName === RandomModulator.MODULATOR_NAME) {
    return new RandomModulator(state as RandomModulatorState);
  } else if (modulatorName === RescaleModulator.MODULATOR_NAME) {
    return new RescaleModulator(state as RescaleModulatorState);
  }
  return null;
};
