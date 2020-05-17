export interface Element {
  regex: RegExp;
  metas: (params: RegExpExecArray) => Promise<Record<string, string>>;
}

export interface Config {
  elements?: Array<Element>;
  port?: number;
}
