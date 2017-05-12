const fs = require('fs');
const paths = require('../config/paths');

module.exports = function liquidLoader(content) {
  // assumption is that quoted asset_url are not variables, but actual assets.
  const regex = /{{ '(.*)' \| asset_url }}/g;

  let match = regex.exec(content);

  while (match !== null) {
    const fileName = match[1];
    const filePath = `${paths.src}/assets/images/${fileName}`;
    const file = fs.readFileSync(filePath);

    this.emitFile(fileName, file);

    match = regex.exec(content);
  }

  return content;
};
