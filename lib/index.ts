import { Config, Handle } from './types';

import server from './server';
import { readFile, trailingSlashIt } from './helpers';
import parseMetas from './parse';
import applyMetas from './apply';

const serverSideMetas = ({
  routes = [],
  port = 8080,
  indexFile = 'index.html',
  serveDir = 'dist/',
}: Config) => {
  const handle = async ({
    request,
    response,
    error,
  }: Handle): Promise<void> => {
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
      console.log(`ERROR: ${err}`);
      response.end('internal server error');
    }
  };

  server(serveDir, handle).listen(port, () => {
    console.log('Running on Port: ' + port);
  });
};

export default serverSideMetas;
