import jsx from "texsaur";
import { KTUComponent } from "../core/ktu_component";
import {
  IconBackground,
  IconClose,
  IconDown,
  IconDraw,
  IconDuplicate,
  IconImage,
  IconLeft,
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
import EventDispatcher from "../core/event_dispatcher";
import DataStore from "../core/data_store";
import { ctrlKey, getShortcutText } from "../../helpers/keyboard_manager";

export class HintPanel extends KTUComponent {
  render(): Element {
    let content = <></>;
    console.log("BD", this.bindingData["hintsVisibility"]);
    if (
      !this.bindingData["activeLayer"] ||
      this.bindingData["showGeneralTips"]
    ) {
      content = (
        <>
          <div className="block">
            <h3>Layer Types</h3>
            <div className="tip">
              <div
                onclick={() =>
                  EventDispatcher.getInstance().dispatchEvent(
                    "scene",
                    "add_layer",
                    BackgroundLayer.LAYER_NAME
                  )
                }
              >
                {IconBackground()} Background (1)
              </div>
              <div
                onclick={() =>
                  EventDispatcher.getInstance().dispatchEvent(
                    "scene",
                    "add_layer",
                    DrawLayer.LAYER_NAME
                  )
                }
              >
                {IconImage()} Image/Video (3)
              </div>
            </div>
            <div className="tip">
              <div
                onclick={() =>
                  EventDispatcher.getInstance().dispatchEvent(
                    "scene",
                    "add_layer",
                    DrawLayer.LAYER_NAME
                  )
                }
              >
                {IconDraw()} Draw (2)
              </div>
              <div
                onclick={() =>
                  EventDispatcher.getInstance().dispatchEvent(
                    "scene",
                    "add_layer",
                    TextLayer.LAYER_NAME
                  )
                }
              >
                {IconText()} Text (4)
              </div>
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
              <div>{getShortcutText("toggleHints")}</div>
              <div>{getShortcutText("toggleUI")}</div>
              <div>{getShortcutText("PASTEIMAGE")}</div>
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
            <button
              className="iconButton"
              onclick={() =>
                DataStore.getInstance().setStore("showGeneralTips", true)
              }
            >
              {IconLeft()}
            </button>
          </div>
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
            <button
              className="iconButton"
              onclick={() =>
                DataStore.getInstance().setStore("showGeneralTips", true)
              }
            >
              {IconLeft()}
            </button>
          </div>
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
                <strong>{ctrlKey()} + CLICK</strong>: Drag/Pan Layer
              </div>
            </div>
          </div>
          <div className="block">
            <h3>Attributes</h3>
            <div className="tip">
              <div>
                <strong>Brush</strong>: Choose Different styles of drawing.
              </div>
              <div>
                <strong>Brush Size</strong>: How big of a blot you want.
              </div>
              <div>
                <strong>Grid Size</strong>: How spaced you want your blots.
              </div>
              <div>
                <strong>Color</strong>: Each layer is Single Color.
              </div>
            </div>
          </div>
          <div className="block">
            <h3>Tips</h3>
            <div className="tip">
              <div>Default Drawing Mode is weird on purpose.</div>
            </div>
            <div className="tip">
              <div>Use Grid Size to sort of "zoom".</div>
              <div>Increase Grid Size to draw details, decrease later.</div>
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
            <button
              className="iconButton"
              onclick={() =>
                DataStore.getInstance().setStore("showGeneralTips", true)
              }
            >
              {IconLeft()}
            </button>
          </div>
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
                <strong>{ctrlKey()} + CLICK</strong>: Drag/Pan Layer
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
            <button
              className="iconButton"
              onclick={() =>
                DataStore.getInstance().setStore("showGeneralTips", true)
              }
            >
              {IconLeft()}
            </button>
          </div>
          <div className="block">
            <h3>Text Layer</h3>
            <div className="tip">Put your heart into words.</div>
          </div>
          <div className="block">
            <h3>Shortcuts</h3>

            <div className="tip">
              <div>
                <strong>{ctrlKey()} + CLICK</strong>: Drag/Pan Layer
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
            <button
              className="iconButton"
              onclick={() =>
                DataStore.getInstance().setStore("showGeneralTips", true)
              }
            >
              {IconLeft()}
            </button>
          </div>
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
            <button
              className="iconButton"
              onclick={() =>
                DataStore.getInstance().setStore("showGeneralTips", true)
              }
            >
              {IconLeft()}
            </button>
          </div>
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
            <button
              className="iconButton"
              onclick={() =>
                DataStore.getInstance().setStore("showGeneralTips", true)
              }
            >
              {IconLeft()}
            </button>
          </div>
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
            <button
              className="iconButton"
              onclick={() =>
                DataStore.getInstance().setStore("showGeneralTips", true)
              }
            >
              {IconLeft()}
            </button>
          </div>
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
    if (this.bindingData["hintsVisibility"]) {
      return (
        <div className="bottom-ui">
          <div id="hintsPanel" className="panel bottom">
            <div className="hintPanel">
              <div className="helpFloat" onclick={() => this.helpClick()}>
                HIDE (H)
              </div>
              {content}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="panel helpTooltip" onclick={() => this.helpClick()}>
          HELP (H)
        </div>
      );
    }
  }

  helpClick() {
    EventDispatcher.getInstance().dispatchEvent("scene", "toggleHints", {});
  }

  defaultBinding() {
    return { showGeneralTips: false, hintsVisibility: false };
  }
}

customElements.define("hint-panel", HintPanel);
