in vec2 vTextureCoord;

uniform vec2 u_mouse;
uniform float u_x;
uniform float u_y;
uniform sampler2D uTexture;

void main(){
    //gl_FragColor = vec4(gl_FragCoord.x/1000.0,u_blue,0.0,1.0);
    vec2 offset = vec2(u_x/10.0,0.0);
    vec4 tex = texture(uTexture, vTextureCoord);
    vec4 texR = texture(uTexture, vTextureCoord + offset);
    vec4 texL = texture(uTexture, vTextureCoord - offset);
    gl_FragColor = vec4(tex.r, (texR.g*texR.g)+(texR.g-(texR.g*texR.g))*u_y, (texL.b*texL.b)+(texL.b-(texL.b*texL.b))*u_y, 1.0);
    //gl_FragColor = vec4((tex.r), (tex.g*texR.g), (tex.b*texL.b), 1.0);
}