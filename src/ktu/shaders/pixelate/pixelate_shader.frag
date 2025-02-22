precision highp float;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform vec4 uInputSize;

uniform float uPixelSize;


vec2 mapCoord( vec2 coord )
{
    coord *= uInputSize.xy;
    coord += uInputSize.zw;

    return coord;
}

vec2 unmapCoord( vec2 coord )
{
    coord -= uInputSize.zw;
    coord /= uInputSize.xy;

    return coord;
}

vec2 pixelate(vec2 coord, float uPixelSize)
{
	return floor( coord / vec2(uPixelSize,uPixelSize) ) * vec2(uPixelSize,uPixelSize);
}

void main(){
    vec2 pixelCoord = mapCoord(vTextureCoord);
    vec2 newCoord = pixelate(pixelCoord, uPixelSize);
    newCoord = unmapCoord(newCoord);
    vec4 tex = texture(uTexture, newCoord);
    
    gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);
}