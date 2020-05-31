#!/usr/bin/env node

import fs from 'fs';
import nodeMetas from '../index';
import { log } from '../helpers';

const folder = process.cwd();
let configFile = 'server.config.js';
if (process.argv.length >= 3) {
  configFile = process.argv[2];
}
const config = folder + '/' + configFile;

try {
  let c = {};
  if (!fs.existsSync(config)) {
    log(
      'server.config.js does not exist in project root. Default config will be used instead.'
    );
  } else {
    c = require(config).default;
  }

  log('starting server..');
  nodeMetas(c);
} catch (e) {
  log(e);
}
