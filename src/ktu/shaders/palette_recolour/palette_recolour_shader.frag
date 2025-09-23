in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform vec2 uSize;

uniform float uColor1R;
uniform float uColor1G;
uniform float uColor1B;
uniform float uColor2R;
uniform float uColor2G;
uniform float uColor2B;
uniform float uColor3R;
uniform float uColor3G;
uniform float uColor3B;
uniform float uColor4R;
uniform float uColor4G;
uniform float uColor4B;
uniform float uColor5R;
uniform float uColor5G;
uniform float uColor5B;

uniform int uOnlyHue;
uniform int uOnlySaturation;
uniform int uOnlyLightness;
uniform float uDryWet;

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
    vec4 hsb = vec4(rgb2hsv(tex.rgb),1.0);

    vec4 color1 = vec4(rgb2hsv(vec3(uColor1R, uColor1G, uColor1B)), 1.0);
    vec4 color2 = vec4(rgb2hsv(vec3(uColor2R, uColor2G, uColor2B)), 1.0);
    vec4 color3 = vec4(rgb2hsv(vec3(uColor3R, uColor3G, uColor3B)), 1.0);
    vec4 color4 = vec4(rgb2hsv(vec3(uColor4R, uColor4G, uColor4B)), 1.0);
    vec4 color5 = vec4(rgb2hsv(vec3(uColor5R, uColor5G, uColor5B)), 1.0);

    float distance1 = color1.z > 0.0 ? abs(color1.x - hsb.x) : 999.0;
    float distance2 = color2.z > 0.0 ? abs(color2.x - hsb.x) : 999.0;
    float distance3 = color3.z > 0.0 ? abs(color3.x - hsb.x) : 999.0;
    float distance4 = color4.z > 0.0 ? abs(color4.x - hsb.x) : 999.0;
    float distance5 = color5.z > 0.0 ? abs(color5.x - hsb.x) : 999.0;

    float minDistance = min(distance1, min(distance2, min(distance3, min(distance4, distance5))));

    vec4 targetColor = color1;
    if(distance2 == minDistance){
        targetColor = color2;
    }
    if(distance3 == minDistance){
        targetColor = color3;
    }
    if(distance4 == minDistance){
        targetColor = color4;
    }
    if(distance5 == minDistance){
        targetColor = color5;
    }
    vec4 newColor = vec4(hsb.x, hsb.y, hsb.z, hsb.a);
    if(uOnlyHue == 1){
        newColor.x = targetColor.x;
    }
    if(uOnlySaturation == 1){
        newColor.y = targetColor.y;
    }
    if(uOnlyLightness == 1){
        newColor.z = targetColor.z;
    }
    gl_FragColor = vec4(hsv2rgb(newColor.xyz), tex.a);
    //DRY/WET
    gl_FragColor = ((1.0-uDryWet)*tex) + (uDryWet * gl_FragColor);
}