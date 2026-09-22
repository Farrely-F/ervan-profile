"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RIFTS, type World } from "@/data/profiles";

/**
 * THE RIFT — a full-bleed WebGL energy field.
 *
 * One draw call for the field (fullscreen quad, procedural shader) and one
 * for the drifting shards (InstancedMesh). No per-frame allocation: every
 * temporary vector is hoisted, every uniform written in place. The loop is
 * driven by rAF with an id, parks itself when the tab is hidden, and renders
 * exactly one frame when the visitor prefers reduced motion.
 */

export type RiftBias = RefObject<number>;

type Props = {
  world: World | "rift";
  /**
   * Angle of the seam from the horizontal axis, in screen space, degrees.
   * 66° gives the tall diagonal split; 30° gives the wide one.
   */
  seamAngle?: number;
  /** Seam displacement along its normal axis, in uv units. */
  bias?: RiftBias;
  /** Overall intensity of the field. */
  intensity?: number;
  className?: string;
};

const FIELD_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FIELD_FRAG = /* glsl */ `
  precision highp float;

  uniform vec2 uRes;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform vec2 uSeamN;      // unit normal of the seam, screen space
  uniform float uSeamOffset; // seam displacement, uv units
  uniform float uMode;      // 0 = neon grid, 1 = green march, 2 = both
  uniform float uIntensity;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float s = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 3; i++) {
      s += a * noise(p);
      p = rot * p * 2.03;
      a *= 0.5;
    }
    return s;
  }

  // Thin emissive lattice used by the neon side.
  float lattice(vec2 p, float scale, float width) {
    vec2 g = abs(fract(p * scale) - 0.5) / scale;
    float line = min(g.x, g.y);
    return width / (line + width);
  }

  void main() {
    float aspect = uRes.x / max(uRes.y, 1.0);
    vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);

    // --- the seam -----------------------------------------------------
    // Defined in SCREEN space so the DOM clip-path can match it exactly.
    vec2 q = vUv - 0.5;
    float sd = dot(q, uSeamN) - uSeamOffset;

    float warp = fbm(p * 2.1 + vec2(uTime * 0.05, -uTime * 0.037));
    sd += (warp - 0.5) * 0.07;
    // torn micro-edge so the tear reads as a rip, not a gradient band
    sd += (noise(vUv * vec2(34.0, 190.0) + vec2(0.0, uTime * 0.7)) - 0.5) * 0.012;

    float riftMode = step(1.5, uMode);
    float halo = exp(-abs(sd) * mix(17.0, 9.0, riftMode));
    float core = exp(-abs(sd) * 46.0);
    float tear = exp(-abs(sd) * 120.0);
    // energy lives near the tear: the far field falls back to the void
    float falloff = exp(-abs(sd) * 3.1) * 0.86 + 0.14;

    // --- world A : neon grid -----------------------------------------
    vec2 gp = p + vec2(uTime * 0.012, -uTime * 0.02);
    float grid = lattice(gp, 11.0, 0.006) * 0.5 + lattice(gp, 44.0, 0.0022);
    float horizon = exp(-abs(p.y + 0.16 - uMouse.x * 0.04) * 5.5);
    float pulseA = 0.58 + 0.42 * warp;
    vec3 colA = uA * (grid * 0.55 + horizon * 0.7) * pulseA;
    colA += uC * horizon * 0.35 * pulseA;
    colA *= (0.22 + 0.78 * smoothstep(-0.32, 0.04, -sd)) * falloff;

    // --- world B : green march ---------------------------------------
    float ridge =
      fbm(p * 2.6 + vec2(uTime * 0.02, uTime * 0.013)) * 0.68 +
      fbm(p * 1.35) * 0.32;
    float bands = 1.0 - abs(sin((p.y * 7.0 + ridge * 5.0) * 3.14159));
    float sun = exp(-length(p - vec2(0.34, 0.2)) * 3.4);
    float pulseB = 0.6 + 0.4 * ridge;
    vec3 colB = uA * sun * 0.95;
    colB += uB * bands * 0.32 * pulseB;
    colB += uC * pow(max(ridge - 0.35, 0.0), 1.7) * 1.5;
    colB *= (0.22 + 0.78 * smoothstep(-0.32, 0.04, sd)) * falloff;

    // --- blend the two worlds across the rift -------------------------
    float side = uMode < 0.5 ? 0.0 : (uMode > 1.5 ? smoothstep(-0.03, 0.03, sd) : 1.0);
    vec3 col = mix(colA, colB, side);

    // seam energy: the two accents bleed into each other at the tear
    vec3 seamCol = mix(uA, uB, 0.5 + 0.5 * sin(uTime * 0.3));
    float seamAmp = mix(0.5, 1.0, riftMode);
    col += seamCol * (core * 0.55 + tear * 0.8) * seamAmp;
    col += mix(uC, seamCol, 0.4) * halo * mix(0.055, 0.14, riftMode);

    // pointer bloom
    vec2 mp = (uMouse * 0.5) * vec2(aspect, 1.0);
    col += mix(uC, uA, 0.5) * exp(-length(p - mp) * 3.4) * 0.12;
    col += seamCol * halo * 0.22 * (1.0 - min(abs(uSeamOffset) * 3.0, 1.0));

    // scan sweep along the seam
    float sweep = exp(-abs(fract(uScroll * 0.6 + uTime * 0.035) - 0.5) * 26.0);
    col += seamCol * sweep * halo * 0.5;

    // grain + vignette
    float grain = hash(vUv * uRes + fract(uTime) * 137.0) - 0.5;
    col += grain * 0.028;
    col *= 1.0 - 0.62 * smoothstep(0.34, 1.05, length(p));
    col *= uIntensity;
    col *= 0.72;

    gl_FragColor = vec4(max(col, 0.0), 1.0);
  }
`;

