import { describe, it, expect } from 'vitest';
import { AssetUtils } from '../utils/assetLoader';

describe('AssetUtils', () => {
  describe('getOptimalImageFormat', () => {
    it('should return a valid image format', () => {
      const format = AssetUtils.getOptimalImageFormat();
      expect(['webp', 'png']).toContain(format);
    });
  });

  describe('generateSrcSet', () => {
    it('should generate srcset string with sizes', () => {
      const srcSet = AssetUtils.generateSrcSet('image.png', [320, 640, 1024]);

      // Function appends to basePath: 'image.png' becomes 'image.png-320w.png'
      expect(srcSet).toContain('image.png-320w.png 320w');
      expect(srcSet).toContain('image.png-640w.png 640w');
      expect(srcSet).toContain('image.png-1024w.png 1024w');
    });

    it('should handle single size', () => {
      const srcSet = AssetUtils.generateSrcSet('photo.jpg', [800]);

      // Function appends to basePath: 'photo.jpg' becomes 'photo.jpg-800w.jpg'
      expect(srcSet).toBe('photo.jpg-800w.jpg 800w');
    });

    it('should handle different file extensions', () => {
      const srcSet = AssetUtils.generateSrcSet('image.webp', [400, 800]);

      // Function appends to basePath, so 'image.webp' becomes 'image.webp-400w.webp'
      expect(srcSet).toContain('image.webp-400w.webp 400w');
      expect(srcSet).toContain('image.webp-800w.webp 800w');
    });
  });

  describe('isAssetCached', () => {
    it('should return false for uncached assets', () => {
      expect(AssetUtils.isAssetCached('new-image.jpg')).toBe(false);
    });

    it('should return boolean for any asset', () => {
      const result = AssetUtils.isAssetCached('any-image.jpg');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('clearRegistries', () => {
    it('should clear registries without error', () => {
      expect(() => AssetUtils.clearRegistries()).not.toThrow();
    });
  });
});
