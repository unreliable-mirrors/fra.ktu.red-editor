precision highp float;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform vec4 uInputSize;

uniform float uNoiseSize;
uniform float uTime;
uniform float uStrength;
uniform float uLineThickness;
uniform int uNegative;
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

vec2 pixelate(vec2 coord, float uNoiseSize, float uLineThickness)
{
	return vec2((floor( coord.x / uNoiseSize ) * uNoiseSize) + (uNoiseSize / 2.0), (floor( coord.y / uLineThickness ) * uLineThickness));
}

void main(){
    vec4 tex = texture(uTexture, vTextureCoord);

    vec2 pixelCoord = mapCoord(vTextureCoord);
    float rowNoiseSize = gold_noise(vec2(floor(pixelCoord.y/uLineThickness)+1080.0, floor(pixelCoord.y/uLineThickness))+1080.0, uTime+2.0)*uNoiseSize;
    vec2 newCoord = pixelate(pixelCoord, rowNoiseSize, uLineThickness);
    float factor = gold_noise(newCoord, uTime+0.0);
    float elegible = gold_noise(newCoord, uTime+1.0);
    if(pixelCoord.x >= newCoord.x - (rowNoiseSize * factor) && pixelCoord.x <= newCoord.x + (rowNoiseSize * factor) && 
     pixelCoord.y >= newCoord.y-1.0  && pixelCoord.y < newCoord.y + (uLineThickness)
     && elegible < uStrength){
        if(uNegative == 0){
            gl_FragColor = texture(uTexture, unmapCoord(newCoord));
        }else{
            vec4 tex = texture(uTexture, unmapCoord(newCoord));
            if(tex.a != 0.0){
                gl_FragColor = 1.0-tex;
            }else{
                gl_FragColor = vec4(0.0,0.0,0.0,0.0);
            }
        }
    }else{
        gl_FragColor = texture(uTexture, vTextureCoord);
    }
    
    //DRY/WET
    gl_FragColor = ((1.0-uDryWet)*tex) + (uDryWet * gl_FragColor);
}