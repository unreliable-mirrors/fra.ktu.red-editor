import jsx from "texsaur";

import EventDispatcher from "../../core/event_dispatcher";
import { KTUComponent } from "../../core/ktu_component";
import { IconPause, IconPlay } from "../../../helpers/icons";

export class PlaybackControlsComponent extends KTUComponent {
  constructor() {
    super();
  }

  render(): Element {
    return (
      <div>
        <div class="controls">
          <button
            id="play-pause"
            class="play-pause-button"
            onclick={() => this.handleClick()}
          >
            {this.bindingData["playing"] ? IconPause() : IconPlay()}
          </button>
          <time-renderer binding="elapsedTime"></time-renderer>
        </div>
      </div>
    );
  }

  handleClick() {
    EventDispatcher.getInstance().dispatchEvent("scene", "togglePlayback", {});
  }
}

customElements.define("playback-controls", PlaybackControlsComponent);
