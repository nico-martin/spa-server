#!/usr/bin/env node

import fs from 'fs';
import nodeMetas from '../index';
import { log } from '../helpers';

const folder = process.cwd();
const config = folder + '/server.config.js';

try {
  if (!fs.existsSync(config)) {
    throw 'server.config.js does not exist in project root';
  }

  log('starting server..');
  const c = require(config);
  nodeMetas(c);
} catch (e) {
  log(e);
}
