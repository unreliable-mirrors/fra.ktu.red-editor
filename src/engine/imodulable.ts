import { LayerSetting } from "./ilayer";

export interface ModulableState {
  field: string;
  modulatorId: number;
}

export interface IModulable {
  settings: LayerSetting[];
  getUniqueId(): number;
  pushModulator(field: string, modulatorId: number): void;
  pullModulator(field: string, modulatorId: number): void;
}
