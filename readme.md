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
  metas: request => {
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
      metas: request => ({    
        metas: {
          'user-id': 'id' in request.params ? request.params.id : '',
          hello: 'world',
        },
        statusCode: 200
      }),
    },
    {
      path: '/post/:id/',
      metas: async request => {
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
  redirects: [ // optional
    {
      path: '/nutzer/:id/',
      to: '/user/:id/',
    },
  ],
  port: 3000, // optional => default 8080
  indexFile: 'index.gtml', // optional
  serveDir: 'dist/', // optional
  errorPagesDir: 'path/to/custom/error/templates/', // optional
  onError: e => console.log(e), // optional
  logLevel: 'ERROR', // optional 'DEBUG' | 'WARNING' | 'ERROR' | 'SYSTEM'
  serverOptions: {}, // additional options for the node-http server
});
```
