import { match } from 'path-to-regexp';
import cheerio from 'cheerio';

import server from './server';
import { readFile, trailingSlashIt } from './helpers';
import { Config, Handle } from './types';

/**
 * Todo:
 * - move "Parse Metas" and "apply Metas" to their own files
 * - improve "apply metas":
 * - - title
 * - - name vs property
 * - - escape
 *
 * Nice to have:
 * - more capabilities like serve-handler (rewrites, headers, etc)
 */

const serverSideMetas = ({
  elements = [],
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
      let index = await readFile(`./${trailingSlashIt(serveDir)}${indexFile}`);

      // Parse Metas
      let metas = { hello: 'workd' };
      for (let i = 0; i < Object.keys(elements).length; i++) {
        const element = Object.values(elements)[i];
        const urlMatch = match(element.path, { decode: decodeURIComponent });
        const result = urlMatch(String(request.url));

        if (result) {
          const newMetas = await element.metas({
            path: result.path,
            params: result.params,
          });
          metas = { ...metas, ...newMetas };
        }
      }

      // apply Metas
      if (Object.keys(metas).length) {
        const $ = cheerio.load(index);
        Object.entries(metas).map(([key, value]) => {
          $('head').append(`<meta name="${key}" content="${value}">`);
        });
        index = $.html();
      }

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
