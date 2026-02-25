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

  it('ChannelIO 초기화 전에는 show/hide를 호출하지 않는다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/store')
    });

    expect(mockChannelIO).not.toHaveBeenCalledWith('showChannelButton');
    expect(mockChannelIO).not.toHaveBeenCalledWith('hideChannelButton');
  });

  it('ChannelIO 초기화 후 /store에서 showChannelButton을 호출한다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/store')
    });

    expect(mockChannelIO).not.toHaveBeenCalledWith('showChannelButton');

    // ChannelIO 초기화 시뮬레이션
    window.ChannelIOInitialized = true;

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockChannelIO).toHaveBeenCalledWith('showChannelButton');
  });

  it('ChannelIO 초기화 후 /mypage에서 showChannelButton을 호출한다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/mypage')
    });

    window.ChannelIOInitialized = true;

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockChannelIO).toHaveBeenCalledWith('showChannelButton');
  });

  it('ChannelIO 초기화 후 /home에서 hideChannelButton을 호출한다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/home')
    });

    window.ChannelIOInitialized = true;

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockChannelIO).toHaveBeenCalledWith('hideChannelButton');
    expect(mockChannelIO).toHaveBeenCalledWith('hideMessenger');
  });

  it('초기화 감지 후 polling이 중단된다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/store')
    });

    window.ChannelIOInitialized = true;

    act(() => {
      vi.advanceTimersByTime(500);
    });

    mockChannelIO.mockClear();

    // 추가 polling 시간이 지나도 다시 호출되지 않음
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(mockChannelIO).not.toHaveBeenCalledWith('showChannelButton');
  });

  it('이미 초기화된 상태에서 마운트되면 즉시 동작한다', async () => {
    window.ChannelIOInitialized = true;

    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/store')
    });

    // polling 없이 즉시 체크
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(mockChannelIO).toHaveBeenCalledWith('showChannelButton');
  });
});
