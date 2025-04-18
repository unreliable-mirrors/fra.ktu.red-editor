precision highp float;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform vec4 uInputSize;

uniform float uGridSize;
uniform float uCrossSize;
uniform float uLineThickness;
uniform float uVariableCrossSize;
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

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(){
    vec4 oTex = texture(uTexture, vTextureCoord);
    
    vec2 pixelCoord = mapCoord(vTextureCoord);
    vec2 newCoords = pixelate(pixelCoord, uGridSize);
    vec4 tex = texture(uTexture, unmapCoord(newCoords));
    
    float crossSize = uCrossSize;
    if(uVariableCrossSize == 1.0){
        crossSize = uCrossSize * rgb2hsv(vec3(tex.r,tex.g,tex.b)).z;
    }

    if((pixelCoord.x >= newCoords.x-crossSize && pixelCoord.x <= newCoords.x+crossSize && pixelCoord.y > newCoords.y-(uLineThickness/2.0) && pixelCoord.y < newCoords.y+(uLineThickness/2.0)) 
    || 
    (pixelCoord.y >= newCoords.y-crossSize && pixelCoord.y <= newCoords.y+crossSize && pixelCoord.x > newCoords.x-(uLineThickness/2.0) && pixelCoord.x < newCoords.x+(uLineThickness/2.0))){
        gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);
    }else{
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
    
    //DRY/WET
    gl_FragColor = ((1.0-uDryWet)*oTex) + (uDryWet * gl_FragColor);
}