import jsx from "texsaur";

import { KTUComponent } from "../../core/ktu_component";

export class TimeRendererComponent extends KTUComponent {
  constructor() {
    super();
  }

  render(): Element {
    return (
      <span class="time">
        {(this.bindingData["elapsedTime"] / 1000).toFixed(2)}s
      </span>
    );
  }
}

customElements.define("time-renderer", TimeRendererComponent);
