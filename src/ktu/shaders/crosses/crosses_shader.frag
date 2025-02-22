in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform float uPixelSize;
uniform vec2 uSize;

float crossSize = 4.5;

float rand(float co) { return fract(sin(co*(91.3458)) * 47453.5453); }

void main(){
    vec2 newCoords = ((floor((vTextureCoord *uSize)/uPixelSize)*uPixelSize)+(uPixelSize/2.0))/uSize;
    vec4 tex = texture(uTexture, newCoords);
    
    if((vTextureCoord.x > newCoords.x-(crossSize/uSize.x) && vTextureCoord.x < newCoords.x+(crossSize/uSize.x) && vTextureCoord.y > newCoords.y - (1.0/uSize.y) && vTextureCoord.y < newCoords.y + (1.0/uSize.y)) 
    || 
    (vTextureCoord.y > newCoords.y-(crossSize/uSize.y) && vTextureCoord.y < newCoords.y+(crossSize/uSize.y) && vTextureCoord.x > newCoords.x - (1.0/uSize.x) && vTextureCoord.x < newCoords.x + (1.0/uSize.x))){
        gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);
    }else{
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
}