import jsx from "texsaur";

import EventDispatcher from "../../core/event_dispatcher";
import { KTUComponent } from "../../core/ktu_component";
import { getText } from "../../../helpers/localization_helper";

export class ExportCanvasButtonComponent extends KTUComponent {
  constructor() {
    super();
  }

  render(): Element {
    return (
      <div>
        <button onclick={() => this.handleClick()}>
          {getText("export_canvas")}
        </button>
      </div>
    );
  }

  handleClick() {
    EventDispatcher.getInstance().dispatchEvent("scene", "exportCanvas", {});
  }
}

customElements.define("export-canvas-button", ExportCanvasButtonComponent);
