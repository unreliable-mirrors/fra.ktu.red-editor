import jsx from "texsaur";
import { KTUComponent } from "../core/ktu_component";
import {
  IconBackground,
  IconDraw,
  IconImage,
  IconText,
} from "../../helpers/icons";

export class HintPanel extends KTUComponent {
  render(): Element {
    return (
      <div id="hintsPanel" className="hintPanel">
        <h3>Layer Types</h3>
        <div>{IconBackground()} Background</div>
        <div>{IconDraw()} Draw</div>
        <div>{IconImage()} Image/Video</div>
        <div>{IconText()} Text</div>
        <div className="spacer"></div>
        <h3>Shortcuts</h3>
        <div>
          <strong>CTRL + ALT + H</strong>: Hide Hints
        </div>
        <div>
          <strong>CTRL + ALT + J</strong>: Hide UI
        </div>
        <div className="spacer"></div>
        <h3>Tips</h3>
        <div>Shaders = Cool Effects</div>
        <div>Layers First, Shaders Later</div>
      </div>
    );
  }
}

customElements.define("hint-panel", HintPanel);
