in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform float uDryWet;

void main(){
    vec4 tex = texture(uTexture, vTextureCoord);
    gl_FragColor = vec4(tex.r, tex.r, tex.r, tex.a);

    //DRY/WET
    gl_FragColor = ((1.0-uDryWet)*tex) + (uDryWet * gl_FragColor);
}