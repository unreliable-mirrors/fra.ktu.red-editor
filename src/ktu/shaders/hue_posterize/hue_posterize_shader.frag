in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform float uLevels;
uniform float uOffset;
uniform float uDryWet;

float round( float x )
{
    if(x - floor(x) > 0.5){
        return ceil(x);
    }else{
        return floor(x);
    }
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
    vec4 tex = texture2D(uTexture, vTextureCoord);
    tex.xyz = rgb2hsv(tex.xyz);
    
    tex.x = round(tex.x * (uLevels))/(uLevels);
    tex.x+=(360.0/uLevels * uOffset)/360.0;
    
    tex.xyz = hsv2rgb(tex.xyz);

    gl_FragColor = tex;
    
    //DRY/WET
    gl_FragColor = ((1.0-uDryWet)*oTex) + (uDryWet * gl_FragColor);
}