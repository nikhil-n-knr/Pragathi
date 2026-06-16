export const FluidVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const FluidFragmentShader = `
  uniform sampler2D uPrevFrame;
  uniform vec2 uMouse;        // Normalized mouse position (-1 to 1)
  uniform vec2 uMouseVel;     // Mouse velocity vector
  uniform float uTime;
  uniform float uAspect;
  uniform float uDamp;        // Dissipation rate
  uniform float uRadius;      // Splat radius
  uniform float uSpeedFactor; // Speed multiplier for density
  varying vec2 vUv;

  // Simple pseudo-random hash
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // 2D Noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
  }

  void main() {
    vec2 uv = vUv;
    
    // Convert mouse position to 0..1 UV coordinate space
    vec2 mUv = uMouse * 0.5 + 0.5;
    
    // Correct aspect ratio for distance calculations
    vec2 aspectCorrectedUv = vec2(uv.x * uAspect, uv.y);
    vec2 aspectCorrectedMouse = vec2(mUv.x * uAspect, mUv.y);

    // Calculate curl/fluid advection vector based on local noise and previous density
    float n = noise(aspectCorrectedUv * 5.0 + uTime * 0.5);
    vec2 forceOffset = vec2(sin(n * 6.283), cos(n * 6.283)) * 0.003;
    
    // Advection: look back along velocity vectors to shift density
    // Shift is a combination of mouse velocity field and localized random thermal currents
    vec2 lookupUv = uv - uMouseVel * 0.015 - forceOffset;
    lookupUv = clamp(lookupUv, 0.0, 1.0);

    // Sample previous frame's density
    vec4 prevColor = texture2D(uPrevFrame, lookupUv);
    
    // Dissipation/Fading over time
    prevColor.rgb *= uDamp;

    // Splat: add smoke density when mouse is moving
    float dist = distance(aspectCorrectedUv, aspectCorrectedMouse);
    float mouseSpeed = length(uMouseVel);
    
    // Density is added based on speed and mouse proximity
    float splat = smoothstep(uRadius, 0.0, dist) * (mouseSpeed * uSpeedFactor + 0.02);
    
    // Smoke Color - Brand yellow (#FFFF00) mixed with a bit of orange/warmth on high speed
    vec3 smokeColor = vec3(1.0, 0.9 + 0.1 * sin(uTime * 3.0), 0.0);
    
    // Add new splat to the faded previous frame
    vec3 finalColor = prevColor.rgb + smokeColor * splat;
    
    // Clamp to prevent blowout
    finalColor = clamp(finalColor, 0.0, 1.2);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
