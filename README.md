# contentful-json-table

A Contentful field extension for the Object field type, designed for creating nice tables.


## Getting started with local development
```bash
npm install
npm run login && npm run configure
npm run start
```
## Requirements
- Node 8 or higher
- NPM 5.2 and higher

## Using the extension in production

- in your contentful space, go to settings > extensions
- click Add extension > Install from GitHub
- enter https://github.com/renrizzolo/contentful-json-table/blob/master/extension.json
- in your content model, add/change a JSON object field
- go to the Appearance tab
- select the UI extension _JSON Table_