uniform float uTime;
uniform float uXRows;
uniform float uYRows;
uniform float uSpacing;

varying vec3 vPosition;

#define PI 3.1415926538

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float random (in vec2 st) {
        return fract(sin(dot(st.xy,
        vec2(12.9898,78.233)))*
        43758.5453123);
    }
    // Quilez's 2D simplex noise https://www.shadertoy.com/view/Msf3WH
    // originally had issue with tiling, but Mike Bostock's sketch and the book of shaders chapter on noise helped me figure it out
    // https://observablehq.com/@mbostock/domain-warping
    vec2 hash( vec2 p ) // replace this by something better
    {
        p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
        return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    }
    float noise( in vec2 p )
    {
        const float K1 = 0.366025404; // (sqrt(3)-1)/2;
        const float K2 = 0.211324865; // (3-sqrt(3))/6;

        vec2  i = floor( p + (p.x+p.y)*K1 );
        vec2  a = p - i + (i.x+i.y)*K2;
        float m = step(a.y,a.x);
        vec2  o = vec2(m,1.0-m);
        vec2  b = a - o + K2;
        vec2  c = a - 1.0 + 2.0*K2;
        vec3  h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
        vec3  n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
        return dot( n, vec3(70.0) );
    }
        #define OCTAVES 6
    float fbm (in vec2 st) {
        // Initial values
        float value = 0.0;
        float amplitude = .5;
        float frequency = 0.;
        //
        // Loop of octaves
        for (int i = 0; i < OCTAVES; i++) {
            value += amplitude * noise(st);
            st *= 2.;
            amplitude *= .5;
        }
        return value;
    }








void main() {    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    //new code
    vec4 p = modelPosition;
    float t = uTime;
    p.y += 2.0 * sin(t + p.x * 2.0 * PI/ uXRows);
    p.y += 0.5 * cos(t + p.z * 2.0 * PI/ uYRows);
    vec3 center = vec3(uXRows/2.0,p.y,uYRows/2.0);
    p.z -= 0.5 * sin(-0.5 * t + p.x * 2.0 * PI/ uXRows);
    p.x += 0.5 * cos(0.5 * t + p.z * 2.0 * PI/ uYRows);
    
    
    vec4 viewPosition = viewMatrix * p;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    gl_PointSize = 3.0;
    vPosition = p.xyz;
}

