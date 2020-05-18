import http from 'http';

export interface Element {
  path: string;
  metas: (request: {
    path: string;
    params: Record<string, string> | {};
  }) => Promise<Record<string, string>> | Record<string, string>;
}

export interface Config {
  elements?: Array<Element>;
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
