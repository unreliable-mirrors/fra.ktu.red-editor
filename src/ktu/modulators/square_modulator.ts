import { Ticker } from "pixi.js";
import { Modulator, ModulatorSetting } from "./modulator";

export class SquareModulator extends Modulator {
  static MODULATOR_NAME: string = "square_modulator";
  settings: ModulatorSetting[] = this.defaultSettings();

  //@ts-ignore
  computeValue(time: Ticker): number {
    return Math.round(
      Math.sin((this.elapsedTime / 1000) * Math.PI * 2 * this.state.hz) / 2 +
        0.5
    );
  }

  modulatorName(): string {
    return SquareModulator.MODULATOR_NAME;
  }
}
