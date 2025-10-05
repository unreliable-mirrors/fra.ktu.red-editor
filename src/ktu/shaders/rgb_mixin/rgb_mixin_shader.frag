in vec2 vTextureCoord;
in vec2 vRedCoord;
in vec2 vGreenCoord;
in vec2 vBlueCoord; 


uniform sampler2D uTexture;
uniform sampler2D uRedTexture;
uniform sampler2D uGreenTexture;
uniform sampler2D uBlueTexture;

void main(){
    vec4 tex = texture(uTexture, vTextureCoord);

    vec4 redTex = texture(uRedTexture, vRedCoord);
    vec4 greenTex = texture(uGreenTexture, vGreenCoord);
    vec4 blueTex = texture(uBlueTexture, vBlueCoord);

    gl_FragColor = vec4(0.0,0.0,0.0,0.0);
    if((vRedCoord.x > 0.0 && vRedCoord.x < 1.0) && (vRedCoord.y > 0.0 && vRedCoord.y < 1.0) && redTex.a > 0.01){
        gl_FragColor.r = redTex.r;
        gl_FragColor.a = max(gl_FragColor.a, redTex.a);
    }
    if((vGreenCoord.x > 0.0 && vGreenCoord.x < 1.0) && (vGreenCoord.y > 0.0 && vGreenCoord.y < 1.0) && greenTex.a > 0.01){
        gl_FragColor.g = greenTex.g;
        gl_FragColor.a = max(gl_FragColor.a, greenTex.a);
    }
    if((vBlueCoord.x > 0.0 && vBlueCoord.x < 1.0) && (vBlueCoord.y > 0.0 && vBlueCoord.y < 1.0) && blueTex.a > 0.01){
        gl_FragColor.b = blueTex.b;
        gl_FragColor.a = max(gl_FragColor.a, blueTex.a);
    }

    //gl_FragColor = ((1.0-0.5)*tex) + (0.5 * gl_FragColor);
}