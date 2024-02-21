import { reactive } from 'vue';

export const store = reactive({
  loading: {
    value: false,
  } as {
    value: boolean;
  },
  setLoading(loading: boolean) {
    this.loading.value = loading;
  },
});
