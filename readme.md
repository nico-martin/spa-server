# SPA Server

"SPA Server" is a NodeJS library that starts a production ready NodeJS Webserver, that mostly serves static files and also allows you to manipulate any non-static response.

This is super useful if you you want to control the response headers or meta tags of the returned html file.

## Install

```
yarn add @nico-martin/spa-server
```
```
npm install @nico-martin/spa-server
```

## Ok, but why?!?

I love JavaScript applications. But in general, they have one problem. If all the logic happens on the client-side, there are several negative side effects.

I know some frameworks will render everything on the server. But I never really warmed to it. Does it really make sense to have the logic for building the page on the server and then still send the same logic to the client? I doubt that.

Furthermore, frameworks like Next.JS or Nuxt.JS require a rather rigid structure of pages and components.

When I look at my projects, the requirements for server-side rendering are relatively simple. In most cases I only needed it for some meta tags (for example for social media sharing) and a clean status code designation. That's why this library follows a much simpler approach. This being said it works with any kind of framework. It just takes the public dir, serves the files and adds meta tags for routes that are defined under "routes".
## API

In essence, the library provides the ability to define your own routes and create a function (synchronous or asynchronous) that returns a status code and an object of HTML metas

```js
{
  path: '/',
  response: request => {
    return {
      metas: {
        'name-of-the-meta': 'content of the meta',
        url: '/',
      },
      statusCode: 200
    }
  },
}
```

### Full example

```js
import spaServer from './lib/index';
import fetch from 'node-fetch';

spaServer({
  routes: [
    {
      path: '/user/:id/',
      response: request => ({    
        metas: {
          'user-id': 'id' in request.params ? request.params.id : '',
          hello: 'world',
          custom: {
            tag: 'link',
            attributes: {
              rel: 'canonical',
              href: 'some-url'
            }       
          }         
        },
        statusCode: 200
      }),
    },
    {
      path: '/post/:id/',
      response: async request => {
        const id = 'id' in request.params ? request.params.id : 0;
        let metas = {};
        let statusCode = 200;
        try {
          const resp = await (
            await fetch(`https://sayhello.ch/wp-json/wp/v2/posts/${id}/`)
          ).json();
          metas = {
            title: resp.title.rendered,
          };
        } catch (error) {
          console.log('Error for /post/:id/');
          statusCode = 404;
        }
        return {
          metas,
          statusCode
        };
      },
    },
  ],
  redirects: [
    {
      path: '/nutzer/:id/',
      to: '/user/:id/',
    },
  ],
  port: 3000, // default 8080
  indexFile: 'index.gtml',
  serveDir: 'dist/',
  errorPagesDir: 'path/to/custom/error/templates/',
  onError: e => console.log(e),
  logLevel: 'ERROR', // 'DEBUG' | 'WARNING' | 'ERROR' | 'SYSTEM'
  serverOptions: {}, // additional options for the node-http server
});
```

### server.config.js

"SPA Server" comes with a handy single executable. `npm spa-server` (or `yarn spa-server`) will start the server with default configurations. Additionally it looks for a `server.config.js` file that expects one default export with all the arguments from above.

```js
// server.config.js
import fetch from 'node-fetch';

export default {
  routes: [
    {
      path: '/myapi/',
      response: async request => {
        const resp = await (
          await fetch(`https://myapi.com/`)
        ).json();
        return {
          metas: {
            title: resp.title,
          },
        }
      },
    },
  ],
  port: 8888,
};
```
## Config
### `routes`
An Array of routes. Each route consists of a path and a response.

The `path` is defined as a string that will be parsed to a Regex where the matches will be passed to the response.

The `response` is a function that returns the `metas`, `headers` and the `statusCode` as an object.
```js
export default {
  routes: [
    {
      path: '/:slug/',
      response: request => {
        return {
          metas: {
            title: 'Slug ' + request.params.slug,
          },
          headers: {
            'my-header': 'Hello World'
          },
          statusCode: 200
        }
      },
    }
  ]
};
```
`metas`can also be an async function where `await` can be used.

### `redirects` 
With `redirects` sources and targets where the server immediately returns a 302 status with the target as Location header.

Both, source (`path`) and target (`to`) can contain variables:
```js
export default {
  redirects: [
    {
      path: '/my/source/',
      to: '/my/target/',
    },
    {
      path: '/nutzer/:id/', // /nutzer/5/
      to: '/user/:id/', // /user/5/
    },
  ],
};
```

### `port`
Default port is 8080 but can easily be changed to a different port.

### `indexFile`
In general, most Single Page Applications have an `index.html` file as an entry point. If for whatever reason your setup has a a different file, it cn be adjusted as well.

### `serverDir`
By default, "SPA Server" expects the whole application inside the `dist/` folder. But can be any othe folder.

### `errorPagesDir`
When the server experiences difficulties, it will throw an error page. But you can esily set a custom page yourself. Let's assume you have a page for a 500 error inside en `error/` folder:

File: `error/500.html`:
```js
export default {
  errorPagesDir: 'error/',
};
```

### `onError`
A callback that will be called whenever anything trows and e 500 will be returned.

### `logLevel`
"SPA Server" is riddled with different logs on specific levels: `'DEBUG' | 'WARNING' | 'ERROR' | 'SYSTEM'`.  
default: `ERROR`

### `serverOptions`
If you want to serve your content over HTTPS (SSL) you can pass the path to the `key` and the `cert` within the `serverOptions`:
```js
export default {
  serverOptions: {
    key: 'path/to/ssl/cert.key',
    cert: 'path/to/ssl/cert.crt',
  },
};
```
