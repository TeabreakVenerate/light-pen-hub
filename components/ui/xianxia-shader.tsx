"use client";
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const useXianxiaShader = (mountRef: React.RefObject<HTMLDivElement | null>) => {
  const threeRef = useRef<any>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // --- Core Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // --- Shader Material ---
    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(mount.clientWidth, mount.clientHeight) },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    };

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    // THE MAGIC HAPPENS HERE: Forcing the shader to only use Ink, White, Gold, and Azure
    const fragmentShader = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(random(i), random(i + vec2(1.0, 0.0)), u.x),
                   mix(random(i + vec2(0.0, 1.0)), random(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 6; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      mat2 rotate(float angle) {
        return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        float t = u_time * 0.15; // Speed of the ink spread
        vec2 mouse_uv = (u_mouse * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        float warp_effect = smoothstep(0.8, 0.0, distance(uv, mouse_uv)) * 0.5;
        
        vec2 p = uv * rotate(t * 0.1) + warp_effect;
        float n1 = fbm(p * 1.5 + vec2(t * 0.1, t * 0.2));
        float n2 = fbm(p * 2.5 + n1 + vec2(-t * 0.25, t * 0.15));
        float n3 = fbm(p * 4.0 + n2 + vec2(t * 0.1, -t * 0.2));
        
        float final_noise = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

        // XIANXIA PALETTE DEFINITIONS
        vec3 inkBlack = vec3(0.02, 0.02, 0.03); // Deep dark grey/black
        vec3 starkWhite = vec3(0.85, 0.85, 0.90); // Paper white
        vec3 gold = vec3(0.83, 0.68, 0.21); // #D4AF37
        vec3 azure = vec3(0.04, 0.42, 0.48); // #0B6B7A

        // MIXING THE INK
        // Base is dark ink. As noise increases, it bleeds into Azure, then White, then Gold peaks.
        vec3 color = mix(inkBlack, azure, smoothstep(0.2, 0.5, final_noise));
        color = mix(color, starkWhite, smoothstep(0.4, 0.7, final_noise));
        color = mix(color, gold, smoothstep(0.65, 0.9, final_noise));

        // Add a subtle vignette so edges are darker (better for UI text reading)
        color *= 1.0 - smoothstep(0.7, 1.8, length(uv));

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    threeRef.current = { renderer, scene, camera, material };

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      renderer.setSize(clientWidth, clientHeight);
      uniforms.u_resolution.value.set(clientWidth, clientHeight);
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      uniforms.u_mouse.value.x = e.clientX;
      uniforms.u_mouse.value.y = window.innerHeight - e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [mountRef]);
};

export const XianxiaCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  useXianxiaShader(mountRef);
  return <div ref={mountRef} className="absolute inset-0 w-full h-full opacity-80 pointer-events-auto" />;
};