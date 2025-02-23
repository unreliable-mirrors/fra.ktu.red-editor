import jsx from "texsaur";
import { KTUComponent } from "../core/ktu_component";
import {
  IconBackground,
  IconClose,
  IconDown,
  IconDraw,
  IconDuplicate,
  IconImage,
  IconShape,
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
import { ctrlKey, KeyboardManager } from "../../helpers/keyboard_manager";
import { ShapeLayer } from "../../layers/shape_layer";
import { AnaglyphShader } from "../../shaders/anaglyph/anaglyph_shader";
import { PosterizeShader } from "../../shaders/posterize/posterize_shader";
import { VLinesShader } from "../../shaders/vines/vines_shader";
import { HLinesShader } from "../../shaders/hines/hines_shader";
import { ChromaShader } from "../../shaders/chroma/chroma_shader";
import { ScrambleShader } from "../../shaders/scramble/scramble_shader";
import { NegativeShader } from "../../shaders/negative/negative_shader";
import { CrossesShader } from "../../shaders/crosses/crosses_shader";

export class HintPanel extends KTUComponent {
  render(): Element {
    const content = (
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
              {IconBackground()}{" "}
              {`Background ${KeyboardManager.keyboardExists() ? "(1)" : ""}`}
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
              {IconImage()}{" "}
              {`Image/Video ${KeyboardManager.keyboardExists() ? "(3)" : ""}`}
            </div>
            <div
              onclick={() =>
                EventDispatcher.getInstance().dispatchEvent(
                  "scene",
                  "add_layer",
                  ShapeLayer.LAYER_NAME
                )
              }
            >
              {IconShape()}{" "}
              {`Shape ${KeyboardManager.keyboardExists() ? "(5)" : ""}`}
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
              {IconDraw()}{" "}
              {`Draw ${KeyboardManager.keyboardExists() ? "(2)" : ""}`}
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
              {IconText()}{" "}
              {`Text ${KeyboardManager.keyboardExists() ? " (4)" : ""}`}
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
        {KeyboardManager.keyboardExists() ? (
          <div className="block">
            <h3>Shortcuts</h3>
            <div className="tip">
              <div>{KeyboardManager.getShortcutText("toggleHints")}</div>
              <div>{KeyboardManager.getShortcutText("toggleUI")}</div>
              <div>{KeyboardManager.getShortcutText("PASTEIMAGE")}</div>
              <div>{KeyboardManager.getShortcutText("DRAGLAYER")}</div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="block">
          <h3>Tips</h3>
          <div className="tip">Shaders = Cool Effects.</div>
          <div className="tip">Layers First, Shaders Later.</div>
          <div className="tip">There is no Undo, this is by design.</div>
        </div>
      </>
    );

    let extraContent = <></>;
    if (
      !this.bindingData["activeLayer"] ||
      this.bindingData["showGeneralTips"]
    ) {
    } else if (
      this.bindingData["activeLayer"] instanceof ContainerLayer &&
      this.bindingData["activeLayer"].layerName() == BackgroundLayer.LAYER_NAME
    ) {
      extraContent = (
        <>
          <div className="block extraLast">
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
      extraContent = (
        <>
          <div className="block">
            <h3>Draw Layer</h3>
            <div className="tip">Draw cool stuff on Pixel style.</div>
          </div>
          {KeyboardManager.keyboardExists() ? (
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
          ) : (
            <></>
          )}
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
          <div className="block extraLast">
            <h3>Tips</h3>
            <div className="tip">
              <div>
                Default Drawing Mode is weird on purpose. Use Normal Mode to
                draw like a normal person.
              </div>
            </div>
          </div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ContainerLayer &&
      this.bindingData["activeLayer"].layerName() == ImageLayer.LAYER_NAME
    ) {
      extraContent = (
        <>
          <div className="block">
            <h3>Image Layer</h3>
            <div className="tip">
              Load cool Images and Videos into your thing!
            </div>
          </div>
          <div className="block extraLast">
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
      extraContent = (
        <>
          <div className="block extraLast">
            <h3>Text Layer</h3>
            <div className="tip">Put your heart into words.</div>
          </div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ContainerLayer &&
      this.bindingData["activeLayer"].layerName() == ShapeLayer.LAYER_NAME
    ) {
      extraContent = (
        <>
          <div className="block extraLast">
            <h3>Shape Layer</h3>
            <div className="tip">Three shapes is enough, right?.</div>
          </div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ShaderLayer &&
      this.bindingData["activeLayer"].shaderName() == BnwShader.SHADER_NAME
    ) {
      extraContent = (
        <>
          <div className="block">
            <h3>Black & White Shader</h3>
            <div className="tip">See things how your grandparents did</div>
          </div>
          <div className="block extraLast">
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
      extraContent = (
        <>
          <div className="block">
            <h3>Vintage Shader</h3>
            <div className="tip">
              Makes everything look a bit polaroid. A bit reddish.
            </div>
          </div>
          <div className="block extraLast">
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
      extraContent = (
        <>
          <div className="block">
            <h3>Pixelate Shader</h3>
            <div className="tip">Turns everything into squares.</div>
          </div>
          <div className="block extraLast">
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
      extraContent = (
        <>
          <div className="block">
            <h3>Montecarlo Sampling Shader</h3>
            <div className="tip">Filters the image randomly.</div>
          </div>
          <div className="block extraLast">
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
    } else if (
      this.bindingData["activeLayer"] instanceof ShaderLayer &&
      this.bindingData["activeLayer"].shaderName() == AnaglyphShader.SHADER_NAME
    ) {
      extraContent = (
        <>
          <div className="block">
            <h3>Anaglyph Shader</h3>
            <div className="tip">
              Separates Blue and Red channels to the sides. Like the 3D movies!
            </div>
          </div>
          <div className="block extraLast">
            <h3>Attributes</h3>

            <div className="tip">
              <div>
                <strong>Strength</strong>: How much far from the center you want
                it. Technically it should be measured in pixels, but my math was
                not good enough.
              </div>
            </div>
          </div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ShaderLayer &&
      this.bindingData["activeLayer"].shaderName() ==
        PosterizeShader.SHADER_NAME
    ) {
      extraContent = (
        <>
          <div className="block">
            <h3>Posterize Shader</h3>
            <div className="tip">
              Makes Dark Tones VERY DARK and Light Tones VERY BRIGHT.
            </div>
          </div>
          <div className="block extraLast">
            <h3>Attributes</h3>

            <div className="tip">
              <div>
                <strong>Threshold</strong>: Move the cutting point, the higher
                the Threshold, the darker the image.
              </div>
            </div>
          </div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ShaderLayer &&
      this.bindingData["activeLayer"].shaderName() == VLinesShader.SHADER_NAME
    ) {
      extraContent = (
        <>
          <div className="block">
            <h3>vLines Shader</h3>
            <div className="tip">
              Allows only a bunch of vertical lines to pass through.
            </div>
          </div>
          <div className="block extraLast">
            <h3>Attributes</h3>

            <div className="tip">
              <div>
                <strong>Size</strong>: Distance between the lines.
              </div>
              <div>
                <strong>Line Thickness</strong>: How thick the lines are.
              </div>
            </div>
          </div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ShaderLayer &&
      this.bindingData["activeLayer"].shaderName() == HLinesShader.SHADER_NAME
    ) {
      extraContent = (
        <>
          <div className="block">
            <h3>hLines Shader</h3>
            <div className="tip">
              Allows only a bunch of horizontal lines to pass through.
            </div>
          </div>
          <div className="block extraLast">
            <h3>Attributes</h3>

            <div className="tip">
              <div>
                <strong>Size</strong>: Distance between the lines.
              </div>
              <div>
                <strong>Line Thickness</strong>: How thick the lines are.
              </div>
            </div>
          </div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ShaderLayer &&
      this.bindingData["activeLayer"].shaderName() == ChromaShader.SHADER_NAME
    ) {
      extraContent = (
        <>
          <div className="block">
            <h3>Chroma Shader</h3>
            <div className="tip">
              Makes the selected color from the layer transparent. Like the
              Green Screen in the movies!
            </div>
          </div>
          <div className="block extraLast">
            <h3>Attributes</h3>

            <div className="tip">
              <div>
                <strong>Color</strong>: Color to remove from the layer.
              </div>
              <div>
                <strong>Threshold</strong>: Tolerance % in color variations. 0 =
                remove ONLY that color. 1 = remove everything. (0-1) = Somewhere
                in the middle...
              </div>
            </div>
          </div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ShaderLayer &&
      this.bindingData["activeLayer"].shaderName() == ScrambleShader.SHADER_NAME
    ) {
      extraContent = (
        <>
          <div className="block">
            <h3>Scramble Shader</h3>
            <div className="tip">
              Picks Pixels nearby instead of the right one. It kind of
              disintegrates stuff.
            </div>
          </div>
          <div className="block extraLast">
            <h3>Attributes</h3>

            <div className="tip">
              <div>
                <strong>Range</strong>: How far will it go fetch.
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
    } else if (
      this.bindingData["activeLayer"] instanceof ShaderLayer &&
      this.bindingData["activeLayer"].shaderName() == NegativeShader.SHADER_NAME
    ) {
      extraContent = (
        <>
          <div className="block">
            <h3>Negative Shader</h3>
            <div className="tip">Make Colours Negative.</div>
          </div>
          <div className="block extraLast">
            <h3>Attributes</h3>

            <div className="tip">
              <div>
                <strong>Strength</strong>: How intense will be the negativity.
              </div>
            </div>
          </div>
        </>
      );
    } else if (
      this.bindingData["activeLayer"] instanceof ShaderLayer &&
      this.bindingData["activeLayer"].shaderName() == CrossesShader.SHADER_NAME
    ) {
      extraContent = (
        <>
          <div className="block">
            <h3>Crosses Shader</h3>
            <div className="tip">
              Allows only cool pixelated crosses to pass through.
            </div>
          </div>
          <div className="block">
            <h3>Attributes</h3>

            <div className="tip">
              <div>
                <strong>Grid Size</strong>: How far each cross will be.
              </div>
              <div>
                <strong>Cross Size</strong>: How long the branches of the cross
                will be.
              </div>
              <div>
                <strong>Line Thickness</strong>: How thick the lines are.
              </div>
            </div>
          </div>
          <div className="block extraLast">
            <h3>Tips</h3>
            <div className="tip">Cross Size=1, makes a cool dot matrix</div>
            <div className="tip">
              A HUGE Cross Size, makes a cool grid rendering
            </div>
          </div>
        </>
      );
    }
    if (this.bindingData["hintsVisibility"]) {
      return (
        <div className="bottom-ui">
          <div id="hintsPanel" className="panel bottom">
            <div
              className="panel helpFloat"
              onclick={() => {
                console.log("CLICK");
                this.helpClick();
              }}
            >
              {`HIDE${KeyboardManager.keyboardExists() ? " (H)" : ""}`}
            </div>
            <div className="hintPanel">
              {extraContent}
              {content}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="panel helpTooltip" onclick={() => this.helpClick()}>
          {`HELP${KeyboardManager.keyboardExists() ? " (H)" : ""}`}
        </div>
      );
    }
  }

  afterRender() {
    super.afterRender();
    const extraContent = document.getElementById("extraContent");
    if (extraContent) {
      extraContent.scrollIntoView();
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
