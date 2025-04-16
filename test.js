const fs = require('node:fs');
const aiaToJSON = require('./aiaToJSON');
const content = fs.readFileSync('./samples/Default Actions.aia', 'utf8');

const decode = true;
const actionSet = aiaToJSON(content, decode);

console.log(actionSet);
// console.log(JSON.stringify(actionSet, null, 2));