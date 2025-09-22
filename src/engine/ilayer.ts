import { Container, Ticker } from "pixi.js";

export type LayerSetting = {
  field: string;
  type: string;
  values?: string[];
  onchange: (value: string) => void;
  modulator_id?: number;
  modulator_name?: string;
};

export interface ILayer {
  layerId: number;

  set visible(value: boolean);
  get visible(): boolean;

  bind(container: Container, layer?: ILayer): void;
  unbind(): void;
  tick(time: Ticker): void;
}
