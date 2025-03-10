in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform float uStrength;

void main(){
    vec4 tex = texture(uTexture, vTextureCoord);
    if(tex.a > 0.0){
        gl_FragColor = vec4(tex.r*(1.0-uStrength)+(1.0-tex.r)*uStrength, tex.g*(1.0-uStrength)+(1.0-tex.g)*uStrength, tex.b*(1.0-uStrength)+(1.0-tex.b)*uStrength, tex.a);
    }else{
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
}