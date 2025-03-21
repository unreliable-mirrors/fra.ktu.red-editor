precision highp float;
in vec2 vTextureCoord;

uniform sampler2D uTexture;

uniform float uAlpha;
uniform float uDryWet;


void main(){
    vec4 tex = texture2D(uTexture, vTextureCoord);
    gl_FragColor = vec4(tex.r * uAlpha, tex.g * uAlpha, tex.b * uAlpha, tex.a * uAlpha);

    //DRY/WET
    gl_FragColor = ((1.0-uDryWet)*tex) + (uDryWet * gl_FragColor);   
}