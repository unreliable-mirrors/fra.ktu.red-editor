import jsx from "texsaur";

import EventDispatcher from "../../core/event_dispatcher";
import { KTUComponent } from "../../core/ktu_component";
import { getText } from "../../../helpers/localization_helper";

export class ExportViewportButtonComponent extends KTUComponent {
  constructor() {
    super();
  }

  render(): Element {
    return (
      <div>
        <button onclick={() => this.handleClick()}>
          {getText("export_viewport")}
        </button>
      </div>
    );
  }

  handleClick() {
    EventDispatcher.getInstance().dispatchEvent("scene", "exportViewport", {});
  }
}

customElements.define("export-viewport-button", ExportViewportButtonComponent);
