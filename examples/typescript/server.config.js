import fetch from 'node-fetch';

export default {
  routes: [
    {
      path: '/user/:id/',
      response: request => ({
        metas: {
          title: `User ${'id' in request.params ? request.params.id : ''}`,
        },
        statusCode: 203,
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
        }

        return { metas: { title }, statusCode: code };
      },
    },
  ],
  port: 8050,
};
