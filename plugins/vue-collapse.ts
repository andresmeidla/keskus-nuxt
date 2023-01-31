import { Collapse } from 'vue-collapsed';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Collapse', Collapse);
});
