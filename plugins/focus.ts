export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('focus', {
    mounted(el) {
      setTimeout(() => el.focus(), 300);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getSSRProps(binding, vnode) {
      // you can provide SSR-specific props here
      return {};
    },
  });
});
