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

export class HintPanel extends KTUComponent {
  render(): Element {
    let content = <></>;
    console.log("BD", this.bindingData);
    if (!this.bindingData) {
      content = (
        <>
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
        </>
      );
    } else if (
      this.bindingData instanceof ContainerLayer &&
      this.bindingData.layerName() == BackgroundLayer.LAYER_NAME
    ) {
      content = (
        <>
          <h3>Background Layer</h3>
          <div>It's very, very big</div>
          <div className="spacer"></div>
          <div>Having several with alpha makes cool tints</div>
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
    return null;
  }
}

customElements.define("hint-panel", HintPanel);
