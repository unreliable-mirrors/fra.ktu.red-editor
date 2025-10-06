import {
  Application,
  Matrix,
  Sprite,
  Texture,
  TextureMatrix,
  TextureSource,
  UniformData,
} from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./mask_to_shader.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";
import EventDispatcher from "../../ui/core/event_dispatcher";
import DataStore from "../../ui/core/data_store";
import { ContainerLayer } from "../../layers/container_layer";
import vertex from "./mask_to_shader.vert?raw";

export type MaskToShaderState = ShaderState & {
  base: number;
  inverse: boolean;
};

export type MaskToShaderSetting = {
  field: ShaderSetting["field"] | "base" | "inverse";
  type: ShaderSetting["type"] | "layer" | "boolean";
  onchange: (value: string) => void;
};

type MaskToTexture = {
  name: "base";
  texture: Texture;
  sprite: Sprite;
  matrix: TextureMatrix;
};

export class MaskToShader extends ShaderLayer {
  static SHADER_NAME: string = "mask_to_shader";
  declare state: MaskToShaderState;
  fragment: string = fragment;

  base!: MaskToTexture;
  baseLayer?: ContainerLayer;

  settings: MaskToShaderSetting[] = [
    {
      field: "base",
      type: "layer",
      onchange: (value) => {
        if (value) {
          this.bindBase(parseInt(value));
        } else {
          this.unbindBase();
        }
      },
    },
    {
      field: "inverse",
      type: "boolean",
      onchange: (value) => {
        this.state.inverse = "true" === value || parseFloat(value) >= 1;
        this.uniforms.uniforms.uInverse = this.state.inverse ? 1 : 0;
      },
    },
    ...this.defaultSettings(),
  ];

  constructor(state?: MaskToShaderState, includeModulators: boolean = false) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        base: state.base,
        inverse: state.inverse,
      };
      if (includeModulators) {
        registerModulatorsFromState(this, state.modulators);
      }
    }

    EventDispatcher.getInstance().addEventListener(
      "camera",
      "reposition",
      this.onRepositionCamera
    );
  }

  bindBase = (value: number) => {
    this.state.base = value;
    const layer: ContainerLayer = DataStore.getInstance()
      .getStore("layers")
      .find((l: ContainerLayer) => l.getUniqueId() === value);

    if (
      !this.baseLayer ||
      this.baseLayer.getUniqueId() != layer.getUniqueId()
    ) {
      if (this.baseLayer) {
        EventDispatcher.getInstance().removeEventListener(
          this.baseLayer.getUniqueId() + "",
          "change",
          this.handleBaseChange
        );
      }
      this.baseLayer = layer;
      EventDispatcher.getInstance().addEventListener(
        layer.getUniqueId() + "",
        "change",
        this.handleBaseChange
      );
      EventDispatcher.getInstance().addEventListener(
        layer.getUniqueId() + "",
        "unbind",
        this.unbindBase
      );
    }
    layer.touch();
  };

  unbindBase = () => {
    if (this.baseLayer) {
      EventDispatcher.getInstance().removeEventListener(
        this.baseLayer.getUniqueId() + "",
        "change",
        this.handleBaseChange
      );
      this.state.base = -1;
      this.baseLayer = undefined;
      this.setBaseTexture(null);
    }
  };

  handleBaseChange = () => {
    if (this.baseLayer) {
      this.setBaseTexture(this.baseLayer!.mainSprite);
    }
  };

  setBaseTexture = (sprite: Sprite | null) => {
    this.base = this.buildTexture("base", sprite);
    this.setColor(this.base);
  };

  buildTexture = (name: "base", sprite: Sprite | null): MaskToTexture => {
    if (!sprite) {
      console.log("No sprite for", name);
      sprite = Sprite.from(Texture.EMPTY);
    }
    let texture = sprite.texture;
    if (!texture) {
      console.log("No texture for", name);
      texture = Texture.EMPTY;
    }
    /*
    if (!texture) {
      console.log("NO TEXTURE ON SPRITE", sprite);
      texture = (
        DataStore.getInstance().getStore("app") as Application
      ).renderer.generateTexture(sprite.parent!);
      const newSprite = new Sprite(texture);
      console.log(sprite.position, sprite.anchor);
      newSprite.anchor = sprite.anchor;
      newSprite.position = sprite.position;
      sprite = newSprite;
      this.container!.addChild(sprite);
    }
      */

    return {
      name: name,
      texture,
      sprite,
      matrix: new TextureMatrix(texture),
    };
  };

  setColor = (maskTex: MaskToTexture) => {
    const uniformMatrix = this.uniforms.uniforms.uBaseMatrix as Matrix;

    if (maskTex.sprite.texture) {
      (DataStore.getInstance().getStore("app") as Application).renderer.filter
        .calculateSpriteMatrix(uniformMatrix, maskTex.sprite)
        .prepend(maskTex.matrix.mapCoord);

      this.shader.resources.uBaseTexture = maskTex.texture.source;
    } else {
      console.log("No sprite texture for", maskTex.name);
    }
  };

  shaderName(): string {
    return MaskToShader.SHADER_NAME;
  }

  defaultState(): MaskToShaderState {
    return {
      ...super.defaultState(),
      base: -1,
      inverse: false,
    };
  }

  getExtraTextures(): { [key: string]: TextureSource } {
    if (this.base === undefined) {
      this.base = this.buildTexture("base", new Sprite());
    }
    return {
      uBaseTexture: this.base.texture.source,
    };
  }

  getVertex(): string {
    return vertex;
  }

  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uBaseMatrix: { value: new Matrix(), type: "mat3x3<f32>" },
      uInverse: { value: this.state.inverse ? 1 : 0, type: "i32" },
    };
  }

  unbind = () => {
    super.unbind();
    this.unbindBase();
    EventDispatcher.getInstance().addEventListener(
      "camera",
      "reposition",
      this.onRepositionCamera
    );
  };

  onRepositionCamera = () => {
    if (this.baseLayer) {
      this.baseLayer.touch(true);
    }
  };
}
