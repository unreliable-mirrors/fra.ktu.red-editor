import { EditorLayerSetting } from "../layers/ieditor_layer";
import { getSecureIndex } from "../../engine/helpers/secure_index_helper";

import { IModulator, ModulatorState } from "../../engine/imodulator";
import { ShaderSetting } from "../shaders/shader_layer";
import { IModulable } from "../../engine/imodulable";

export type ModulatorSetting = {
  field: "factor" | "offset";
  type: "integer" | "bigfloat";
  onchange: (value: string) => void;
};

export type SettingBinding = {
  uniqueId: number;
  setting: ShaderSetting | EditorLayerSetting;
};

export abstract class Modulator implements IModulator, IModulable {
  modulatorId: number;
  active: boolean;
  value: number;
  hook?: (value: number) => void;

  state: ModulatorState;
  abstract settings: EditorLayerSetting[];
  bindedSettings: SettingBinding[] = [];

  public constructor(state?: ModulatorState) {
    this.modulatorId = getSecureIndex();
    this.active = false;
    this.value = 0;

    if (state) {
      this.state = {
        name: state.name,
        modulatorId: this.modulatorId,
        running: state.running,
        factor: state.factor,
        offset: state.offset,
        modulators: [],
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
      factor: 1,
      offset: 0,
      modulators: [],
    };
  }

  defaultSettings(): ModulatorSetting[] {
    return [
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

  bind(modulable: IModulable, setting: EditorLayerSetting): void {
    setting.modulator_id = this.getUniqueId();
    setting.modulator_name = this.state.name;
    this.bindedSettings.push({ uniqueId: modulable.getUniqueId(), setting });
    modulable.pushModulator(setting.field, this.modulatorId);
    if (setting.type === "modulator") {
      setting.onchange(this.getUniqueId().toString());
    }
  }

  unbind(): void {
    //TODO: REMOVE PROPERLY
  }

  unbindAll(): void {
    this.bindedSettings = [];
  }

  tick(elapsedTime: number): void {
    if (this.running) {
      this.value =
        this.computeValue(elapsedTime) * this.state.factor + this.state.offset;
      for (const setting of this.bindedSettings) {
        if (setting.setting.type !== "modulator") {
          setting.setting.onchange(this.value.toString());
        }
      }
      this.hook?.(this.value);
    }
  }

  abstract computeValue(elapsedTime: number): number;

  getUniqueId(): number {
    return this.state.modulatorId;
  }

  pushModulator(field: string, modulatorId: number): void {
    this.state.modulators.push({ field: field, modulatorId: modulatorId });
  }
}
