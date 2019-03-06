const KEY = 'clipboard';

const stringify = data => JSON.stringify(data);
const parse = data => JSON.parse(data);

const intialClipboardState = stringify([]);

const get = () => parse(localStorage.getItem(KEY));

const save = (data = intialClipboardState) =>
  localStorage.setItem(KEY, stringify(data));

const init = () => {
  if (!get()) {
    save();
  }
  return get();
};

const clear = () => localStorage.setItem(KEY, intialClipboardState);

const add = clip => {
  let updated = false;
  let clippings = get();

  if (clippings[0] !== clip) {
    clippings.unshift(clip);
    save(clippings);
    updated = true;
  }

  return Promise.resolve(updated ? clippings : null);
};

export const clipboard = {
  init,
  clear,
  add,
  get
};
