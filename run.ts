import serverSideMetas from './src/index';

const wait = (ms: number) =>
  new Promise(resolve => {
    setTimeout(() => resolve(), ms);
  });

serverSideMetas({
  elements: [
    {
      regex: /\/world\/([0-9]*)/,
      metas: async (
        params: RegExpExecArray
      ): Promise<Record<string, string>> => {
        await wait(1000);
        return {
          hello: params[1],
        };
      },
    },
    {
      regex: /\/hallo\/([a-z]*)/,
      metas: async (
        params: RegExpExecArray
      ): Promise<Record<string, string>> => {
        await wait(1000);
        return {
          hello: params[1],
        };
      },
    },
  ],
});
