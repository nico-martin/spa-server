import fs from 'fs';
import http from 'http';
import server from './server';
import {
  readFile,
  trailingSlashIt,
  log,
  logLevels,
  normalizePath,
  stringifyObject,
} from './helpers';
import { applyMetas } from './apply';
import { parseRedirects } from './redirects';
import { parseRoutes } from './routes';

export namespace SPAServer {
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
    headers: Headers;
    statusCode: number;
  }

  export type Metas = Record<string, string>;
  export type Headers = Record<string, string>;

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
    errorPagesDir?: string;
    onError?: Function;
    defaultStatusCode?: number;
    logLevel?: LogLevel;
    serverOptions?: ServerOptions;
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

  export type LogLevel = 'DEBUG' | 'WARNING' | 'ERROR' | 'SYSTEM';

  export interface ServerOptions {
    key?: string;
    cert?: string;
    pfx?: string;
    passphrase?: string;
  }
}

declare global {
  namespace NodeJS {
    interface Global {
      logLevel: SPAServer.LogLevel;
    }
  }
}

const spaServer = async ({
  routes = [],
  redirects = [],
  port = 8080,
  indexFile = 'index.html',
  serveDir = 'dist/',
  errorPagesDir = 'error-pages/',
  onError = () => {},
  defaultStatusCode = 200,
  logLevel = 'ERROR',
  serverOptions = {},
}: SPAServer.Config) => {
  global.logLevel = logLevel;

  const handle = async ({
    request,
    response,
    error,
  }: SPAServer.Handle): Promise<void> => {
    try {
      const url = normalizePath(String(request.url));
      /**
       * Redirect early
       */
      const redirect = parseRedirects(redirects, url);
      if (redirect) {
        log(`redirect ${request.url} to ${redirect}`, logLevels.DEBUG);
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

      log('------------------', logLevels.DEBUG);
      log(`starting ${url}`, logLevels.DEBUG);
      const parsed = await parseRoutes(routes, url, defaultStatusCode);
      const index = applyMetas(template, parsed.metas);
      log(`statuscode ${parsed.statusCode}`, logLevels.DEBUG);
      log(`metas { ${stringifyObject(parsed.metas)} }`, logLevels.DEBUG);
      log(`headers { ${stringifyObject(parsed.headers)} }`, logLevels.DEBUG);
      log('------------------', logLevels.DEBUG);

      /**
       * send response
       */
      response.writeHead(parsed.statusCode, {
        ...parsed.headers,
        ...error.headers,
      });
      response.end(index);
    } catch (err) {
      /**
       * If anything throws, send 500
       */
      onError(err);
      response.writeHead(500);
      log(err, logLevels.ERROR);
      let template = await readFile(__dirname + '../../error-pages/500.html');
      if (fs.existsSync(trailingSlashIt(errorPagesDir) + '500.html')) {
        template = await readFile(trailingSlashIt(errorPagesDir) + '500.html');
      }
      response.end(template);
    }
  };

  const options = {
    ...serverOptions,
    ...('key' in serverOptions
      ? { key: fs.readFileSync(String(serverOptions.key)) }
      : {}),
    ...('cert' in serverOptions
      ? { cert: fs.readFileSync(String(serverOptions.cert)) }
      : {}),
  };

  const isSSL = 'key' in options && 'cert' in options;

  server(serveDir, handle, options).listen(port, () => {
    log(`Running on Port ${port}`, logLevels.SYSTEM);
    log(
      `${isSSL ? 'https://' : 'http://'}localhost:${port}/`,
      logLevels.SYSTEM
    );
  });
};

export default spaServer;
