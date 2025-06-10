# AIA to JSON Converter

Converts Adobe Illustrator action schema to JSON. Should be able to parse any action set that can be loaded into the Actions Panel.

Takes only two parameters:
- `content:` string in proper `aia` format.
- `decode:` boolean property that controls whether or not to decode hex and decimal encoded values.

```js
const content = fs.readFileSync('./samples/Default Actions.aia', 'utf8');
const decode = true;
const actionSet = aiaToJSON(content, decode);
```

Test on sample
```js
node ./test.js
```

#### See details here: [https://moody4.github.io/blog/en/aiaToJson](https://moody4.github.io/blog/en/posts/aia-to-json/)