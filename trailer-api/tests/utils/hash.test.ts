import { hashUrl } from '../../src/utils/hash'
;
describe('hashUrl', () => {
    it('should return a consistent hash for the same URL', () => {
        const url = "https://example.com";
        const result1 = hashUrl(url);
        const result2 = hashUrl(url);
        expect(result1).toBe(result2);
    });

    it('should return different hashes for different URLs', () => {
        const url1 = "https://example.com";
        const url2 = "https://example.org";
        expect(hashUrl(url1)).not.toBe(hashUrl(url2));
    });

    it('should handle complex URLs correctly', () => {
        const complexUrl = "https://example.com/path?query=123&anotherParam=456";
        const hash = hashUrl(complexUrl);
        expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
});
