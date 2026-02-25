import { renderHook, act } from '@testing-library/react';
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
    vi.useFakeTimers();
    mockChannelIO = vi.fn();
    window.ChannelIO = mockChannelIO as any;
    window.ChannelIOInitialized = false;
  });

  afterEach(() => {
    vi.useRealTimers();
    delete window.ChannelIO;
    delete window.ChannelIOInitialized;
    vi.resetModules();
  });

  it('초기화 전에는 show/hide를 호출하지 않는다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/store')
    });

    expect(mockChannelIO).not.toHaveBeenCalledWith('showChannelButton');
  });

  it('boot 콜백 이벤트로 /store에서 showChannelButton을 호출한다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/store')
    });

    // boot 콜백 이벤트 발생
    act(() => {
      window.dispatchEvent(new Event('channeltalk:booted'));
    });

    expect(mockChannelIO).toHaveBeenCalledWith('showChannelButton');
  });

  it('polling fallback으로 /store에서 showChannelButton을 호출한다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/store')
    });

    // 이벤트 없이 ChannelIOInitialized만 설정
    window.ChannelIOInitialized = true;

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockChannelIO).toHaveBeenCalledWith('showChannelButton');
  });

  it('boot 후 2초 뒤 재시도가 실행된다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/store')
    });

    act(() => {
      window.dispatchEvent(new Event('channeltalk:booted'));
    });

    mockChannelIO.mockClear();

    // 2초 후 재시도
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(mockChannelIO).toHaveBeenCalledWith('showChannelButton');
  });

  it('/home에서 hideChannelButton을 호출한다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/home')
    });

    act(() => {
      window.dispatchEvent(new Event('channeltalk:booted'));
    });

    expect(mockChannelIO).toHaveBeenCalledWith('hideChannelButton');
    expect(mockChannelIO).toHaveBeenCalledWith('hideMessenger');
  });

  it('/mypage에서 showChannelButton을 호출한다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/mypage')
    });

    act(() => {
      window.dispatchEvent(new Event('channeltalk:booted'));
    });

    expect(mockChannelIO).toHaveBeenCalledWith('showChannelButton');
  });
});
