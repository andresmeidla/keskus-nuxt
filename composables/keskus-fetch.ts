import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';
import { FetchError } from 'ofetch';

import { Routes } from '~~/lib/routes';
import { store } from '~~/store';

type FetchOptions<T extends NitroFetchRequest, Opts extends NitroFetchOptions<T> = NitroFetchOptions<T>> = { redirectOnError?: boolean } & Opts;

export async function keskusFetch<T extends NitroFetchRequest, Opts extends NitroFetchOptions<T> = NitroFetchOptions<T>>(url: T, options?: FetchOptions<T>) {
  try {
    store.setLoading(true);
    const cookieHeaders = useRequestHeaders(['cookie']);
    const rsp = await $fetch(url, {
      ...options,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onRequest({ request, options }) {
        if (process.server) {
          options.headers = cookieHeaders as Record<string, string>;
        }
      },
      retry: false,
    } as Opts);
    return rsp;
  } catch (e: any) {
    console.error('keskusFetch error', e);
    if (options?.redirectOnError !== false) {
      if (e instanceof FetchError && e.statusCode === 401) {
        // redirect to login
        if (process.client && useRoute().path !== Routes.LOGIN) {
          useRouter().push({ path: Routes.LOGIN, query: { initial: useRoute().path, from: 'fetch', err: 401 } });
        }
      } else if (e instanceof FetchError && e.statusCode === 400) {
        // bad request
        if (process.client && useRoute().path !== Routes.MAIN) {
          useRouter().push({ path: Routes.MAIN, query: { err: 400 } });
        }
      }
    }
    throw e;
  } finally {
    store.setLoading(false);
  }
}
