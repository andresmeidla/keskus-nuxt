import { FetchError } from 'ofetch';
import Toastify from 'toastify-js';

function parseJson(data: string) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
}

const DefaultToastOpts: Toastify.Options = {
  gravity: 'top',
  position: 'right',
  stopOnFocus: true,
  duration: 10000,
  newWindow: true,
  className: 'rounded-lg shadow-lg',
  style: {
    background: '#ff7777',
  },
  escapeMarkup: false,
};

export const fetchErrorHandling = (e: Error) => {
  Toastify({
    ...DefaultToastOpts,
    text: e instanceof FetchError ? `${e.statusMessage}:<br/><pre>${JSON.stringify(parseJson(e.data), null, 2)}</pre>` : `Unknown error: ${e.message}`,
  }).showToast();
  throw e;
};
