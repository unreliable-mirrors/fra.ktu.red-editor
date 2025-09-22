import { ILayer, LayerSetting } from "../../engine/ilayer";
import { IModulable, ModulableState } from "../../engine/imodulable";

export type EditorLayerState = {
  name: string;
  layerId: number;
  visible: boolean;
  modulators: ModulableState[];
};

export interface IEditorLayer extends ILayer, IModulable {
  active: boolean;
  state: EditorLayerState;
  settings: LayerSetting[];
  absorbingLayer: boolean;
  pointerDown(event: PointerEvent): void;
  pointerUp(event: PointerEvent): void;
  pointerMove(event: PointerEvent): void;
}
