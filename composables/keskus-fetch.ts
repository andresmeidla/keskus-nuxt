import { NitroFetchOptions, NitroFetchRequest } from 'nitropack';
import { FetchError } from 'ofetch';

export async function keskusFetch<T extends NitroFetchRequest, Opts extends NitroFetchOptions<T> = NitroFetchOptions<T>>(url: T, options: Opts) {
  try {
    const rsp = await $fetch(url, { ...options, headers: useRequestHeaders() as Record<string, string> } as Opts);
    return rsp;
  } catch (e: any) {
    if (e instanceof FetchError && e.statusCode === 401) {
      // redirect to login
      useRouter().push('/login');
    }
    throw e;
  }
}
