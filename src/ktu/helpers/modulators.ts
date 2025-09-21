import { SineModulator } from "../modulators/sine_modulator";
import { Modulator } from "../modulators/modulator";
import { ModulatorState } from "../../engine/imodulator";
import { SquareModulator } from "../modulators/square_modulator";

export type ModulatorClass = {
  MODULATOR_NAME: string;
};
export const AVAILABLE_MODULATORS: ModulatorClass[] = [
  SineModulator,
  SquareModulator,
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
    return new SineModulator(state as ModulatorState);
  } else if (modulatorName === SquareModulator.MODULATOR_NAME) {
    return new SquareModulator(state as ModulatorState);
  }
  return null;
};
