# contentful JSON Table

Who loves tables? Not me but I'd sure like to be able to have my editors create them inline on Contentful!

A [Contentful](https://contentful.com) field extension for the Object field type, designed for creating nice tables.

Built with [create-contentful-extension](https://github.com/contentful/create-contentful-extension) :heart:

:rotating_light: work in progress!

The extension in use:  
![Contentful JSON table in use](https://github.com/renrizzolo/contentful-json-table/blob/master/json-table-extension.png "Contentful Json Table")

Same as above but in read-only view:  
![Contentful JSON table read-only view](https://github.com/renrizzolo/contentful-json-table/blob/master/read-only-view.png "Contentful Json Table")

## Using the extension in production
- in your contentful space at [app.contentful.com](https://app.contentful.com), go to settings > extensions
- click Add extension > Install from GitHub
- enter https://github.com/renrizzolo/contentful-json-table/blob/master/extension.json
- in your content model, add/change a JSON object field
- go to the Appearance tab
- select the UI extension _JSON Table_

## Data structure

:point_right: I made a [pen](https://codepen.io/renrizzolo/pen/pooeagN) that should transform typical table/csv JSON to work with this extension.  

It goes a little something like this:

![alt text](https://github.com/renrizzolo/contentful-json-table/blob/master/data-img.png "Data structure")


## Usage (React)

This is how I'm using it.  
NB: this could be more simplified:  
- I use hidden keys (starting with __) for e.g a heading with a colspan of 2 that has 2 cells below it, cell 1 would have the heading 1 key, cell 2 would have a __heading 1 key
- I use `React.createElement` in case I want to specify the element with the `el` property


```jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TableCanOverflow = styled.div`
  display: grid;
  > div {
    overflow-x: auto;
    overflow-y: hidden;
  }
`;

const Table = styled.table`
  border-spacing: 0;
  max-width: 100%;
  width: 100%;
  th,
  td {
    padding: 1rem 2rem 1rem 0;
    text-align: left;
    border-bottom: 1px solid rgba(13, 42, 68, 0.1607843137254902);
  }
`;

// table in this calse is 
// childContentful[fieldName]JsonNode from graphql (I think)

const TableFromJson = ({ table }) => {
  // because we don't always know the
  // keys, we parse the stringified
  // json returned by Contentful
  // and pull the table headings
  // from the keys
  const content = table ? JSON.parse(table.internal.content) : {};
  const { data, tableHeadings } = content;

  return (
    <TableCanOverflow>
      <div>
        <Table>
          <thead>
            <tr>
              {tableHeadings &&
                tableHeadings.map(
                  ({ text, ...rest }) =>
                    text &&
                    text.length &&
                    !text.startsWith('__') && (
                      <th key={text} {...rest}>
                        {text && text}
                      </th>
                    )
                )}
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((key, i) => (
                <tr key={i}>
                  {tableHeadings.map((heading, i) => {
                    const row = key[heading.text];
                    const { text, el, heading: head, ...rest } = row || {};

                    return (
                      text &&
                      !text.startsWith('__') &&
                      React.createElement(
                        el || 'td',
                        {
                          key: i,
                          dangerouslySetInnerHTML: {
                            __html: text || '',
                          },
                          ...rest,
                        },
                        null
                      )
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </TableCanOverflow>
  );
};

TableFromJson.propTypes = {
  table: PropTypes.shape({
    internal: PropTypes.object.isRequired,
  }),
};

export default TableFromJson;
```

## Getting started with local development
```bash
npm install
npm run login && npm run configure
npm run start
```
## Requirements
- Node 8 or higher
- NPM 5.2 and higher