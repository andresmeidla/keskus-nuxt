import { Routes } from '~/lib/routes';

export default defineNuxtRouteMiddleware((to) => {
  const authCookie = useAuthCookie();
  if (to.fullPath.startsWith(Routes.LOGIN)) {
    return;
  }

  if (!authCookie.value) {
    if (!to.fullPath.startsWith('/api')) {
      return navigateTo(Routes.LOGIN);
    }
  }
  /*
  // skip middleware on server
  if (process.server) return
  // skip middleware on client side entirely
  if (process.client) return
  // or only skip middleware on initial client load
  const nuxtApp = useNuxtApp()
  if (process.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) return
  */
});
