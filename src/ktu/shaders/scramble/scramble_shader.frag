precision highp float;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform vec4 uInputSize;

uniform float uRange;
uniform float uTime;

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

void main(){
    vec2 pixelCoord = mapCoord(vTextureCoord);
    vec2 newCoords = pixelCoord + vec2((
        gold_noise(vTextureCoord * vec2(1920,1080), uTime)*uRange-
        uRange / 2.0),(
        gold_noise(vTextureCoord * vec2(1920,1080), uTime+0.1)*uRange-
        uRange / 2.0));
    vec4 tex = texture2D(uTexture, unmapCoord(newCoords));
    gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);
}