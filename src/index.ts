import server from './server';
import { readFile, trailingSlashIt, log } from './helpers';
import parseMetas from './parse';
import applyMetas from './apply';
import http from 'http';

export namespace NodeMetas {
  export interface RouteMetasParams {
    path: string;
    params: Record<string, string> | {};
  }

  export interface Route {
    path: string;
    metas: (
      request: RouteMetasParams
    ) => Promise<Record<string, string>> | Record<string, string>;
  }

  export interface Config {
    routes?: Array<Route>;
    port?: number;
    indexFile?: string;
    serveDir?: string;
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

  export type Metas = Record<string, string>;
}

const nodeMetas = ({
  routes = [],
  port = 8080,
  indexFile = 'index.html',
  serveDir = 'dist/',
}: NodeMetas.Config) => {
  const handle = async ({
    request,
    response,
    error,
  }: NodeMetas.Handle): Promise<void> => {
    try {
      const template = await readFile(
        `./${trailingSlashIt(serveDir)}${indexFile}`
      );
      const metas = await parseMetas(routes, String(request.url));
      const index = applyMetas(template, metas);

      response.writeHead(200, error.headers);
      response.end(index);
    } catch (err) {
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
