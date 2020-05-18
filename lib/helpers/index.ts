export { default as readFile } from './readFile';
export const untrailingSlashIt = (str: string) => str.replace(/\/$/, '');
export const trailingSlashIt = (str: string) => untrailingSlashIt(str) + '/';
