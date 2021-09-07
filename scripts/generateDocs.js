'use strict';
const fs = require('fs');
const glob = require('glob');
const YAML = require('js-yaml');
const extendify = require('extendify');
const chalk = require('chalk');
const config = require('config');
console.log(chalk.green('Executing docs generator...'));
let hostname;
const yamlFile = 'apiDocs/swagger/swagger.yaml';

const collageSwaggerYAMLs = () => {
  hostname = config.get('host') + ':' + config.get('port');
  console.log(hostname);
  const files = glob.sync('apiDocs/**/*.y*ml');
  const contents = files.map(f => {
    console.log(chalk.grey('Scanning - %s'), f);
    return YAML.load(fs.readFileSync(f).toString());
    // doc.host = process.argv[2] || doc.host;
  });
  const extend = extendify({
    inPlace: false,
    isDeep: true,
  });
  const mergedYamls = contents.reduce(extend, {});
  mergedYamls.host = hostname;
  return mergedYamls;
}


const generateSwaggerYAML = () => {
  console.log('Generating swagger.yaml...');
  const mergedYamls = collageSwaggerYAMLs();
  try {
    fs.writeFileSync(yamlFile, YAML.dump(mergedYamls));
  } catch (err) {
    console.log(chalk.red('Swagger docs generation failed !!!. check errorLogs...'));
    throw err;
  }
  console.log(chalk.green('Created - %s'), yamlFile);
}

module.exports = {
  collageSwaggerYAMLs
}



if (require.main === module) {
  generateSwaggerYAML();
  process.exit(0);
}