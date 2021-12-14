import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as yaml from 'js-yaml';

const yamlConfigFile = 'validation.yaml';

export default () =>
  yaml.load(readFileSync(join('./config/', yamlConfigFile), 'utf8')) as Record<
    string,
    any
  >;
