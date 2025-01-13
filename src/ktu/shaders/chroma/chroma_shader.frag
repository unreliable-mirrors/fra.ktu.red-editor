in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform vec2 uSize;
uniform float uR;
uniform float uG;
uniform float uB;
uniform float uThreshold;


void main(){
    vec4 tex = texture2D(uTexture, vTextureCoord);
    if(tex.r > uR - uThreshold && tex.r < uR + uThreshold &&
    tex.g > uG - uThreshold && tex.g < uG + uThreshold &&
    tex.b > uB - uThreshold && tex.b < uB + uThreshold ){
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }else{
        gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);
    }   
}