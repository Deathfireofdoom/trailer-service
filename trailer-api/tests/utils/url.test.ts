import { validateUrl } from '../../src/utils/url';


describe('validateUrl', () => {
    test.each`
        url                                               | expected
        ${'https://content.viaplay.se/pc-se/film/arrival-2016'} | ${true}
        ${'https://content.viaplay.se/pc-se/shows/'} | ${false}
        ${'https://example.com/pc-se/film/arrival-2016'} | ${false}
        ${'http://content.viaplay.se/pc-se/film/arrival-2016'} | ${false}
    `('returns $expected when url is $url', ({ url, expected }) => {
        expect(validateUrl(url)).toBe(expected);
    });
});
