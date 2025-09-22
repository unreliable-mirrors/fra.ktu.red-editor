import jsx from "texsaur";
import { LineChart } from "chartist";
import EventDispatcher from "../../core/event_dispatcher";
import { KTUComponent } from "../../core/ktu_component";
import {
  IconClose,
  IconDuplicate,
  IconPause,
  IconPlay,
} from "../../../helpers/icons";
import { ContainerLayer } from "../../../layers/container_layer";
import { Modulator } from "../../../modulators/modulator";
import { BindModulatorButton } from "./bind_modulator_button";
import { ModulatorHint } from "./modulator_hint";

export class ModulatorComponent extends KTUComponent {
  modulator: Modulator;
  containerLayer?: ContainerLayer;
  valueRenderer?: Element;
  chart?: LineChart;
  constructor(modulator: Modulator) {
    super();
    this.modulator = modulator;
    this.modulator.hook = () => {
      if (this.valueRenderer) {
        this.valueRenderer.innerHTML = this.modulator.value.toFixed(2);
        this.chart?.update(
          { series: [this.modulator.valueLog] },
          {
            axisX: { showLabel: false, showGrid: false },
            axisY: {
              high: Math.ceil(Math.max(...this.modulator.valueLog)),
              low: Math.floor(Math.min(...this.modulator.valueLog)),
              showGrid: false,
            },
          }
        );
      }
    };
  }

  //TODO: DEDUPLICATE THIS CODE
  render(): Element {
    const active = this.modulator.active ? "active" : "";
    const settings: Element[] = [];
    if (this.modulator.active) {
      for (const setting of this.modulator.settings) {
        if (setting.type === "integer") {
          settings.push(
            <div>
              <span>{setting.field}: </span>
              {setting.modulator_id === undefined ? (
                <input
                  type="number"
                  spellcheck="false"
                  autocomplete="off"
                  aria-autocomplete="none"
                  value={
                    (this.modulator.state as { [key: string]: any })[
                      setting.field
                    ]
                  }
                  oninput={(e) => {
                    setting.onchange((e.target as HTMLInputElement).value);
                  }}
                ></input>
              ) : (
                new ModulatorHint(setting.modulator_id, setting.modulator_name!)
              )}
              {new BindModulatorButton(this.modulator, setting)}
            </div>
          );
        } else if (setting.type === "bigfloat") {
          settings.push(
            <div>
              <span>{setting.field}: </span>
              {setting.modulator_id === undefined ? (
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  spellcheck="false"
                  autocomplete="off"
                  aria-autocomplete="none"
                  value={
                    (this.modulator.state as { [key: string]: any })[
                      setting.field
                    ]
                  }
                  oninput={(e) => {
                    setting.onchange((e.target as HTMLInputElement).value);
                  }}
                ></input>
              ) : (
                new ModulatorHint(setting.modulator_id, setting.modulator_name!)
              )}
              {new BindModulatorButton(this.modulator, setting)}
            </div>
          );
        } else if (setting.type === "float") {
          settings.push(
            <div>
              <span>{setting.field}: </span>
              {setting.modulator_id === undefined ? (
                <input
                  type="number"
                  spellcheck="false"
                  autocomplete="off"
                  aria-autocomplete="none"
                  value={
                    (this.modulator.state as { [key: string]: any })[
                      setting.field
                    ]
                  }
                  oninput={(e) => {
                    setting.onchange((e.target as HTMLInputElement).value);
                  }}
                ></input>
              ) : (
                new ModulatorHint(setting.modulator_id, setting.modulator_name!)
              )}
              {new BindModulatorButton(this.modulator, setting)}
            </div>
          );
        } else if (setting.type === "modulator") {
          settings.push(
            <div>
              <span>{setting.field}: </span>
              {setting.modulator_id !== undefined
                ? new ModulatorHint(
                    setting.modulator_id,
                    setting.modulator_name!
                  )
                : "-"}
              {new BindModulatorButton(this.modulator, setting)}
            </div>
          );
        } else if (setting.type === "boolean") {
          settings.push(
            <div>
              <span>{setting.field}: </span>
              {setting.modulator_id === undefined ? (
                <input
                  type="checkbox"
                  value="true"
                  defaultChecked={
                    (this.modulator.state as { [key: string]: any })[
                      setting.field
                    ]
                  }
                  oninput={(e) => {
                    setting.onchange(
                      (e.target as HTMLInputElement).checked ? "true" : "false"
                    );
                  }}
                ></input>
              ) : (
                new ModulatorHint(setting.modulator_id, setting.modulator_name!)
              )}
              {new BindModulatorButton(this.modulator, setting)}
            </div>
          );
        } else if (setting.type === "text") {
          settings.push(
            <div>
              <span>{setting.field}: </span>

              <input
                type="text"
                value={
                  (this.modulator.state as { [key: string]: any })[
                    setting.field
                  ]
                }
                spellcheck="false"
                autocomplete="off"
                aria-autocomplete="none"
                oninput={(e) => {
                  setting.onchange((e.target as HTMLInputElement).value);
                }}
              ></input>
            </div>
          );
        }
      }
    }
    this.valueRenderer = <div>{this.modulator.value.toFixed(2)}</div>;

    return (
      <div className={`modulatorItem ${active}`}>
        <div className="header">
          <div
            className="title"
            onclick={() => {
              this.handleClick();
            }}
          >
            {this.modulator.state.name} - {this.modulator.state.modulatorId}
          </div>
          <span onclick={() => this.handleVisibleClick()}>
            {this.modulator.running ? IconPause() : IconPlay()}
          </span>
          <div className="icons">
            <span onclick={() => this.handleDuplicateClick()}>
              {IconDuplicate()}
            </span>
            <span onclick={() => this.handleCloseClick()}>{IconClose()}</span>
          </div>
        </div>
        {this.valueRenderer}
        <div id={`chart_${this.modulator.state.modulatorId}`}></div>
        {settings}
      </div>
    );
  }

  afterRender() {
    if (this.modulator.active) {
      this.chart = new LineChart(
        `#chart_${this.modulator.state.modulatorId}`,
        {
          series: [this.modulator.valueLog],
        },
        {
          axisX: { showLabel: false, showGrid: false },
          axisY: {
            high: Math.max(...this.modulator.valueLog),
            low: Math.min(...this.modulator.valueLog),
            showGrid: false,
          },
        }
      );
    }
  }

  handleVisibleClick() {
    this.modulator.running = !this.modulator.running;
  }
  handleClick() {
    if (!this.modulator.active) {
      EventDispatcher.getInstance().dispatchEvent(
        "scene",
        "activateModulator",
        this.modulator
      );
    }
  }
  handleDuplicateClick() {
    EventDispatcher.getInstance().dispatchEvent(
      "scene",
      "duplicateModulator",
      this.modulator
    );
  }
  handleCloseClick() {
    EventDispatcher.getInstance().dispatchEvent(
      "scene",
      "removeModulator",
      this.modulator
    );
  }
}

customElements.define("modulator-component", ModulatorComponent);
