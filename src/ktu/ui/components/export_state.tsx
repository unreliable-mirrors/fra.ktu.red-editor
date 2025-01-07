import jsx from "texsaur";

import EventDispatcher from "../core/event_dispatcher";
import { KTUComponent } from "../core/ktu_component";

export class ExportStateButtonComponent extends KTUComponent {
  constructor() {
    super();
  }

  render(): Element {
    return (
      <div>
        <button onclick={this.handleClick}>Export State</button>
      </div>
    );
  }

  handleClick() {
    EventDispatcher.getInstance().dispatchEvent("scene", "exportState", {});
  }
}

customElements.define("export-state-button", ExportStateButtonComponent);
