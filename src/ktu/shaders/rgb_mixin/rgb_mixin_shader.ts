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

import fragment from "./rgb_mixin_shader.frag?raw";
import vertex from "./rgb_mixin_shader.vert?raw";
import DataStore from "../../ui/core/data_store";

type ColorTexture = {
  name: "red" | "green" | "blue";
  texture: Texture;
  sprite: Sprite;
  matrix: TextureMatrix;
};

export class RgbMixinShader extends ShaderLayer {
  static SHADER_NAME: string = "rgb_mixin_shader";
  fragment: string = fragment;

  red!: ColorTexture;
  green!: ColorTexture;
  blue!: ColorTexture;

  settings: ShaderSetting[] = [];

  constructor(state?: ShaderState, _includeModulators: boolean = false) {
    super(state);

    if (state) {
      this.state = {
        ...this.state,
      };
    }
  }

  setRedTexture(sprite: Sprite | null) {
    this.red = this.buildTexture("red", sprite);
    this.setColor(this.red);
  }

  setGreenTexture(sprite: Sprite | null) {
    this.green = this.buildTexture("green", sprite);
    this.setColor(this.green);
  }

  setBlueTexture(sprite: Sprite | null) {
    this.blue = this.buildTexture("blue", sprite);
    this.setColor(this.blue);
  }

  buildTexture(
    name: "red" | "green" | "blue",
    sprite: Sprite | null
  ): ColorTexture {
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
  }

  setColor(colorTex: ColorTexture) {
    let uniformMatrix = this.uniforms.uniforms.uRedMatrix as Matrix;
    if (colorTex.name == "green") {
      uniformMatrix = this.uniforms.uniforms.uGreenMatrix as Matrix;
    } else if (colorTex.name == "blue") {
      uniformMatrix = this.uniforms.uniforms.uBlueMatrix as Matrix;
    }

    if (colorTex.sprite.texture) {
      (DataStore.getInstance().getStore("app") as Application).renderer.filter
        .calculateSpriteMatrix(uniformMatrix, colorTex.sprite)
        .prepend(colorTex.matrix.mapCoord);

      if (colorTex.name == "red") {
        this.shader.resources.uRedTexture = colorTex.texture.source;
      } else if (colorTex.name == "green") {
        this.shader.resources.uGreenTexture = colorTex.texture.source;
      } else if (colorTex.name == "blue") {
        this.shader.resources.uBlueTexture = colorTex.texture.source;
      }
    } else {
      console.log("No sprite texture for", colorTex.name);
    }
  }

  shaderName(): string {
    return RgbMixinShader.SHADER_NAME;
  }

  getExtraTextures(): { [key: string]: TextureSource } {
    if (this.red === undefined) {
      this.red = this.buildTexture("red", new Sprite());
    }
    if (this.green === undefined) {
      this.green = this.buildTexture("green", new Sprite());
    }
    if (this.blue === undefined) {
      this.blue = this.buildTexture("blue", new Sprite());
    }
    return {
      uRedTexture: this.red.texture.source,
      uGreenTexture: this.green.texture.source,
      uBlueTexture: this.blue.texture.source,
    };
  }

  getVertex(): string {
    return vertex;
  }

  setupUniformValues(): { [key: string]: UniformData } {
    return {
      uRedMatrix: { value: new Matrix(), type: "mat3x3<f32>" },
      uGreenMatrix: { value: new Matrix(), type: "mat3x3<f32>" },
      uBlueMatrix: { value: new Matrix(), type: "mat3x3<f32>" },
    };
  }
}
