<script>
import { computed, defineComponent, h, onBeforeUnmount, ref } from 'vue';

import { useNuxtApp } from '#app';
import { store } from '~/store';

export default defineComponent({
  name: 'LoadingIndicator',
  props: {
    throttle: {
      type: Number,
      default: 200,
    },
    duration: {
      type: Number,
      default: 2e3,
    },
    height: {
      type: Number,
      default: 3,
    },
    color: {
      type: String,
      default: 'repeating-linear-gradient(to right, hsl(11deg 100% 52%) 0%, #2C977F 50%, hsl(11deg 100% 62%) 100%) 0% 0% / 100%',
    },
  },
  setup(props) {
    const indicator = useLoadingIndicator({
      duration: props.duration,
      throttle: props.throttle,
    });
    const nuxtApp = useNuxtApp();
    nuxtApp.hook('page:start', indicator.start);
    nuxtApp.hook('page:finish', indicator.finish);
    const stopWatch = watch(store.loading, (loading) => {
      if (loading.value) {
        indicator.start();
      } else {
        indicator.finish();
      }
    });
    onBeforeUnmount(() => {
      indicator.clear();
      stopWatch();
    });

    return () =>
      h('div', {
        class: 'nuxt-loading-indicator',
        style: {
          position: 'fixed',
          top: 0,
          right: 0,
          left: 0,
          pointerEvents: 'none',
          width: `${indicator.progress.value}%`,
          height: `${props.height}px`,
          opacity: indicator.isLoading.value ? 1 : 0,
          background: props.color,
          backgroundSize: `${(100 / indicator.progress.value) * 100}% auto`,
          transition: 'width 0.1s, height 0.4s, opacity 0.4s',
          zIndex: 999999,
        },
      });
  },
  data: function () {
    return {
      indicator: null,
    };
  },
  methods: {
    start() {
      this.indicator.start();
    },
    finish() {
      this.indicator.finish();
    },
    clear() {
      this.indicator.clear();
    },
  },
});
function useLoadingIndicator(opts) {
  const progress = ref(0);
  const isLoading = ref(false);
  const step = computed(() => 1e4 / opts.duration);
  let _timer = null;
  let _throttle = null;
  function start() {
    clear();
    progress.value = 0;
    isLoading.value = true;
    if (opts.throttle) {
      if (process.client) _throttle = setTimeout(_startTimer, opts.throttle);
    } else {
      _startTimer();
    }
  }
  function finish() {
    progress.value = 100;
    _hide();
  }
  function clear() {
    clearInterval(_timer);
    clearTimeout(_throttle);
    _timer = null;
    _throttle = null;
  }
  function _increase(num) {
    progress.value = Math.min(100, progress.value + num);
  }
  function _hide() {
    clear();
    if (process.client) {
      setTimeout(() => {
        isLoading.value = false;
        setTimeout(() => {
          progress.value = 0;
        }, 400);
      }, 500);
    }
  }
  function _startTimer() {
    if (process.client) {
      _timer = setInterval(() => {
        _increase(step.value);
      }, 100);
    }
  }
  return {
    progress,
    isLoading,
    start,
    finish,
    clear,
  };
}
</script>
