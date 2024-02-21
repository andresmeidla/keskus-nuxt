import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack';
import { store } from '~/store';

export const keskusFetch = <R extends NitroFetchRequest = NitroFetchRequest, T = unknown, O extends NitroFetchOptions<R> = NitroFetchOptions<R>>(
  request: R,
  opts?: O,
) => {
  store.setLoading(true);
  const rsp = $fetch<T, R, O>(request, {
    onResponseError: useErrorHandling,
    onResponse: () => store.setLoading(false),
    ...(opts ?? ({} as O)),
    headers: { ...(useRequestHeaders() as Record<string, string>), ...opts?.headers },
  });
  return rsp;
};
