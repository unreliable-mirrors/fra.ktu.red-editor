import { Ticker } from "pixi.js";

import { EditorLayerSetting, IEditorLayer } from "../layers/ieditor_layer";
import { getSecureIndex } from "../../engine/helpers/secure_index_helper";

import { IModulator, ModulatorState } from "../../engine/imodulator";
import { ShaderSetting } from "../shaders/shader_layer";

export type ModulatorSetting = {
  field: "factor" | "hz" | "offset";
  type: "integer" | "bigfloat";
  onchange: (value: string) => void;
};

export type SettingBinding = {
  layerId: number;
  setting: ShaderSetting | EditorLayerSetting;
};

export abstract class Modulator implements IModulator {
  modulatorId: number;
  active: boolean;
  value: number;
  elapsedTime: number;
  hook?: (value: number) => void;

  state!: ModulatorState;
  abstract settings: ModulatorSetting[];
  bindedSettings: SettingBinding[] = [];

  public constructor(state?: ModulatorState) {
    this.modulatorId = getSecureIndex();
    this.active = false;
    this.value = 0;
    this.elapsedTime = 0;

    if (state) {
      this.state = {
        name: state.name,
        modulatorId: this.modulatorId,
        running: state.running,
        hz: state.hz,
        factor: state.factor,
        offset: state.offset,
      };
    } else {
      this.state = this.defaultState();
    }
  }

  abstract modulatorName(): string;

  defaultState(): ModulatorState {
    return {
      name: this.modulatorName(),
      modulatorId: this.modulatorId,
      running: true,
      hz: 1,
      factor: 1,
      offset: 0,
    };
  }

  defaultSettings(): ModulatorSetting[] {
    return [
      {
        field: "hz",
        type: "bigfloat",
        onchange: (value) => {
          this.state.hz = parseFloat(value);
        },
      },
      {
        field: "factor",
        type: "bigfloat",
        onchange: (value) => {
          this.state.factor = parseFloat(value);
        },
      },
      {
        field: "offset",
        type: "bigfloat",
        onchange: (value) => {
          this.state.offset = parseFloat(value);
        },
      },
    ];
  }
  set running(value: boolean) {
    this.state.running = value;
  }
  get running(): boolean {
    return this.state.running;
  }

  bind(layer: IEditorLayer, setting: ShaderSetting | EditorLayerSetting): void {
    this.bindedSettings.push({ layerId: layer.state.layerId, setting });
    layer.state.modulators.push({
      field: setting.field,
      modulatorId: this.modulatorId,
    });
  }

  unbind(): void {
    //TODO: REMOVE PROPERLY
  }

  unbindAll(): void {
    this.bindedSettings = [];
  }

  tick(time: Ticker): void {
    this.elapsedTime += time.elapsedMS;
    if (this.running) {
      this.value =
        this.computeValue(time) * this.state.factor + this.state.offset;
      for (const setting of this.bindedSettings) {
        setting.setting.onchange(this.value.toString());
      }
      this.hook?.(this.value);
    }
  }

  abstract computeValue(time: Ticker): number;
}
