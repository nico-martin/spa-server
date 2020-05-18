import serverSideMetas from './lib/index';

const wait = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => resolve(), ms);
  });

serverSideMetas({
  elements: [
    {
      regex: /\/world\/([0-9]*)/,
      metas: params => {
        return {
          hello: params[1],
        };
      },
    },
    {
      regex: /\/hello\/([a-z]*)/,
      metas: async params => {
        await wait(1000);
        return {
          hello: params[1],
        };
      },
    },
  ],
});
