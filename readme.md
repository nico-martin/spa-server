# Server Side Metas

> **"Server Side Metas"** is a working title. I'm looking for a better name once I figured out where this is going 😁

> It's a very early preview. So a lot of things are not yet final.

Server Side Metas is a NodeJS lib that starts a production ready NodeJS Webserver, serves a specific dir and allows you to manipulate the meta headers inside the index.html.

This is super useful if you only need to add server-side rendered meta tags but you don't want to render the whole app serverside.

## Yes, but why ?!?
I had to use NextJS in a bunch of projects and it's not that I don't like next, I'm just not a big fan of the strict structure. Your whole app needs to follow the NextJS logic for the server-side renderer to work. But in a lot of cases I only really needed it for some meta tags (for example for social media sharing). That's why this library follows a much simpler approach. This being said it works with any kind of framework. It just takes the public dir, serves the files and adds meta tags for routes that are defined under "routes".
## API

At the core this lib provides the possibility to define routes and to pass a function (sync or async) that returns an object of { name: content } meta tags.
```js
{
  path: '/',
  metas: request => {
    return {
      'name-of-the-meta': 'content of the meta',
      url: '/',
    }
  },
}
```

### Full example

```js
import serverSideMetas from './lib/index';
import fetch from 'node-fetch';

serverSideMetas({
  routes: [
    {
      path: '/user/:id/',
      metas: request => ({
        'using-id': 'id' in request.params ? request.params.id : '',
        hello: 'world',
      }),
    },
    {
      path: '/post/:id/',
      metas: async request => { // can be async
        // ! You should add error handling. Works for example for http://localhost:8080/post/1500/
        const resp = await (
          await fetch(
            `https://sayhello.ch/wp-json/wp/v2/posts/${request.params.id}/`
          )
        ).json();

        return {
          title: resp.title.rendered,
        };
      },
    },
  ],
  port: 3000, // optional
  indexFile: 'index.gtml', // optional
  serveDir: 'dist/', // optional
});
```
    
