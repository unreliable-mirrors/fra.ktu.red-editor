uniform vec2 u_mouse;
uniform float u_blue;

void main(){
    gl_FragColor = vec4(gl_FragCoord.x/1000.0,u_blue,0.0,1.0);
}