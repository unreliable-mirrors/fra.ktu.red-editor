in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform float uPixelSize;
uniform vec2 uSize;


float rand(float co) { return fract(sin(co*(91.3458)) * 47453.5453); }

void main(){
    vec2 newCoords = (floor((vTextureCoord *uSize)/uPixelSize)*uPixelSize)/uSize;
    vec4 tex = texture(uTexture, newCoords);
    
    gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);
}