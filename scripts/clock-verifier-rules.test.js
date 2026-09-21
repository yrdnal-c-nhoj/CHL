import { describe, expect, it } from 'vitest';
import { hasIndependentClockTiming } from './clock-verifier-rules.js';

describe('clock verifier timing rules', () => {
  it('allows a Three.js render loop when time comes from shared infrastructure', () => {
    const source = `
      import * as THREE from 'three';
      import { useClock } from '@/utils/hooks';
      const time = useClock();
      const animate = () => {
        requestAnimationFrame(animate);
        const now = time;
        renderer.render(scene, camera);
      };
    `;

    expect(hasIndependentClockTiming(source)).toBe(false);
  });

  it('rejects requestAnimationFrame combined with an independent time source', () => {
    const source = `
      const animate = () => {
        requestAnimationFrame(animate);
        const now = Date.now();
      };
    `;

    expect(hasIndependentClockTiming(source)).toBe(true);
  });

  it('rejects performance.now as an independent timing source', () => {
    const source = `
      requestAnimationFrame(() => {
        const elapsed = performance.now();
      });
    `;

    expect(hasIndependentClockTiming(source)).toBe(true);
  });

  it('does not reject a render loop that does not calculate clock time', () => {
    const source = `
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
    `;

    expect(hasIndependentClockTiming(source)).toBe(false);
  });
});
