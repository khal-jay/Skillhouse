import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// jsdom has no canvas 2D backend, so components that draw ASCII/matrix art onto
// a <canvas> (e.g. AsciiCanvas, AsciiThumbnail) silently no-op in tests without
// this. The gradient in getImageData exercises the brightness-tier branches
// those components use to pick glyphs/colors, instead of them all reading 0.
class MockCanvasRenderingContext2D {
  fillStyle = '';
  font = '';
  textBaseline = '';
  clearRect() {}
  fillRect() {}
  fillText() {}
  measureText() {
    return { width: 0 } as TextMetrics;
  }
  getImageData(_x: number, _y: number, width: number, height: number) {
    const data = new Uint8ClampedArray(width * height * 4);
    for (let i = 0; i < width * height; i++) {
      const brightness = (i * 53) % 256;
      data[i * 4] = brightness;
      data[i * 4 + 1] = brightness;
      data[i * 4 + 2] = brightness;
      data[i * 4 + 3] = 255;
    }
    return { data } as unknown as ImageData;
  }
}

HTMLCanvasElement.prototype.getContext = vi.fn((contextId: string) => {
  if (contextId === '2d') {
    return new MockCanvasRenderingContext2D();
  }
  return null;
}) as unknown as HTMLCanvasElement['getContext'];

// jsdom has no matchMedia implementation; components checking
// prefers-reduced-motion need this to avoid throwing on mount.
window.matchMedia = vi.fn().mockImplementation((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));
