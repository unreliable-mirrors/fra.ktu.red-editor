in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uSampler;
uniform float uStrength;
uniform vec2 uSize;

void main(){
    //highp ivec2    size = textureSize(uSampler,1);
    float offset = (uStrength - 0.5) /uSize.x;
    float offset2 = (uStrength + 0.5) /uSize.x;
    vec4 tex = texture2D(uTexture, vTextureCoord);
    vec4 texR = texture2D(uTexture, vec2(vTextureCoord.x+offset,vTextureCoord.y));
    vec4 texL = texture2D(uTexture, vec2(vTextureCoord.x-offset2,vTextureCoord.y));
    gl_FragColor = vec4(texL.r, tex.g, texR.b, tex.a);
    
}