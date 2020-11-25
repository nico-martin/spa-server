import { SPAServer } from './index';
import cheerio from 'cheerio';
import { escapeHtml } from './helpers';

export const applyMetas = (
  template: string,
  metas: SPAServer.Metas
): string => {
  if (!Object.keys(metas).length) {
    return template;
  }
  const $ = cheerio.load(template);
  Object.entries(metas).map(([key, value]) => {
    let normalized: SPAServer.MetaObject = {
      tag: key,
      attributes: {},
    };

    let $meta = $('head [empty]');
    if (key === 'title' && typeof value === 'string') {
      $meta = $('head title');
      normalized.content = escapeHtml(value);
    } else if (typeof value === 'string') {
      $meta = $(`head meta[name="${key}"]`);
      normalized.tag = 'meta';
      normalized.attributes['name'] = key;
      normalized.attributes['content'] = value;
    } else {
      normalized = value;
    }

    if ($meta.length) {
      $meta.remove();
    }

    const attributes: string = Object.entries(normalized.attributes)
      .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
      .join(' ');

    if (normalized.content) {
      $('head').append(
        `<${normalized.tag} ${attributes}>${normalized.content}</${normalized.tag}>`
      );
    } else {
      $('head').append(`<${normalized.tag} ${attributes}>`);
    }
  });
  return $.html();
};
