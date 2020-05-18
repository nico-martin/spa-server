import { Metas } from './types';
import cheerio from 'cheerio';
import { escapeHtml } from './helpers';

const applyMetas = (template: string, metas: Metas): string => {
  if (!Object.keys(metas).length) {
    return template;
  }
  const $ = cheerio.load(template);
  Object.entries(metas).map(([key, value]) => {
    value = escapeHtml(value);
    if (key === 'title') {
      const $title = $('title');
      $title.length
        ? $title.text(value)
        : $('head').append(`<title>${value}</title>`);
    } else {
      const $meta = $(`head meta[name="${key}"]`);
      $meta.length
        ? $meta.attr('content', value)
        : $('head').append(`<meta name="${key}" content="${value}">`);
    }
  });
  return $.html();
};

export default applyMetas;
