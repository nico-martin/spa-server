import nodeMetas from '../../lib'; // should be 'node-metas' if imported from npm
import fetch from 'node-fetch';

nodeMetas({
  routes: [
    {
      path: '/user/:id/',
      response: request => ({
        metas: {
          title: `User ${'id' in request.params ? request.params.id : ''}`,
        },
        headers: {
          'my-custom-header': 'id' in request.params ? request.params.id : '',
        },
      }),
    },
    {
      path: '/post/:id/',
      response: async request => {
        const id = 'id' in request.params ? request.params.id : 0;
        let title = '';
        let code = 200;

        try {
          const resp = await (
            await fetch(`https://sayhello.ch/wp-json/wp/v2/posts/${id}/`)
          ).json();
          title = resp.title.rendered;
        } catch (error) {
          code = 404;
          title = `Post ID "${id}" not found`;
          console.log('Error for /post/:id/');
        }

        return { metas: { title }, statusCode: code };
      },
    },
  ],
  redirects: [
    {
      path: '/nutzer/:id/',
      to: '/user/:id/',
    },
  ],
  logLevel: 'DEBUG',
});
