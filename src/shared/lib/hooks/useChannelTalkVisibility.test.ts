import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createElement } from 'react';
import { MemoryRouter } from 'react-router-dom';

// react-router-dom의 useLocation을 모킹하기 위한 wrapper
const createWrapper = (initialPath: string) => {
  return ({ children }: { children: React.ReactNode }) =>
    createElement(MemoryRouter, { initialEntries: [initialPath] }, children);
};

describe('useChannelTalkVisibility', () => {
  let mockChannelIO: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockChannelIO = vi.fn();
    window.ChannelIO = mockChannelIO as any;
    window.ChannelIOInitialized = false;
  });

  afterEach(() => {
    delete window.ChannelIO;
    delete window.ChannelIOInitialized;
    vi.resetModules();
  });

  it('boot 전에는 showChannelButton/hideChannelButton을 호출하지 않는다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/store')
    });

    expect(mockChannelIO).not.toHaveBeenCalledWith('showChannelButton');
    expect(mockChannelIO).not.toHaveBeenCalledWith('hideChannelButton');
  });

  it('boot 완료 후 /store에서 showChannelButton을 호출한다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/store')
    });

    // boot 전에는 호출 안 됨
    expect(mockChannelIO).not.toHaveBeenCalledWith('showChannelButton');

    // boot 완료 이벤트 발생
    act(() => {
      window.dispatchEvent(new Event('channeltalk:booted'));
    });

    expect(mockChannelIO).toHaveBeenCalledWith('showChannelButton');
  });

  it('boot 완료 후 /mypage에서 showChannelButton을 호출한다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/mypage')
    });

    act(() => {
      window.dispatchEvent(new Event('channeltalk:booted'));
    });

    expect(mockChannelIO).toHaveBeenCalledWith('showChannelButton');
  });

  it('boot 완료 후 /home에서 hideChannelButton을 호출한다', async () => {
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

  it('boot 완료 후 /store/detail 하위 경로에서도 showChannelButton을 호출한다', async () => {
    const { useChannelTalkVisibility } = await import('./useChannelTalkVisibility');

    renderHook(() => useChannelTalkVisibility(), {
      wrapper: createWrapper('/store/detail/123')
    });

    act(() => {
      window.dispatchEvent(new Event('channeltalk:booted'));
    });

    expect(mockChannelIO).toHaveBeenCalledWith('showChannelButton');
  });
});
