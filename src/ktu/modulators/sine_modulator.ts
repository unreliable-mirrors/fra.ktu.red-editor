import { Ticker } from "pixi.js";
import { Modulator, ModulatorSetting } from "./modulator";

export class SineModulator extends Modulator {
  static MODULATOR_NAME: string = "sine_modulator";
  settings: ModulatorSetting[] = this.defaultSettings();

  //@ts-ignore
  computeValue(time: Ticker): number {
    return Math.sin(this.elapsedTime / 1000) / 2 + 0.5;
  }

  modulatorName(): string {
    return SineModulator.MODULATOR_NAME;
  }
}
