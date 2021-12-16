import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { load } from 'js-yaml';

const yamlConfigFile = 'validation.yaml';

const validation = () =>
  load(readFileSync(join('./config/', yamlConfigFile), 'utf8'));

export default validation;
