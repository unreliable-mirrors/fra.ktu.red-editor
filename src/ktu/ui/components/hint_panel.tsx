import jsx from "texsaur";
import { KTUComponent } from "../core/ktu_component";
import {
  IconBackground,
  IconDraw,
  IconImage,
  IconText,
} from "../../helpers/icons";
import { BackgroundLayer } from "../../layers/background_layer";
import { ContainerLayer } from "../../layers/container_layer";
import { DrawLayer } from "../../layers/draw_layer";

export class HintPanel extends KTUComponent {
  render(): Element {
    let content = <></>;
    console.log("BD", this.bindingData["activeLayer"]);
    if (!this.bindingData["activeLayer"]) {
      content = (
        <>
          <h3>Layer Types</h3>
          <div>{IconBackground()} Background</div>
          <div>{IconDraw()} Draw</div>
          <div>{IconImage()} Image/Video</div>
          <div>{IconText()} Text</div>
          <div className="spacer"></div>
          <h3>Shortcuts</h3>
          <div className="tip">
            <strong>CTRL + ALT + H</strong>: Hide Hints
          </div>
          <div className="tip">
            <strong>CTRL + ALT + J</strong>: Hide UI
          </div>
          <div className="spacer"></div>
          <h3>Tips</h3>
          <div className="tip">Shaders = Cool Effects.</div>
          <div className="tip">Layers First, Shaders Later.</div>
          <div className="tip">There is no Undo, this is by design.</div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ContainerLayer &&
      this.bindingData["activeLayer"].layerName() == BackgroundLayer.LAYER_NAME
    ) {
      content = (
        <>
          <h3>Background Layer</h3>
          <div>It's very, very big</div>
          <div className="spacer"></div>
          <div>Having several with alpha makes cool tints</div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ContainerLayer &&
      this.bindingData["activeLayer"].layerName() == DrawLayer.LAYER_NAME
    ) {
      content = (
        <>
          <h3>Draw Layer</h3>
          <div>Draw cool stuff on Pixel style.</div>
          <div className="spacer"></div>
          <h3>Shortcuts</h3>
          <div className="tip">
            <strong>LEFT CLICK</strong>: Draw in <strong>Toggle Mode</strong>
          </div>
          <div className="tip">
            <strong>RIGHT CLICK</strong>: Erase
          </div>
          <div className="tip">
            <strong>SHIFT + CLICK</strong>: Draw in <strong>Normal Mode</strong>
          </div>
          <div className="tip">
            <strong>CTRL + CLICK</strong>: Drag/Pan Layer
          </div>
          <div className="spacer"></div>
          <h3>Tips</h3>
          <div className="tip">
            <strong>Color</strong>: Each layer is Single Color. Have several
            colors, using several layers
          </div>
          <div className="tip">
            <strong>Pixel Size</strong>: Resize keeping pixel-perfect style
          </div>
        </>
      );
    }
    return (
      <div id="hintsPanel" className="hintPanel">
        {content}
      </div>
    );
  }

  defaultBinding() {
    return {};
  }
}

customElements.define("hint-panel", HintPanel);
