const KEY = 'clipboard';

const stringify = data => JSON.stringify(data);
const parse = data => JSON.parse(data);

const intialClipboardState = [{}];

const get = (all = false) => {
  let data = parse(
    localStorage.getItem(KEY) || stringify(intialClipboardState)
  );

  return all ? data : data.slice(0, data.length - 1);
};

const bootstrap = () =>
  localStorage.setItem(KEY, stringify(intialClipboardState));

const init = () => {
  if (!get()) bootstrap();

  return get();
};

const clear = () => localStorage.setItem(KEY, intialClipboardState);

const save = clip => {
  const clippings = get(true);
  clippings.unshift(clip);
  localStorage.setItem(KEY, stringify(clippings));
};

const add = data => {
  let updated = false;
  let clippings = get(true);

  if (clippings[0].clip !== data.clip) {
    save(data);
    updated = true;
  }

  return Promise.resolve(updated ? get() : null);
};

export const clipboard = {
  init,
  clear,
  add,
  get
};
