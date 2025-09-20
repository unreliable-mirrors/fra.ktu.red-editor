in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform highp vec4 uInputSize;
uniform float uDryWet;

const float Pi = 6.28318530718; // Pi*2
uniform float uRedSize;
uniform float uGreenSize;
uniform float uBlueSize;

// GAUSSIAN BLUR SETTINGS {{{
const float uQuality = 8.0; // BLUR QUALITY (Default 4.0 - More is better but slower)
const float Directions =16.0; // BLUR DIRECTIONS (Default 16.0 - More is better but slower
const float stepSize = Pi/Directions;
const float qualityStep = 1.0/uQuality;
// GAUSSIAN BLUR SETTINGS }}}

void main(){
   
    vec4 tex = texture2D(uTexture, vTextureCoord);
    vec2 redRadius = uRedSize/uInputSize.xy;
    vec2 greenRadius = uGreenSize/uInputSize.xy;
    vec2 blueRadius = uBlueSize/uInputSize.xy;
    vec2 alphaRadius = (redRadius+greenRadius+blueRadius)/(3.0);

    // Pixel colour
    vec4 Color = texture(uTexture, vTextureCoord);
    
    // Blur calculations
    for( float d=0.0; d<Pi; d+=stepSize)
    {
	    for(float i=qualityStep; i<1.001; i+=qualityStep)
        {
            vec2 redCoord = vTextureCoord+vec2(cos(d),sin(d))*redRadius*i;
            vec2 greenCoord = vTextureCoord+vec2(cos(d),sin(d))*greenRadius*i;
            vec2 blueCoord = vTextureCoord+vec2(cos(d),sin(d))*blueRadius*i;
            vec2 alphaCoord = vTextureCoord+vec2(cos(d),sin(d))*alphaRadius*i;

            Color.r += texture( uTexture, redCoord).r;
            Color.g += texture( uTexture, greenCoord).g;
			Color.b += texture( uTexture, blueCoord).b;
            if(alphaCoord.x<0.0 || alphaCoord.x>=0.99 || alphaCoord.y<0.0 || alphaCoord.y>=0.99){
                Color.a += tex.a;
            }else{
                Color.a += texture( uTexture, alphaCoord).a;
            }

        }
    }
    
    // Output to screen
    Color /= uQuality * Directions + 1.0;
    gl_FragColor =  Color;
    gl_FragColor = ((1.0-uDryWet)*tex) + (uDryWet * gl_FragColor);   
}