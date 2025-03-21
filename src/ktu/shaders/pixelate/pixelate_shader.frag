precision highp float;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform vec4 uInputSize;

uniform float uPixelSize;

uniform float uTime;
uniform float uStrength;
uniform int uOnlyPixels;
uniform float uDryWet;

float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio   

float gold_noise(vec2 xy, float seed){
    return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
}

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
	return (floor( coord / vec2(uPixelSize,uPixelSize) ) * vec2(uPixelSize,uPixelSize)) + (uPixelSize / 2.0);
}

void main(){
    vec4 oTex = texture(uTexture, vTextureCoord);

    vec2 pixelCoord = mapCoord(vTextureCoord);
    vec2 newCoord = pixelate(pixelCoord, uPixelSize);
    float elegible = gold_noise(newCoord, uTime+1.0);

    vec2 coord = vTextureCoord;
    if(elegible < uStrength){
        coord = unmapCoord(newCoord);
    }else if(uOnlyPixels == 1){
        coord = vec2(99.0,99.0);
    }

    vec4 tex = texture(uTexture, coord);
    
    gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);

    
    //DRY/WET
    gl_FragColor = ((1.0-uDryWet)*oTex) + (uDryWet * gl_FragColor);
}