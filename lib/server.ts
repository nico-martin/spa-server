import http from 'http';
import staticServer from 'node-static';
import { untrailingSlashIt } from './helpers';

export default (
  port: number,
  serveDir: string
): Promise<{
  request: http.IncomingMessage;
  response: http.ServerResponse;
  error: {
    status: number;
    headers: Record<string, string>;
    message: string;
  };
}> => {
  const file = new staticServer.Server(`./${untrailingSlashIt(serveDir)}`);
  return new Promise(resolve => {
    http
      .createServer((request, response) => {
        request
          .addListener('end', () => {
            file.serve(request, response, error => {
              if (error) {
                resolve({
                  request,
                  response,
                  // @ts-ignore
                  error,
                });
              }
            });
          })
          .resume();
      })
      .listen(port);
  });
};
