import serverSideMetas from './lib/index';

const wait = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => resolve(), ms);
  });

serverSideMetas({
  elements: [
    {
      path: '/user/:id/',
      metas: request => {
        return {
          hello: 'id' in request.params ? request.params.id : '',
        };
      },
    },
    {
      path: '/post/:slug/',
      metas: async request => {
        await wait(1000);
        return {
          hello: 'slug' in request.params ? request.params.slug : '',
        };
      },
    },
  ],
});
