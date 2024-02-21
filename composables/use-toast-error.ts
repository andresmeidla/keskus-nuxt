import Toastify from 'toastify-js';

export const useToastError = (err: Error & { data?: any }) => {
  // eslint-disable-next-line no-console
  console.error('Error', err.message, JSON.stringify(err.data, null, 2));
  if (process.client) {
    const text =
      err.data?.statusCode === 401
        ? '<img src="/gandalf.jpg" alt="gandalf" style="height:10rem;width:auto" />'
        : `<h1>${err.data?.message ?? err.message}</h1>`;
    Toastify({
      text,
      gravity: 'top',
      position: 'right',
      stopOnFocus: true,
      duration: 5000,
      newWindow: true,
      className: 'rounded-lg shadow-lg',
      style: {
        background: '#ff7777',
      },
      escapeMarkup: false,
    }).showToast();
  }
};
