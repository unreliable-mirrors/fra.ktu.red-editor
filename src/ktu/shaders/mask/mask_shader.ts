import {
  Application,
  Container,
  Matrix,
  Sprite,
  Texture,
  TextureMatrix,
  TextureSource,
  UniformData,
} from "pixi.js";
import { ShaderLayer, ShaderSetting, ShaderState } from "../shader_layer";

import fragment from "./mask_shader.frag?raw";
import { registerModulatorsFromState } from "../../helpers/modulators";
import EventDispatcher from "../../ui/core/event_dispatcher";
import DataStore from "../../ui/core/data_store";
import { ContainerLayer } from "../../layers/container_layer";
import vertex from "./mask_shader.vert?raw";

export type MaskShaderState = ShaderState & {
  mask: number;
};

export type MaskShaderSetting = {
  field: ShaderSetting["field"] | "mask";
  type: ShaderSetting["type"] | "layer";
  onchange: (value: string) => void;
};

type MaskTexture = {
  name: "mask";
  texture: Texture;
  sprite: Sprite;
  matrix: TextureMatrix;
};

export class MaskShader extends ShaderLayer {
  static SHADER_NAME: string = "mask_shader";
  declare state: MaskShaderState;
  fragment: string = fragment;

  mask!: MaskTexture;
  maskLayer?: ContainerLayer;

  settings: MaskShaderSetting[] = [
    {
      field: "mask",
      type: "layer",
      onchange: (value) => {
        if (value) {
          this.bindMask(parseInt(value));
        } else {
          this.unbindMask();
        }
      },
    },
    ...this.defaultSettings(),
  ];

  constructor(state?: MaskShaderState, includeModulators: boolean = false) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
        mask: state.mask,
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

  bindMask = (value: number) => {
    this.state.mask = value;
    const layer: ContainerLayer = DataStore.getInstance()
      .getStore("layers")
      .find((l: ContainerLayer) => l.getUniqueId() === value);

    if (
      !this.maskLayer ||
      this.maskLayer.getUniqueId() != layer.getUniqueId()
    ) {
      if (this.maskLayer) {
        EventDispatcher.getInstance().removeEventListener(
          this.maskLayer.getUniqueId() + "",
          "change",
          this.handleMaskChange
        );
      }
      this.maskLayer = layer;
      EventDispatcher.getInstance().addEventListener(
        layer.getUniqueId() + "",
        "change",
        this.handleMaskChange
      );
      EventDispatcher.getInstance().addEventListener(
        layer.getUniqueId() + "",
        "unbind",
        this.unbindMask
      );
    }
    layer.touch();
  };

  unbindMask = () => {
    if (this.maskLayer) {
      EventDispatcher.getInstance().removeEventListener(
        this.maskLayer.getUniqueId() + "",
        "change",
        this.handleMaskChange
      );
      this.state.mask = -1;
      this.maskLayer = undefined;
      this.setMaskTexture(null);
    }
  };

  handleMaskChange = () => {
    if (this.maskLayer) {
      this.setMaskTexture(this.maskLayer!.mainSprite);
    }
  };

  setMaskTexture = (sprite: Sprite | null) => {
    this.mask = this.buildTexture("mask", sprite);
    this.setColor(this.mask);
  };

  buildTexture = (name: "mask", sprite: Sprite | null): MaskTexture => {
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

  setColor = (maskTex: MaskTexture) => {
    const uniformMatrix = this.uniforms.uniforms.uMaskMatrix as Matrix;

    if (maskTex.sprite.texture) {
      (DataStore.getInstance().getStore("app") as Application).renderer.filter
        .calculateSpriteMatrix(uniformMatrix, maskTex.sprite)
        .prepend(maskTex.matrix.mapCoord);

      this.shader.resources.uMaskTexture = maskTex.texture.source;
    } else {
      console.log("No sprite texture for", maskTex.name);
    }
  };

  shaderName = (): string => {
    return MaskShader.SHADER_NAME;
  };

  defaultState = (): MaskShaderState => {
    return {
      ...super.defaultState(),
      mask: -1,
    };
  };

  getExtraTextures = (): { [key: string]: TextureSource } => {
    if (this.mask === undefined) {
      this.mask = this.buildTexture("mask", new Sprite());
    }
    return {
      uMaskTexture: this.mask.texture.source,
    };
  };

  getVertex = (): string => {
    return vertex;
  };

  setupUniformValues = (): { [key: string]: UniformData } => {
    return {
      uMaskMatrix: { value: new Matrix(), type: "mat3x3<f32>" },
    };
  };

  unbind = () => {
    super.unbind();
    this.unbindMask();
    EventDispatcher.getInstance().addEventListener(
      "camera",
      "reposition",
      this.onRepositionCamera
    );
  };

  onRepositionCamera = () => {
    console.log("REPOSITION CAMERA", this);
    if (this.maskLayer) {
      console.log("THOCUCHISH");
      this.maskLayer.touch(true);
    }
  };
}
