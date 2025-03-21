in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform float uThreshold;
uniform float uDryWet;

void main(){
    vec4 oTex = texture(uTexture, vTextureCoord);
    vec4 tex = texture2D(uTexture, vTextureCoord);
    if(tex.r < uThreshold){
        tex.r = 0.0;
    }else{
        tex.r = 1.0;
    }
    if(tex.g < uThreshold){
        tex.g = 0.0;
    }else{
        tex.g = 1.0;
    }
    if(tex.b < uThreshold){
        tex.b = 0.0;
    }else{
        tex.b = 1.0;
    }
    gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);
    
    //DRY/WET
    gl_FragColor = ((1.0-uDryWet)*oTex) + (uDryWet * gl_FragColor);
}