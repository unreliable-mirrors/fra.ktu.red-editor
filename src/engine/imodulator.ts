import { EditorLayerSetting } from "../ktu/layers/ieditor_layer";
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
  hook?: (value: number) => void;

  bind(modulable: IModulable, setting: EditorLayerSetting): void;
  unbind(setting: EditorLayerSetting): void;
  unbindAll(): void;
  tick(elapsedTime: number): void;
}
