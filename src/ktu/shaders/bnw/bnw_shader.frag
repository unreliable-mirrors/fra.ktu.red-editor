in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform float uStrength;

void main(){
    vec4 tex = texture(uTexture, vTextureCoord);
    gl_FragColor = vec4(tex.r*(1.0-uStrength)+tex.r*uStrength, tex.g*(1.0-uStrength)+tex.r*uStrength, tex.b*(1.0-uStrength)+tex.r*uStrength, tex.a);
}