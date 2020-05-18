import http from 'http';

export interface Route {
  path: string;
  metas: (request: {
    path: string;
    params: Record<string, string> | {};
  }) => Promise<Record<string, string>> | Record<string, string>;
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
