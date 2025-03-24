in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform float uLevels;
uniform float uDryWet;

float round( float x )
{
    if(x - floor(x) > 0.5){
        return ceil(x);
    }else{
        return floor(x);
    }
}

void main(){
    vec4 oTex = texture(uTexture, vTextureCoord);
    vec4 tex = texture2D(uTexture, vTextureCoord);
    tex.r = round(tex.r * (uLevels - 1.0))/(uLevels - 1.0);
    tex.g = round(tex.g * (uLevels - 1.0))/(uLevels - 1.0);
    tex.b = round(tex.b * (uLevels - 1.0))/(uLevels - 1.0);
    
    gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);
    
    //DRY/WET
    gl_FragColor = ((1.0-uDryWet)*oTex) + (uDryWet * gl_FragColor);
}