in vec2 vTextureCoord;
in vec2 vTimeCoord;


uniform sampler2D uTexture;
uniform sampler2D uTimeTexture;

uniform float uStrength;
uniform int uDynamicStrength;
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
    
    vec4 timeTex = texture(uTimeTexture, vTimeCoord);

    float texStrength = rgb2hsv(tex.xyz).z;
    float timeStrength = rgb2hsv(timeTex.xyz).z;
    
    float strength = uStrength;
    if(uDynamicStrength == 1){
        if(timeStrength < uStrength){
            strength = clamp(texStrength, 0.1, 0.9);
        }
    }

    gl_FragColor = vec4( tex.r, tex.g, tex.b, tex.a ) * (strength) + vec4( timeTex.r, timeTex.g, timeTex.b, timeTex.a ) * (1.0 - strength);

    //DRY/WET
    gl_FragColor = ((1.0-uDryWet)*tex) + (uDryWet * gl_FragColor);
}