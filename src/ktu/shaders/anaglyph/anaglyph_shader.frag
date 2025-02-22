precision highp float;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform vec4 uInputSize;

uniform float uStrength;

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

    vec4 tex = texture2D(uTexture, vTextureCoord);
    vec4 texR = texture2D(uTexture, unmapCoord(pixelCoord + vec2(uStrength, 0)));
    vec4 texL = texture2D(uTexture, unmapCoord(pixelCoord - vec2(uStrength, 0)));
    gl_FragColor = vec4(texL.r, tex.g, texR.b, tex.a);
    
}