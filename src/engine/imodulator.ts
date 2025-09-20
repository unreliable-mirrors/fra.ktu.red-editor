import { Ticker } from "pixi.js";
import { ShaderSetting } from "../ktu/shaders/shader_layer";
import { EditorLayerSetting, IEditorLayer } from "../ktu/layers/ieditor_layer";

export type ModulatorState = {
  name: string;
  modulatorId: number;
  running: boolean;
  hz: number;
  factor: number;
  offset: number;
};

export interface IModulator {
  modulatorId: number;
  active: boolean;
  state: ModulatorState;
  value: number;
  elapsedTime: number;
  hook?: (value: number) => void;

  bind(layer: IEditorLayer, setting: ShaderSetting | EditorLayerSetting): void;
  unbind(setting: ShaderSetting | EditorLayerSetting): void;
  unbindAll(): void;
  tick(time: Ticker): void;
}
