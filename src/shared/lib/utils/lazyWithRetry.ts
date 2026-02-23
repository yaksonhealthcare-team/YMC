import { ComponentType, lazy } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LazyImportFn = () => Promise<{ default: ComponentType<any> }>;

async function retryImport(importFn: LazyImportFn, retries: number): Promise<{ default: ComponentType<any> }> {
  try {
    return await importFn();
  } catch {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 1000));
      return retryImport(importFn, retries - 1);
    }
    window.location.reload();
    throw new Error('Chunk load failed after retries');
  }
}

export function lazyWithRetry(importFn: LazyImportFn, retries = 2) {
  return lazy(() => retryImport(importFn, retries));
}
