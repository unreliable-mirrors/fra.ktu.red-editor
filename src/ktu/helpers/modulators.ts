import { SineModulator } from "../modulators/sine_modulator";
import { Modulator } from "../modulators/modulator";
import { ModulatorState } from "../../engine/imodulator";

export type ModulatorClass = {
  MODULATOR_NAME: string;
};
export const AVAILABLE_MODULATORS: ModulatorClass[] = [SineModulator];

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
  }
  return null;
};
