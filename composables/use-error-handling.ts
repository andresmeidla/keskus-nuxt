import { FetchError } from 'ofetch';
import { Routes } from '~/lib/routes';

export function useErrorHandling(err: unknown) {
  if (!err) {
    return;
  }
  if ((err as FetchError).statusCode === 401) {
    // redirect to login
    if (process.client && useRoute().path !== Routes.LOGIN) {
      useRouter().push({ path: Routes.LOGIN, query: { initial: useRoute().path, from: 'fetch', err: 401 } });
    }
  } else if ((err as FetchError).statusCode === 400) {
    // bad request
    if (process.client && useRoute().path !== Routes.MAIN) {
      useRouter().push({ path: Routes.MAIN, query: { err: 400 } });
    }
  } else if ((err as FetchError).statusCode === 404) {
    throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true });
  }
}
