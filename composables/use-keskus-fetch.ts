import type { NitroFetchRequest } from 'nitropack';
import type { Ref } from 'nuxt/dist/app/compat/capi';
import type { AsyncData, KeyOfRes, PickFrom } from 'nuxt/dist/app/composables/asyncData';
import { FetchError } from 'ofetch';

import type { FetchResult, UseFetchOptions } from '#app';
import { Routes } from '~~/lib/routes';
import { store } from '~~/store';

/* super complex type but needed for the api type infers */
export function useKeskusFetch<
  ResT = void,
  ErrorT = FetchError,
  ReqT extends NitroFetchRequest = NitroFetchRequest,
  _ResT = ResT extends void ? FetchResult<ReqT> : ResT,
  Transform extends (res: _ResT) => any = (res: _ResT) => _ResT,
  PickKeys extends KeyOfRes<Transform> = KeyOfRes<Transform>
>(
  request: Ref<ReqT> | ReqT | (() => ReqT),
  options?: UseFetchOptions<_ResT, Transform, PickKeys, ReqT> & { redirectOnError?: boolean }
): AsyncData<PickFrom<ReturnType<Transform>, PickKeys>, ErrorT | null> {
  store.setLoading(true);
  const cookieHeaders = useRequestHeaders(['cookie']);
  const rsp = useFetch(request, {
    ...options,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onRequest({ request, options }) {
      if (process.server) {
        options.headers = cookieHeaders as Record<string, string>;
      }
    },
  } as UseFetchOptions<_ResT, Transform, PickKeys, ReqT>);
  return rsp
    .catch((e: any) => {
      console.error('useKeskusFetch error', e);
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
    })
    .finally(() => {
      store.setLoading(false);
    }) as AsyncData<PickFrom<ReturnType<Transform>, PickKeys>, ErrorT | null>;
}
