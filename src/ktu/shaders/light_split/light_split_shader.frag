in vec2 vTextureCoord;

uniform sampler2D uTexture;

uniform float uLightThreshold;
uniform float uPower;
uniform float uDarken;
uniform float uLighten;
uniform float uInverse;
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
    vec4 tex = texture(uTexture, vTextureCoord);
    
    vec3 hsv = rgb2hsv(vec3(tex.r,tex.g,tex.b));
    if(hsv.z <= uLightThreshold && uDarken == 1.0){
        if(uInverse == 0.0){
            hsv.z = pow(hsv.z-0.01, uPower);
        }else{
            hsv.z = pow(hsv.z+0.01, 1.0/uPower);
        }
    }else if(hsv.z >= uLightThreshold && uLighten == 1.0){
        if(uInverse == 0.0){
            hsv.z = pow(hsv.z+0.01, 1.0/uPower);
        }else{
            hsv.z = pow(hsv.z-0.01, uPower);
        }
    }
    vec3 tex3 = hsv2rgb(hsv);

    gl_FragColor = vec4(tex3.r, tex3.g, tex3.b, tex.a);
    
    //DRY/WET
    gl_FragColor = ((1.0-uDryWet)*tex) + (uDryWet * gl_FragColor);
}