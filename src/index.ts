import http from 'http';
import server from './server';
import { readFile, trailingSlashIt, log } from './helpers';
import { applyMetas } from './apply';
import { parseRedirects } from './redirects';
import { parseRoutes } from './routes';

export namespace NodeMetas {
  export interface RouteMetasParams {
    path: string;
    params: Record<string, string> | {};
  }

  export interface Route {
    path: string;
    response?: (
      request: RouteMetasParams
    ) => Promise<Partial<RouteResponse>> | Partial<RouteResponse>;
  }

  export interface RouteResponse {
    metas: Metas;
    statusCode: number;
  }

  export type Metas = Record<string, string>;

  export interface Redirect {
    path: string;
    to: string;
  }

  export interface Config {
    routes?: Array<Route>;
    redirects?: Array<Redirect>;
    port?: number;
    indexFile?: string;
    serveDir?: string;
    onError?: Function;
    defaultStatusCode?: number;
  }

  export interface Handle {
    request: http.IncomingMessage;
    response: http.ServerResponse;
    error: {
      status: number;
      headers: Record<string, string>;
      message: string;
    };
  }
}

const nodeMetas = ({
  routes = [],
  redirects = [],
  port = 8080,
  indexFile = 'index.html',
  serveDir = 'dist/',
  onError = () => {},
  defaultStatusCode = 200,
}: NodeMetas.Config) => {
  const handle = async ({
    request,
    response,
    error,
  }: NodeMetas.Handle): Promise<void> => {
    try {
      /**
       * Redirect early
       */
      const redirect = parseRedirects(redirects, String(request.url));
      if (redirect) {
        log(`redirect ${request.url} to ${redirect}`);
        response.writeHead(302, {
          Location: redirect,
        });
        response.end();
      }

      /**
       * read and manipulate index file
       */
      const template = await readFile(
        `./${trailingSlashIt(serveDir)}${indexFile}`
      );

      const parsed = await parseRoutes(
        routes,
        String(request.url),
        defaultStatusCode
      );
      const index = applyMetas(template, parsed.metas);

      /**
       * send response
       */
      response.writeHead(parsed.statusCode, error.headers);
      response.end(index);
    } catch (err) {
      /**
       * If anything throws, send 500
       */
      onError(err);
      response.writeHead(500);
      log(`ERROR: ${err}`);
      response.end('internal server error');
    }
  };

  server(serveDir, handle).listen(port, () => {
    log('Running on Port: ' + port);
  });
};

export default nodeMetas;
