import { safeDecodeAndParseJson, safeJsonParse } from './sentry.utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('sentry parser utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('safeJsonParse should parse valid json', () => {
    const parsed = safeJsonParse<{ a: number }>('{"a":1}', { source: 'test_safeJsonParse_valid' });
    expect(parsed).toEqual({ a: 1 });
  });

  it('safeJsonParse should return null for invalid json and capture error', () => {
    const parsed = safeJsonParse<{ a: number }>('{"a":1', { source: 'test_safeJsonParse_invalid' });
    expect(parsed).toBeNull();
  });

  it('safeDecodeAndParseJson should parse valid encoded json', () => {
    const encoded = encodeURIComponent('{"ok":true,"n":3}');
    const parsed = safeDecodeAndParseJson<{ ok: boolean; n: number }>(encoded, {
      source: 'test_safeDecodeAndParseJson_valid'
    });

    expect(parsed).toEqual({ ok: true, n: 3 });
  });

  it('safeDecodeAndParseJson should return null for malformed URI', () => {
    const parsed = safeDecodeAndParseJson('%E0%A4%A', { source: 'test_safeDecodeAndParseJson_bad_uri' });
    expect(parsed).toBeNull();
  });

  it('safeDecodeAndParseJson should return null for decoded but invalid json', () => {
    const encoded = encodeURIComponent('{"x":10');
    const parsed = safeDecodeAndParseJson(encoded, { source: 'test_safeDecodeAndParseJson_invalid_json' });
    expect(parsed).toBeNull();
  });
});
