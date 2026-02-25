/**
 * @vitest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';

const createWrapper = (initialPath: string) => {
  return ({ children }: { children: React.ReactNode }) =>
    createElement(MemoryRouter, { initialEntries: [initialPath] }, children);
};

describe('useChannelTalkVisibility', () => {
  let mockChannelIO: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockChannelIO = vi.fn();
    window.ChannelIO = mockChannelIO as any;
  });

  afterEach(() => {
    delete (window as any).ChannelIO;
    vi.resetModules();
  });

  it('window.ChannelIO가 없으면 show/hide를 호출하지 않는다', async () => {
    delete (window as any).ChannelIO;
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/store')
    });

    expect(mockChannelIO).not.toHaveBeenCalled();
  });

  it('/store에서 showChannelButton을 호출한다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/store')
    });

    expect(mockChannelIO).toHaveBeenCalledWith('showChannelButton');
  });

  it('/store/detail에서도 showChannelButton을 호출한다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/store/detail')
    });

    expect(mockChannelIO).toHaveBeenCalledWith('showChannelButton');
  });

  it('/mypage에서 showChannelButton을 호출한다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/mypage')
    });

    expect(mockChannelIO).toHaveBeenCalledWith('showChannelButton');
  });

  it('/home에서 hideChannelButton과 hideMessenger를 호출한다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/home')
    });

    expect(mockChannelIO).toHaveBeenCalledWith('hideChannelButton');
    expect(mockChannelIO).toHaveBeenCalledWith('hideMessenger');
  });

  it('/에서 hideChannelButton과 hideMessenger를 호출한다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/')
    });

    expect(mockChannelIO).toHaveBeenCalledWith('hideChannelButton');
    expect(mockChannelIO).toHaveBeenCalledWith('hideMessenger');
  });
});
