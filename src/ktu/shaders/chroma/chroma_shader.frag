in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform vec2 uSize;
uniform float uR;
uniform float uG;
uniform float uB;
uniform float uThreshold;
uniform int uNot;
uniform float uDryWet;

void main(){
    vec4 tex = texture2D(uTexture, vTextureCoord);
    if(tex.r >= uR - uThreshold && tex.r <= uR + uThreshold &&
    tex.g >= uG - uThreshold && tex.g <= uG + uThreshold &&
    tex.b >= uB - uThreshold && tex.b <= uB + uThreshold ){
        if(uNot == 0){
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }else{
            gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);    
        }
    }else{
        if(uNot == 0){
            gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);    
        }else{
            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
        
    }

    //DRY/WET
    gl_FragColor = ((1.0-uDryWet)*tex) + (uDryWet * gl_FragColor);
}