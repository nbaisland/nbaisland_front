import { useEffect, useRef } from "react";
import SimplexNoise from 'simplex-noise';

export default function IslandCanvas({ seed = 0, size = 500 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const simplex = new SimplexNoise(seed);

    const img = ctx.createImageData(size, size);
    const data = img.data;

    const scale = 0.004;
    const octaves = 3;
    const persistence = 0.5;

    function fractalNoise(x, y) {
      let value = 0;
      let amp = 1;
      let freq = 1;
      for (let i = 0; i < octaves; i++) {
        value += simplex.noise2D(x * freq, y * freq) * amp;
        freq *= 2;
        amp *= persistence;
      }
      return value;
    }

    let idx = 0;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const nx = x - cx;
        const ny = y - cy;
        const dist = Math.sqrt(nx * nx + ny * ny) / radius;
        const falloff = Math.min(1, dist ** 2.5);

        let h = fractalNoise(x * scale, y * scale);
        h = (h + 1) / 2 + 0.18;
        h = h * (1 - falloff); 

        let r, g, b;
        if (h < 0.2) {
          r = 20; g = 100; b = 200;
        }
        else if (h < 0.4) {
          r = 50; g = 120; b = 200;
        } else if (h < 0.49) {
          r = 240; g = 220; b = 130;
        } else if (h < 0.65) {
          r = 80; g = 180; b = 90;
        } else if (h < 0.85) {
          r = 60; g = 140; b = 60;
        } else {
          r = 180; g = 180; b = 180;
        }

        if (dist > 0.9 && h > 0.4) {
          r = r * 0.7;
          g = g * 0.7;
          b = b * 0.7;
        }

        data[idx++] = r;
        data[idx++] = g;
        data[idx++] = b;
        data[idx++] = 255;
      }
    }

    ctx.putImageData(img, 0, 0);
  }, [seed, size]);

  return <canvas ref={canvasRef} width={size} height={size} />;
}
