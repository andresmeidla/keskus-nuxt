import { NitroFetchRequest } from 'nitropack';
import { Ref } from 'nuxt/dist/app/compat/capi';
import { AsyncData, FetchResult, UseFetchOptions } from 'nuxt/dist/app/composables';
import { KeyOfRes, PickFrom } from 'nuxt/dist/app/composables/asyncData';
import { FetchError } from 'ofetch';

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
  opts?: UseFetchOptions<_ResT, Transform, PickKeys>
): AsyncData<PickFrom<ReturnType<Transform>, PickKeys>, ErrorT | null>;
export function useKeskusFetch<ReqT extends NitroFetchRequest = NitroFetchRequest>(url: Ref<ReqT> | ReqT | (() => ReqT)) {
  return useFetch(url, { headers: useRequestHeaders() as Record<string, string> });
}
