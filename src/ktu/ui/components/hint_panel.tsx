import jsx from "texsaur";
import { KTUComponent } from "../core/ktu_component";
import {
  IconBackground,
  IconClose,
  IconDown,
  IconDraw,
  IconDuplicate,
  IconImage,
  IconText,
  IconUp,
} from "../../helpers/icons";
import { BackgroundLayer } from "../../layers/background_layer";
import { ContainerLayer } from "../../layers/container_layer";
import { DrawLayer } from "../../layers/draw_layer";
import { ImageLayer } from "../../layers/image_layer";
import { TextLayer } from "../../layers/text_layer";
import { ShaderLayer } from "../../shaders/shader_layer";
import { BnwShader } from "../../shaders/bnw/bnw_shader";
import { VintageShader } from "../../shaders/vintage/vintage_shader";
import { PixelateShader } from "../../shaders/pixelate/pixelate_shader";
import { MontecarloSampleShader } from "../../shaders/montecarlo_sample/montecarlo_sample";

export class HintPanel extends KTUComponent {
  render(): Element {
    let content = <></>;
    console.log("BD", this.bindingData["activeLayer"]);
    if (
      !this.bindingData["activeLayer"] ||
      this.bindingData["showGeneralTips"]
    ) {
      content = (
        <>
          <div className="block">
            <h3>Layer Types</h3>
            <div className="tip">
              <div>{IconBackground()} Background</div>
              <div>{IconImage()} Image/Video</div>
            </div>
            <div className="tip">
              <div>{IconDraw()} Draw</div>
              <div>{IconText()} Text</div>
            </div>
          </div>
          <div className="block">
            <h3>Layer Actions</h3>
            <div className="tip">
              <div>{IconUp()} Move Layer Up</div>
              <div>{IconDown()} Move Layer Down</div>
            </div>
            <div className="tip">
              <div>{IconDuplicate()} Duplicate Layer</div>
              <div>{IconClose()} Remove Layer</div>
            </div>
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
              <div>
                <strong>CTRL + V</strong>: Paste Image in a new Image Layer
              </div>
            </div>
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
            <h3>Attributes</h3>
            <div className="tip">
              <div>
                <strong>Color</strong>: Each layer is Single Color.
              </div>
              <div>
                <strong>Pixel Size</strong>: Resize keeping pixel-perfect style.
              </div>
            </div>
          </div>
          <div className="block">
            <h3>Tips</h3>
            <div className="tip">
              <div>Use Pixel Size to regulate your drawing "zoom".</div>
              <div>Increase Pixel Size to draw details, decrease later.</div>
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
    } else if (
      this.bindingData["activeLayer"] instanceof ShaderLayer &&
      this.bindingData["activeLayer"].shaderName() == VintageShader.SHADER_NAME
    ) {
      content = (
        <>
          <div className="block">
            <h3>Vintage Shader</h3>
            <div className="tip">
              Makes everything look a bit polaroid. A bit reddish.
            </div>
          </div>
          <div className="block">
            <h3>Attributes</h3>

            <div className="tip">
              <div>
                <strong>Strength</strong>: Regulates how much redish it is.
                Lower levels make it closer to the original.
              </div>
            </div>
          </div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ShaderLayer &&
      this.bindingData["activeLayer"].shaderName() == PixelateShader.SHADER_NAME
    ) {
      content = (
        <>
          <div className="block">
            <h3>Pixelate Shader</h3>
            <div className="tip">Turns everything into squares.</div>
          </div>
          <div className="block">
            <h3>Attributes</h3>

            <div className="tip">
              <div>
                <strong>Pixel Size</strong>: How big do you want your squares to
                be.
              </div>
            </div>
          </div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ShaderLayer &&
      this.bindingData["activeLayer"].shaderName() ==
        MontecarloSampleShader.SHADER_NAME
    ) {
      content = (
        <>
          <div className="block">
            <h3>Montecarlo Sampling Shader</h3>
            <div className="tip">Filters the image randomly.</div>
          </div>
          <div className="block">
            <h3>Attributes</h3>

            <div className="tip">
              <div>
                <strong>Strength</strong>: How much filtering do you want to
                happen. The lower, the more image is preserved.
              </div>
              <div>
                <strong>Refresh Chance</strong>: How often do you want it to
                refresh. 1 = Updates every frame. 0 = Never updates. (0-1) =
                Somewhere in the middle...
              </div>
            </div>
          </div>
        </>
      );
    }
    return <div className="hintPanel">{content}</div>;
  }

  defaultBinding() {
    return { showGeneralTips: false };
  }
}

customElements.define("hint-panel", HintPanel);
