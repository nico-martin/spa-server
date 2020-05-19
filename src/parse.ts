import { match } from 'path-to-regexp';
import { NodeMetas } from './index';

const parseMetas = async (
  routes: Array<NodeMetas.Route>,
  url: string
): Promise<NodeMetas.Metas> => {
  let metas = {};
  for (let i = 0; i < Object.keys(routes).length; i++) {
    const route = Object.values(routes)[i];
    const urlMatch = match(route.path, { decode: decodeURIComponent });
    const result = urlMatch(url);

    if (result) {
      const params: NodeMetas.RouteMetasParams = {
        path: result.path,
        params: result.params,
      };

      const newMetas = await route.metas(params);
      metas = { ...metas, ...newMetas };
    }
  }
  return metas;
};

export default parseMetas;
