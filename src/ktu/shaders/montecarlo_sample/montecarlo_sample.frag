in vec2 vTextureCoord;


uniform sampler2D uTexture;

uniform vec2 uSize;
uniform float uTime;
uniform float uStrength;

float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio   

float gold_noise(vec2 xy, float seed){
    return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
}

void main(){
    vec4 tex = texture(uTexture, vTextureCoord);
    float noise = gold_noise(vTextureCoord*uSize, uTime);
    if(noise < 1.0-uStrength){
        gl_FragColor = vec4( tex.r, tex.g, tex.b, tex.a );
    }else{
        gl_FragColor = vec4( 0.0, 0.0, 0.0, 0.0 );
    }
}