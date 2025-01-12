in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform vec2 uSize;


void main(){
    vec4 tex = texture(uTexture, vTextureCoord);
    if(tex.r == 0.0 && tex.g == 0.0 && tex.b == 0.0){
        tex.a = 0.0;
    }
    gl_FragColor = vec4(tex.r, tex.g, tex.b, tex.a);
}