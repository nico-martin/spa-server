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
  ],
  port: 8888,
};
