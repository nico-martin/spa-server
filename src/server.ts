import http from 'http';
import staticServer from 'node-static';
const file = new staticServer.Server('./dist');

export default (
  port: number
): Promise<{
  request: http.IncomingMessage;
  response: http.ServerResponse;
  error: {
    status: number;
    headers: Record<string, string>;
    message: string;
  };
}> =>
  new Promise(resolve => {
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
