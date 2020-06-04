import { SPAServer } from './index';
import { match } from 'path-to-regexp';

export const filterRoute = <T extends { path: string }>(
  routes: Array<T>,
  url: string
): {
  route: string;
  params: object;
  element: T;
} | null => {
  const filtered = routes.map(route => {
    if (route.path === url) {
      return {
        route: route.path,
        params: {},
        element: route,
      };
    } else {
      const urlMatch = match(route.path, { decode: decodeURIComponent });
      const result = urlMatch(url);
      if (result) {
        return {
          route: result.path,
          params: result.params,
          element: route,
        };
      }
    }
    return null;
  });

  const defined = filtered.filter(e => e);
  return defined.length ? defined[0] : null;
};

export const parseRoutes = async (
  routes: Array<SPAServer.Route>,
  url: string,
  defaultStatusCode: number
): Promise<SPAServer.RouteResponse> => {
  const route = filterRoute<SPAServer.Route>(routes, url);
  const processed = route?.element?.response
    ? await route.element.response({
        path: route.route,
        params: route.params,
      })
    : {
        metas: {},
        headers: {},
        statusCode: defaultStatusCode,
      };
  return {
    metas: processed.metas || {},
    headers: processed.headers || {},
    statusCode: processed.statusCode || defaultStatusCode,
  };
};
