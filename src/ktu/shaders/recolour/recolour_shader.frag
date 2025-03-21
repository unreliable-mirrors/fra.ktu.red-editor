in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform vec2 uSize;
uniform float uFromR;
uniform float uFromG;
uniform float uFromB;
uniform float uToR;
uniform float uToG;
uniform float uToB;
uniform float uThreshold;
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
    if(tex.r >= uFromR - uThreshold && tex.r <= uFromR + uThreshold &&
    tex.g >= uFromG - uThreshold && tex.g <= uFromG + uThreshold &&
    tex.b >= uFromB - uThreshold && tex.b <= uFromB + uThreshold ){
        vec4 color = vec4(uToR, uToG, uToB, tex.a);
        
        if(uOnlyHue == 1 || uOnlySaturation == 1 || uOnlyLightness == 1){
            vec3 hsvFrom = rgb2hsv(tex.rgb);
            vec3 hsvTo = rgb2hsv(vec3(uToR, uToG, uToB));

            vec3 hsv = hsvFrom;
            if(uOnlyHue == 1){
                hsv.x = hsvTo.x;
            }
            if(uOnlySaturation == 1){
                hsv.y = hsvTo.y;
            }
            if(uOnlyLightness == 1){
                hsv.z = hsvTo.z;
            }
            vec3 rgb = hsv2rgb(vec3(hsv.x, hsv.y, hsv.z));
            color = vec4(rgb.r,rgb.g,rgb.b,tex.a);
        }
        gl_FragColor = color;
    }else{
        gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);
    }   
    
    //DRY/WET
    gl_FragColor = ((1.0-uDryWet)*tex) + (uDryWet * gl_FragColor);
}