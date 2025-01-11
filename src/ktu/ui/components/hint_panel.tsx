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
import { ImageLayer } from "../../layers/image_layer";
import { TextLayer } from "../../layers/text_layer";
import { ShaderLayer } from "../../shaders/shader_layer";
import { BnwShader } from "../../shaders/bnw/bnw_shader";

export class HintPanel extends KTUComponent {
  render(): Element {
    let content = <></>;
    console.log("BD", this.bindingData["activeLayer"]);
    if (!this.bindingData["activeLayer"]) {
      content = (
        <>
          <div className="block">
            <h3>Layer Types</h3>
            <div className="tip">{IconBackground()} Background</div>
            <div className="tip">{IconDraw()} Draw</div>
            <div className="tip">{IconImage()} Image/Video</div>
            <div className="tip">{IconText()} Text</div>
          </div>
          <div className="block">
            <h3>Shortcuts</h3>
            <div className="tip">
              <div>
                <strong>CTRL + ALT + H</strong>: Hide Hints
              </div>
              <div>
                <strong>CTRL + ALT + J</strong>: Hide UI
              </div>
            </div>
            <div className="tip">
              <div>
                <strong>CTRL + V</strong>: Paste Image in a new Image Layer
              </div>
              <div>
                <strong>CTRL + V</strong>: Paste a Text in a new Text Layer
              </div>
            </div>
            <div className="tip"></div>
          </div>
          <div className="block">
            <h3>Tips</h3>
            <div className="tip">Shaders = Cool Effects.</div>
            <div className="tip">Layers First, Shaders Later.</div>
            <div className="tip">There is no Undo, this is by design.</div>
          </div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ContainerLayer &&
      this.bindingData["activeLayer"].layerName() == BackgroundLayer.LAYER_NAME
    ) {
      content = (
        <>
          <div className="block">
            <h3>Background Layer</h3>
            <div className="tip">It's very, very big</div>
            <div className="tip">
              Having several with alpha makes cool tints
            </div>
          </div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ContainerLayer &&
      this.bindingData["activeLayer"].layerName() == DrawLayer.LAYER_NAME
    ) {
      content = (
        <>
          <div className="block">
            <h3>Draw Layer</h3>
            <div className="tip">Draw cool stuff on Pixel style.</div>
          </div>
          <div className="block">
            <h3>Shortcuts</h3>
            <div className="tip">
              <div>
                <strong>LEFT CLICK</strong>: Draw in{" "}
                <strong>Toggle Mode</strong>
              </div>
              <div>
                <strong>RIGHT CLICK</strong>: Erase
              </div>
            </div>
            <div className="tip">
              <div>
                <strong>SHIFT + CLICK</strong>: Draw in{" "}
                <strong>Normal Mode</strong>
              </div>
              <div>
                <strong>CTRL + CLICK</strong>: Drag/Pan Layer
              </div>
            </div>
          </div>
          <div className="block">
            <h3>Tips</h3>
            <div className="tip">
              <strong>Color</strong>: Each layer is Single Color.
            </div>
            <div className="tip">
              <strong>Pixel Size</strong>: Resize keeping pixel-perfect style
            </div>
          </div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ContainerLayer &&
      this.bindingData["activeLayer"].layerName() == ImageLayer.LAYER_NAME
    ) {
      content = (
        <>
          <div className="block">
            <h3>Image Layer</h3>
            <div className="tip">
              Load cool Images and Videos into your thing!
            </div>
          </div>
          <div className="block">
            <h3>Shortcuts</h3>

            <div className="tip">
              <div>
                <strong>CTRL + CLICK</strong>: Drag/Pan Layer
              </div>
            </div>
          </div>
          <div className="block">
            <h3>Tips</h3>
            <div className="tip">
              All Images, Gifs and Videos are supported.
            </div>
            <div className="tip">Max Size 100mb per file.</div>
            <div className="tip">
              Copies of the same file, will be time synced.
            </div>
            <div className="tip">URLs without CORS will fail.</div>
          </div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ContainerLayer &&
      this.bindingData["activeLayer"].layerName() == TextLayer.LAYER_NAME
    ) {
      content = (
        <>
          <div className="block">
            <h3>Text Layer</h3>
            <div className="tip">Put your heart into words.</div>
          </div>
          <div className="block">
            <h3>Shortcuts</h3>

            <div className="tip">
              <div>
                <strong>CTRL + CLICK</strong>: Drag/Pan Layer
              </div>
            </div>
          </div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ShaderLayer &&
      this.bindingData["activeLayer"].shaderName() == BnwShader.SHADER_NAME
    ) {
      content = (
        <>
          <div className="block">
            <h3>Black & White Shader</h3>
            <div className="tip">See things how your grandparents did</div>
          </div>
          <div className="block">
            <h3>Attributes</h3>

            <div className="tip">
              <div>
                <strong>Strength</strong>: Regulates how much gray it is. Lower
                levels allow some color to pass.
              </div>
            </div>
          </div>
        </>
      );
    }
    return <div className="hintPanel">{content}</div>;
  }

  defaultBinding() {
    return {};
  }
}

customElements.define("hint-panel", HintPanel);
