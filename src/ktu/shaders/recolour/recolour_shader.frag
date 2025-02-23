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


void main(){
    vec4 tex = texture2D(uTexture, vTextureCoord);
    if(tex.r >= uFromR - uThreshold && tex.r <= uFromR + uThreshold &&
    tex.g >= uFromG - uThreshold && tex.g <= uFromG + uThreshold &&
    tex.b >= uFromB - uThreshold && tex.b <= uFromB + uThreshold ){
        gl_FragColor = vec4(uToR, uToG, uToB, tex.a);
    }else{
        gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);
    }   
}