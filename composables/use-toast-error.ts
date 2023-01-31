import Toastify from 'toastify-js';

export const useToastError = (rsp: Error & { data?: any }) => {
  console.error('Error', rsp.message, JSON.stringify(rsp.data, null, 2));
  if (process.client) {
    Toastify({
      text: `<h1>${rsp.message}</h1>`,
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
