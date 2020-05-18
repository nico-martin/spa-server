import server from './server';
import { readFile, trailingSlashIt } from './helpers';
import cheerio from 'cheerio';
import { Config } from './types';

const serverSideMetas = ({
  elements = [],
  port = 8080,
  indexFile = 'index.html',
  serveDir = 'dist/',
}: Config) =>
  server(port, serveDir).then(async ({ request, response, error }) => {
    try {
      let index = await readFile(`./${trailingSlashIt(serveDir)}${indexFile}`);

      // Parse Metas
      let metas = {};
      for (let i = 0; i < Object.keys(elements).length; i++) {
        const element = Object.values(elements)[i];
        const result = element.regex.exec(String(request.url));
        if (result) {
          const newMetas = await element.metas(result);
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
  });
export default serverSideMetas;
