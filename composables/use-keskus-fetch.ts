import type { UseFetchOptions } from '#app';
import type { NitroFetchRequest, TypedInternalResponse, AvailableRouterMethod as _AvailableRouterMethod } from 'nitropack';
import { store } from '~/store';

type AvailableRouterMethod<R extends NitroFetchRequest> = _AvailableRouterMethod<R> | Uppercase<_AvailableRouterMethod<R>>;
type FetchResult<ReqT extends NitroFetchRequest, M extends AvailableRouterMethod<ReqT>> = TypedInternalResponse<ReqT, unknown, Lowercase<M>>;
type KeysOf<T> = Array<T extends T ? (keyof T extends string ? keyof T : never) : never>;

export function useKeskusFetch<
  ReqT extends NitroFetchRequest = NitroFetchRequest,
  ResT = void,
  Method extends AvailableRouterMethod<ReqT> = ResT extends void
    ? 'get' extends AvailableRouterMethod<ReqT>
      ? 'get'
      : AvailableRouterMethod<ReqT>
    : AvailableRouterMethod<ReqT>,
  _ResT = ResT extends void ? FetchResult<ReqT, Method> : ResT,
  DataT = _ResT,
  PickKeys extends KeysOf<DataT> = KeysOf<DataT>,
  DefaultT = null,
>(url: Ref<ReqT> | ReqT | (() => ReqT), opts?: UseFetchOptions<_ResT, DataT, PickKeys, DefaultT, ReqT, Method>) {
  store.setLoading(true);
  const rsp = useFetch(url, {
    onResponseError: useErrorHandling,
    onResponse: () => store.setLoading(false),
    ...opts,
    headers: { ...(useRequestHeaders() as Record<string, string>), ...opts?.headers },
  });
  return rsp;
}
