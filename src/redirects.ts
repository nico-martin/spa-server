import { SPAServer } from './index';
import { filterRoute } from './routes';

export const parseRedirects = (
  redirects: Array<SPAServer.Redirect>,
  url: string
): string => {
  const filtered = filterRoute<SPAServer.Redirect>(redirects, url);

  if (filtered) {
    let redirect = filtered.element.to;
    Object.entries(filtered.params).forEach(([key, value]) => {
      redirect = redirect.replace(`:${key}`, value);
    });
    return redirect;
  }
  return '';
};
