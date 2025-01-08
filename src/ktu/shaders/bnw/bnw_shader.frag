in vec2 vTextureCoord;

uniform sampler2D uTexture;

void main(){
    vec4 tex = texture(uTexture, vTextureCoord);
    gl_FragColor = vec4(tex.r, tex.r, tex.r, 1.0);
}