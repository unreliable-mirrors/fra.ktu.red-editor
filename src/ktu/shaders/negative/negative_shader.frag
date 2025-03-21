in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform float uDryWet;

void main(){
    vec4 tex = texture(uTexture, vTextureCoord);
    if(tex.a > 0.0){
        gl_FragColor = vec4((1.0-tex.r), (1.0-tex.g), (1.0-tex.b), tex.a);
    }else{
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    }
    
    //DRY/WET
    gl_FragColor = ((1.0-uDryWet)*tex) + (uDryWet * gl_FragColor);
}