import Toastify from 'toastify-js';

export type ToastType = 'success' | 'error';
const colors = new Map<ToastType, string>([
  ['error', '#ff7777'],
  ['success', '#52FA7C'],
]);

type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export const useToast = (opts: Required<Toastify.Options & { type?: ToastType }, 'text'>) => {
  Toastify({
    gravity: 'top',
    position: 'right',
    stopOnFocus: true,
    duration: 5000,
    newWindow: true,
    className: 'rounded-lg shadow-lg',
    style: {
      background: (opts.type && colors.has(opts.type) && colors.get(opts.type)) || '#52FA7C',
    },
    ...opts,
  }).showToast();
};
