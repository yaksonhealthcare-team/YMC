import * as Sentry from '@sentry/react';
import { create } from 'zustand';

export type AppInfo = {
  type: 'APP_INFO';
  platform: string;
  appId: string | null;
  appVersion: string;
  nativeBuildVersion: string | null;
  runtimeVersion: string | null;
  updateId: string | null;
  sentAt: number;
};

type State = {
  appInfo: AppInfo | null;
  setAppInfo: (info: AppInfo) => void;
};

export const useAppInfoStore = create<State>((set) => ({
  appInfo: null,
  setAppInfo: (info) => {
    set({ appInfo: info });
    Sentry.setTag('app.version', info.appVersion);
  }
}));

export const normalizeAppInfo = (data: any): AppInfo | null => {
  if (!data || data.type !== 'APP_INFO') return null;

  return {
    type: 'APP_INFO',
    platform: typeof data.platform === 'string' ? data.platform : 'unknown',
    appId: typeof data.appId === 'string' ? data.appId : null,
    appVersion: typeof data.appVersion === 'string' ? data.appVersion : '0.0.0',
    nativeBuildVersion: typeof data.nativeBuildVersion === 'string' ? data.nativeBuildVersion : null,
    runtimeVersion: typeof data.runtimeVersion === 'string' ? data.runtimeVersion : null,
    updateId: typeof data.updateId === 'string' ? data.updateId : null,
    sentAt: typeof data.sentAt === 'number' ? data.sentAt : Date.now()
  };
};
