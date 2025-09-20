in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform highp vec4 uInputSize;
uniform float uDryWet;

const float Pi = 6.28318530718; // Pi*2
uniform float uHueRadius;
uniform float uSaturationRadius;
uniform float uLightnessRadius;
uniform int uIgnoreAlpha;

// GAUSSIAN BLUR SETTINGS {{{
const float uQuality = 8.0; // BLUR QUALITY (Default 4.0 - More is better but slower)
const float Directions =16.0; // BLUR DIRECTIONS (Default 16.0 - More is better but slower
const float stepSize = Pi/Directions;
const float qualityStep = 1.0/uQuality;
// GAUSSIAN BLUR SETTINGS }}}

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
   
    vec4 tex = texture2D(uTexture, vTextureCoord);
    vec2 hueRadius = uHueRadius/uInputSize.xy;
    vec2 saturationRadius = uSaturationRadius/uInputSize.xy;
    vec2 lightnessRadius = uLightnessRadius/uInputSize.xy;
    vec2 alphaRadius = (hueRadius+saturationRadius+lightnessRadius)/(3.0);

    // Pixel colour
    vec4 Color = texture(uTexture, vTextureCoord);
    Color.xyz = rgb2hsv(Color.xyz);

    // Blur calculations
    for( float d=0.0; d<Pi; d+=stepSize)
    {
	    for(float i=qualityStep; i<1.001; i+=qualityStep)
        {
            vec2 hueCoord = vTextureCoord+vec2(cos(d),sin(d))*hueRadius*i;
            vec2 saturationCoord = vTextureCoord+vec2(cos(d),sin(d))*saturationRadius*i;
            vec2 lightnessCoord = vTextureCoord+vec2(cos(d),sin(d))*lightnessRadius*i;
            vec2 alphaCoord = vTextureCoord+vec2(cos(d),sin(d))*alphaRadius*i;

            Color.x += rgb2hsv(texture( uTexture, hueCoord).xyz).x;
            Color.y += rgb2hsv(texture( uTexture, saturationCoord).xyz).y;
            Color.z += rgb2hsv(texture( uTexture, lightnessCoord).xyz).z;
            if(uIgnoreAlpha == 0 && (alphaCoord.x<0.0 || alphaCoord.x>=0.99 || alphaCoord.y<0.0 || alphaCoord.y>=0.99)){
                Color.a += tex.a;
            } if(uIgnoreAlpha == 1){
                Color.a += 1.0;
            }else{
                Color.a += texture( uTexture, alphaCoord).a;
            }
        }
    }
    
    // Output to screen
    Color /= uQuality * Directions + 1.0;
    
    Color.xyz = hsv2rgb(Color.xyz);
    gl_FragColor =  Color;
    gl_FragColor = ((1.0-uDryWet)*tex) + (uDryWet * gl_FragColor);   
}