const SHARD_VERT = /* glsl */ `
  attribute vec4 aSeed;   // angle, radius, speed, size
  attribute float aSide;  // -1 world A, +1 world B

  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform float uSpread;
  uniform vec2 uUvScale;

  varying vec2 vUv;
  varying float vSide;
  varying float vDepth;

  void main() {
    vUv = uv;
    vSide = aSide;

    float depth = aSeed.y;                     // 0..1, 0 = far
    float z = mix(-7.6, -1.4, depth);
    float scale = mix(0.22, 0.72, depth) * aSeed.w;

    float drift = uTime * (0.06 + aSeed.z * 0.16) + aSeed.x * 6.28318;
    vec3 base = vec3(
      sin(aSeed.x * 43.0) * uSpread,
      cos(aSeed.x * 71.0) * uSpread * 0.55,
      0.0
    );
    base.y = mod(base.y + drift, uSpread * 1.6) - uSpread * 0.8;

    // parallax: near shards answer the pointer and the scroll harder
    float parallax = mix(0.12, 0.85, depth);
    base.x += uMouse.x * 0.9 * parallax;
    base.y += (uMouse.y * 0.5 - uScroll * 1.1) * parallax;

    float rot = drift * 0.7 + aSeed.z * 4.0;
    vec2 local = position.xy * scale;
    mat2 rm = mat2(cos(rot), -sin(rot), sin(rot), cos(rot));
    local = rm * local;
    local *= uUvScale;

    vec3 world = base + vec3(local, z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
    vDepth = depth;
  }
`;

const SHARD_FRAG = /* glsl */ `
  precision highp float;

  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;
  uniform float uIntensity;

  varying vec2 vUv;
  varying float vSide;
  varying float vDepth;

  void main() {
    vec2 c = abs(vUv - 0.5);
    // chamfered plate: the same cut-corner language as the HUD panels
    float plate = step(c.x + c.y * 0.85, 0.5 + 0.02);
    float edge = smoothstep(0.5, 0.34, c.x + c.y * 0.85);
    float streak = smoothstep(0.0, 0.6, abs(vUv.y - 0.5));
    float mask = plate * edge * streak;
    if (mask <= 0.001) discard;

    vec3 tint = vSide < 0.0 ? mix(uA, uC, 0.35) : mix(uB, uC, 0.3);
    float alpha = mask * mix(0.16, 0.44, vDepth) * uIntensity;
    gl_FragColor = vec4(tint * (0.5 + 0.7 * vDepth), alpha);
  }
`;

