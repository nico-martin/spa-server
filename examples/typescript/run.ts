import nodeMetas from '../../lib'; // should be 'node-metas' if imported from npm
import fetch from 'node-fetch';

nodeMetas({
  routes: [
    {
      path: '/user/:id/',
      metas: request => ({
        'using-id': 'id' in request.params ? request.params.id : '',
        hello: 'world',
      }),
    },
    {
      path: '/user/5/',
    },
    {
      path: '/user/5/add/',
    },
    {
      path: '/user/5/:action/',
    },
    {
      path: '/post/:id/',
      metas: async request => {
        const id = 'id' in request.params ? request.params.id : 0;
        let metas = {};
        try {
          const resp = await (
            await fetch(`https://sayhello.ch/wp-json/wp/v2/posts/${id}/`)
          ).json();
          metas = {
            title: resp.title.rendered,
          };
        } catch (error) {
          console.log('Error for /post/:id/');
        }
        return metas;
      },
    },
  ],
  redirects: [
    {
      path: '/nutzer/:id/',
      to: '/user/:id/',
    },
  ],
});
