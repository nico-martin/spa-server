import http from 'http';
import staticServer from 'node-static';
import { log, logLevels, untrailingSlashIt } from './helpers';

export default (serveDir: string, handleError: Function): http.Server => {
  const file = new staticServer.Server(`./${untrailingSlashIt(serveDir)}`);
  return http.createServer((request, response) => {
    request
      .addListener('end', () => {
        file.serve(request, response, async error => {
          if (error) {
            handleError({
              request,
              response,
              // @ts-ignore
              error,
            });
          } else {
            log(`Static file served: ${request.url}`, logLevels.DEBUG);
          }
        });
      })
      .resume();
  });
};
