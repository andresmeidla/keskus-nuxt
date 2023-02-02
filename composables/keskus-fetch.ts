import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';
import { FetchError } from 'ofetch';

import { Routes } from '~~/lib/routes';
import { store } from '~~/store';

export async function keskusFetch<T extends NitroFetchRequest, Opts extends NitroFetchOptions<T> = NitroFetchOptions<T>>(url: T, options?: Opts) {
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
    if (e instanceof FetchError && e.statusCode === 401) {
      // redirect to login
      if (useRoute().path !== Routes.LOGIN) {
        useRouter().push({ path: Routes.LOGIN, query: { redirect: window.location.pathname } });
      }
    }
    throw e;
  } finally {
    store.setLoading(false);
  }
}
