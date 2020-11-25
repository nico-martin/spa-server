import { SPAServer } from '../index';

export { default as readFile } from './readFile';

export const untrailingSlashIt = (str: string): string =>
  str.replace(/\/$/, '');

export const trailingSlashIt = (str: string): string =>
  untrailingSlashIt(str) + '/';

export const unprecedingSlashIt = (str: string): string =>
  str.replace(/^\//, '');

export const precedingSlashIt = (str: string): string =>
  '/' + unprecedingSlashIt(str);

export const escapeHtml = (unsafe: string): string =>
  unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const logLevels: Record<SPAServer.LogLevel, SPAServer.LogLevel> = {
  SYSTEM: 'SYSTEM',
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  DEBUG: 'DEBUG',
};

export const log = (
  text: string,
  level: SPAServer.LogLevel = logLevels.ERROR
) => {
  const levelKey = Object.values(logLevels).indexOf(global.logLevel);
  const validKeys = Object.values(logLevels).splice(0, levelKey + 1);
  if (validKeys.indexOf(level) !== -1) {
    console.log(
      `node-metas${level === logLevels.SYSTEM ? '' : ` ${level}`}: ${text}`
    );
  }
};

export const normalizePath = (text: string) => trailingSlashIt(text);

export const stringifyObject = (object: Record<string, any>) =>
  Object.entries(object)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join(', ');
