#!/usr/bin/env node

import fs from 'fs';
import nodeMetas from '../index';
import { log } from '../helpers';

const folder = process.cwd();
const config = folder + '/server.config.js';

try {
  let c = {};
  if (!fs.existsSync(config)) {
    log(
      'server.config.js does not exist in project root. Default config will be used instead.'
    );
  } else {
    c = require(config);
  }

  log('starting server..');
  nodeMetas(c);
} catch (e) {
  log(e);
}
