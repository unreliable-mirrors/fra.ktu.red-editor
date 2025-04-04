precision highp float;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform vec4 uInputSize;

uniform float uGridSize;
uniform float uLineThickness;
uniform float uDryWet;

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

vec2 pixelate(vec2 coord, float uGridSize)
{
	return (floor( coord / vec2(uGridSize,uGridSize) ) * vec2(uGridSize,uGridSize)) + (uGridSize / 2.0);
}

void main(){
    vec2 pixelCoord = mapCoord(vTextureCoord);
    vec2 newCoords = pixelate(pixelCoord, uGridSize);
    vec4 tex = texture(uTexture, vTextureCoord);
    if(pixelCoord.y > newCoords.y-(uLineThickness/2.0) && pixelCoord.y < newCoords.y+(uLineThickness/2.0)){
        gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);
    }else{
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
    
    //DRY/WET
    gl_FragColor = ((1.0-uDryWet)*tex) + (uDryWet * gl_FragColor);
}