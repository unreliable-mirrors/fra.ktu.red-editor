import { getSecureIndex } from "../../engine/helpers/secure_index_helper";

import { IModulator, ModulatorState } from "../../engine/imodulator";
import { IModulable } from "../../engine/imodulable";
import { LayerSetting } from "../../engine/ilayer";

export type ModulatorSetting = {
  field: "factor" | "offset";
  type: "integer" | "bigfloat";
  onchange: (value: string) => void;
};

export type SettingBinding = {
  uniqueId: number;
  setting: LayerSetting;
  modulable: IModulable;
};

export abstract class Modulator implements IModulator, IModulable {
  modulatorId: number;
  active: boolean;
  value: number;
  valueLog: number[];
  hook?: (value: number) => void;

  state: ModulatorState;
  abstract settings: LayerSetting[];
  bindedSettings: SettingBinding[] = [];

  public constructor(state?: ModulatorState) {
    this.modulatorId = getSecureIndex();
    this.active = false;
    this.value = 0;
    this.valueLog = [];

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

  bind(modulable: IModulable, setting: LayerSetting): void {
    setting.modulator_id = this.getUniqueId();
    setting.modulator_name = this.state.name;
    modulable.pushModulator(setting.field, this.modulatorId);
    this.bindedSettings.push({
      uniqueId: modulable.getUniqueId(),
      setting,
      modulable,
    });
    if (setting.type === "modulator") {
      setting.onchange(this.getUniqueId().toString());
    }
  }

  unbind(modulable: IModulable, setting: LayerSetting): void {
    setting.modulator_id = undefined;
    setting.modulator_name = undefined;
    modulable.pullModulator(setting.field, this.modulatorId);
    this.bindedSettings = this.bindedSettings.filter(
      (b) =>
        !(
          b.uniqueId === modulable.getUniqueId() &&
          b.setting.field === setting.field
        )
    );
  }

  unbindAll(): void {
    for (const setting of this.bindedSettings) {
      this.unbind(setting.modulable, setting.setting);
    }
    this.bindedSettings = [];
  }

  tick(elapsedTime: number): void {
    if (this.running) {
      this.value =
        this.computeValue(elapsedTime) * this.state.factor + this.state.offset;
      this.valueLog.push(this.value);
      if (this.valueLog.length > 100) {
        this.valueLog.shift();
      }
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

  pullModulator(field: string, modulatorId: number): void {
    this.state.modulators = this.state.modulators.filter(
      (m) => !(m.field === field && m.modulatorId === modulatorId)
    );
  }
}
