in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform float uPixelSize;
uniform float uMissProbability;
uniform float uSeed;
uniform float uWidth;
uniform float uHeight;


float rand(float co) { return fract(sin(co*(91.3458)) * 47453.5453); }

void main(){
    float newX = (floor((vTextureCoord.x * uWidth)/uPixelSize)*uPixelSize)/uWidth;
    float newY = (floor((vTextureCoord.y * uWidth)/uPixelSize)*uPixelSize)/uWidth;
    vec4 tex = texture(uTexture, vec2(newX,newY));

    if(rand((newX*9999.0)+(newY*99999.0)+uSeed) < uMissProbability){
        tex = vec4(0.0,0.0,0.0,0.0);
    }   
    
    gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);
}