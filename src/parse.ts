import { match } from 'path-to-regexp';
import { Route, Metas } from './types';

const parseMetas = async (
  routes: Array<Route>,
  url: string
): Promise<Metas> => {
  let metas = {};
  for (let i = 0; i < Object.keys(routes).length; i++) {
    const route = Object.values(routes)[i];
    const urlMatch = match(route.path, { decode: decodeURIComponent });
    const result = urlMatch(url);

    if (result) {
      const newMetas = await route.metas({
        path: result.path,
        params: result.params,
      });
      metas = { ...metas, ...newMetas };
    }
  }
  return metas;
};

export default parseMetas;
