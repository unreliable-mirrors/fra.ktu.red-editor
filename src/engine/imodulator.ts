import { LayerSetting } from "./ilayer";
import { IModulable } from "./imodulable";

export type ModulatorState = {
  name: string;
  modulatorId: number;
  running: boolean;
  factor: number;
  offset: number;
  modulators: { field: string; modulatorId: number }[];
};

export interface IModulator {
  modulatorId: number;
  active: boolean;
  state: ModulatorState;
  value: number;
  valueLog: number[];
  hook?: (value: number) => void;

  bind(modulable: IModulable, setting: LayerSetting): void;
  unbind(modulable: IModulable, setting: LayerSetting): void;
  unbindAll(): void;
  tick(elapsedTime: number): void;
}
