export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('focus', {
    mounted(el) {
      setTimeout(() => el.focus(), 300);
    },
    getSSRProps() {
      return {};
    },
  });
});
