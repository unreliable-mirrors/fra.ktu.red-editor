in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform float uDryWet;

void main(){
    vec4 tex = texture(uTexture, vTextureCoord);
    shade = (tex.r + tex.g + tex.b) / 3.0;
    gl_FragColor = vec4(shade, shade, shade, tex.a);

    //DRY/WET
    gl_FragColor = ((1.0-uDryWet)*tex) + (uDryWet * gl_FragColor);
}