uniform vec2 u_mouse;

void main(){
    gl_FragColor = vec4(gl_FragCoord.x/1000.0,u_mouse.x/1000.0,0.0,1.0);
}