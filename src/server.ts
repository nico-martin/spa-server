import http from 'http';
import https from 'https';
import staticServer from 'node-static';
import { log, logLevels, untrailingSlashIt } from './helpers';
import { SPAServer } from './index';

export default (
  serveDir: string,
  handleError: Function,
  options: SPAServer.ServerOptions | {}
): http.Server => {
  const file = new staticServer.Server(`./${untrailingSlashIt(serveDir)}`);
  const handleResponse = (
    request: http.IncomingMessage,
    response: http.ServerResponse
  ) => {
    request
      .addListener('end', () =>
        file.serve(request, response, async error =>
          error
            ? handleError({
                request,
                response,
                // @ts-ignore
                error,
              })
            : log(`Static file served: ${request.url}`, logLevels.DEBUG)
        )
      )
      .resume();
  };

  if (('key' in options && 'cert' in options) || 'pfx' in options) {
    return https.createServer(options, (request, response) =>
      handleResponse(request, response)
    );
  }

  return http.createServer((request, response) =>
    handleResponse(request, response)
  );
};