export function RiftCanvas({
  world,
  seamAngle = 66,
  bias,
  intensity = 1,
  className,
}: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const root = document.documentElement;
    const ramps = RIFTS[world];
    const mode = world === "rift" ? 2 : world === "irvan" ? 0 : 1;
    const radians = (seamAngle * Math.PI) / 180;
    const seamN = new THREE.Vector2(Math.sin(radians), Math.cos(radians));
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compact = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      host.dataset.webgl = "unsupported";
      return;
    }

    renderer.setClearColor(new THREE.Color(ramps.void), 1);
    // The field is soft by nature: rasterise below CSS resolution and let the
    // compositor scale it up. Roughly a 3x saving on fill rate.
    // Quality ladder the field can walk down (or back up) on its own.
    const LEVELS = compact ? [0.45, 0.36, 0.28, 0.22] : [0.55, 0.45, 0.36, 0.28];
    let quality = 0;
    let renderScale = LEVELS[0];
    renderer.setPixelRatio(1);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block";

    // --- pass 1: the field ------------------------------------------
    const bgScene = new THREE.Scene();
    const quad = new THREE.PlaneGeometry(2, 2);
    const fieldMat = new THREE.ShaderMaterial({
      vertexShader: FIELD_VERT,
      fragmentShader: FIELD_FRAG,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uRes: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uScroll: { value: 0 },
        uSeamN: { value: seamN },
        uSeamOffset: { value: 0 },
        uMode: { value: mode },
        uIntensity: { value: intensity },
        uA: { value: new THREE.Color(ramps.a) },
        uB: { value: new THREE.Color(ramps.b) },
        uC: { value: new THREE.Color(ramps.c) },
      },
    });
    bgScene.add(new THREE.Mesh(quad, fieldMat));

    // --- pass 2: the shards -----------------------------------------
    const fgScene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 40);
    camera.position.set(0, 0, 4.6);

    const COUNT = compact ? 14 : 34;
    const base = new THREE.PlaneGeometry(1, 0.16);
    const shardGeo = new THREE.InstancedBufferGeometry();
    shardGeo.index = base.index;
    shardGeo.attributes.position = base.attributes.position;
    shardGeo.attributes.uv = base.attributes.uv;
    shardGeo.instanceCount = COUNT;

    const seeds = new Float32Array(COUNT * 4);
    const sides = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      seeds[i * 4 + 0] = Math.random();
      seeds[i * 4 + 1] = Math.random();
      seeds[i * 4 + 2] = Math.random();
      seeds[i * 4 + 3] = 0.35 + Math.random() * 0.65;
      sides[i] = i % 2 === 0 ? -1 : 1;
    }
    shardGeo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seeds, 4));
    shardGeo.setAttribute("aSide", new THREE.InstancedBufferAttribute(sides, 1));

    const shardMat = new THREE.ShaderMaterial({
      vertexShader: SHARD_VERT,
      fragmentShader: SHARD_FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uScroll: { value: 0 },
        uSpread: { value: compact ? 1.5 : 2.4 },
        uUvScale: { value: new THREE.Vector2(1, 1) },
        uA: { value: new THREE.Color(ramps.a) },
        uB: { value: new THREE.Color(ramps.b) },
        uC: { value: new THREE.Color(ramps.c) },
        uIntensity: { value: world === "rift" ? 0.55 : 0.38 },
      },
    });
    fgScene.add(new THREE.Mesh(shardGeo, shardMat));

    // --- shared state (no allocation in the loop) --------------------
    const target = new THREE.Vector2(0, 0);
    const pointer = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();
    let fieldTime = 0;
    let raf = 0;
    let visible = true;
    let biasValue = 0;
    let width = 0;
    let height = 0;

    const measure = () => {
      const rect = host.getBoundingClientRect();
      const cssWidth = Math.max(1, rect.width);
      const cssHeight = Math.max(1, rect.height);
      width = Math.max(1, Math.round(cssWidth * renderScale));
      height = Math.max(1, Math.round(cssHeight * renderScale));
      renderer.setSize(width, height, false);
      fieldMat.uniforms.uRes.value.set(width, height);
      camera.aspect = cssWidth / cssHeight;
      camera.updateProjectionMatrix();
      const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      const spread = compact ? 0.9 : 1.25;
      shardMat.uniforms.uUvScale.value.set((halfH * camera.aspect) / 3.4, halfH / 2.6);
      shardMat.uniforms.uSpread.value = spread * (halfH * camera.aspect) * 0.55;
    };

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      target.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -((event.clientY / window.innerHeight) * 2 - 1)
      );
    };

    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const draw = (dt: number) => {
      fieldTime += dt;
      pointer.lerp(target, Math.min(1, dt * 3.2));
      biasValue += ((bias?.current ?? 0) - biasValue) * Math.min(1, dt * 4);

      const scroll = readScroll();
      fieldMat.uniforms.uTime.value = fieldTime;
      fieldMat.uniforms.uMouse.value.set(pointer.x, pointer.y);
      fieldMat.uniforms.uScroll.value = scroll;
      fieldMat.uniforms.uSeamOffset.value = biasValue;

      shardMat.uniforms.uTime.value = fieldTime;
      shardMat.uniforms.uMouse.value.set(pointer.x, pointer.y);
      shardMat.uniforms.uScroll.value = scroll;

      renderer.autoClear = true;
      renderer.render(bgScene, camera);
      if (!reduced) {
        renderer.autoClear = false;
        renderer.render(fgScene, camera);
        renderer.autoClear = true;
      }
    };

    // The field is ambient: 30 fps is indistinguishable and half the cost.
    let frameMs = 1000 / 30;
    let lastDraw = 0;
    let lastFrame = 0;
    let slow = 0;
    let fast = 0;
    let degraded = false;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const now = performance.now();
      const frameDelta = lastFrame === 0 ? 16.7 : now - lastFrame;
      lastFrame = now;

      // Self-tuning: each rung of the ladder is paid for by measured jank,
      // and the last rung hands the page back its frames entirely.
      if (frameDelta > 26) {
        slow += 1;
        fast = 0;
      } else if (frameDelta < 19) {
        fast += 1;
        slow = 0;
      } else {
        slow = 0;
        fast = 0;
      }

      if (slow > 40) {
        slow = 0;
        if (quality < LEVELS.length - 1) {
          quality += 1;
          renderScale = LEVELS[quality];
          frameMs = quality >= 2 ? 1000 / 24 : 1000 / 30;
          measure();
        } else if (!degraded) {
          degraded = true;
          frameMs = 1000 / 12;
          root.dataset.perf = "low";
        }
      }

      if (fast > 150) {
        fast = 0;
        if (degraded) {
          degraded = false;
          frameMs = 1000 / 30;
          root.dataset.perf = "high";
        } else if (quality > 0) {
          quality -= 1;
          renderScale = LEVELS[quality];
          frameMs = quality >= 2 ? 1000 / 24 : 1000 / 30;
          measure();
        }
      }

      if (!visible) return;
      if (now - lastDraw < frameMs - 1) {
        clock.getDelta();
        return;
      }
      lastDraw = now;
      draw(Math.min(clock.getDelta(), 0.05));
    };

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible) clock.getDelta();
    };

    measure();
    if (reduced) {
      target.set(0, 0);
      pointer.set(0, 0);
      draw(0);
    } else {
      clock.getDelta();
      raf = requestAnimationFrame(tick);
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      quad.dispose();
      base.dispose();
      shardGeo.dispose();
      fieldMat.dispose();
      shardMat.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [world, bias, intensity, seamAngle]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      data-slot="rift-canvas"
      className={className}
      style={{ background: `radial-gradient(120% 90% at 50% 40%, ${RIFTS[world].void}, #000)` }}
    />
  );
}
