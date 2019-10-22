import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-light.css';
import { Paragraph } from '@contentful/forma-36-react-components';
import NotificationItem from '@contentful/forma-36-react-components/dist/components/Notification/NotificationItem';

// Incomplete React version of https://github.com/trival/contentful-extensions/blob/master/samples/json-editor/src/js/json-editor.js

const JsonCodemirror = ({ value, options, onBeforeChange, onChange }) => {
  const [message, setMessage] = useState('');

  const isValidJson = str => {
    var parsed;
    try {
      parsed = JSON.parse(str);
    } catch (e) {
      return false;
    }
    // An object or array is valid JSON
    if (typeof parsed !== 'object') {
      return false;
    }
    return true;
  };

  // Takes an object and returns a pretty-printed JSON string
  const beautify = obj => {
    if (obj === null || obj === undefined) {
      return '';
    } else {
      return JSON.stringify(obj, null, '\t');
    }
  };
  const changeHandler = (editor, data, value) => {
    if (value === '') {
      setMessage(''); // don't show invalid message
    } else if (isValidJson(value)) {
      var val = JSON.parse(value);
      setMessage('');
      onChange(editor, data, val);
    } else {
      setMessage('JSON is invalid');
    }
  };
  return (
    <div>
      <Paragraph>Edit the raw JSON at your own risk {`>.<`}</Paragraph>
      {message.length > 0 && (
        <NotificationItem intent="error" hasCloseButton={false}>
          {message}
        </NotificationItem>
      )}
      <CodeMirror
        value={beautify(value)}
        options={options}
        // onBeforeChange={(editor, data, value) => {
        //   if (isValidJson(value)) {
        //     onBeforeChange(editor, data, value)
        //   }
        // }}
        onChange={(editor, data, value) => {
          changeHandler(editor, data, value);
        }}
      />
    </div>
  );
};

JsonCodemirror.defaultProps = {
  onBeforeChange: () => {},
  onChange: () => {},
  options: {
    matchBrackets: true,
    autoCloseBrackets: true,
    mode: { name: 'javascript', json: true },
    lineWrapping: true,
    lineNumbers: true,
    viewportMargin: Infinity,
    indentUnit: 4,
    theme: 'base16-light'
  }
};

JsonCodemirror.propTypes = {
  onBeforeChange: PropTypes.func,
  onChange: PropTypes.func,
  options: PropTypes.object,
}
export default JsonCodemirror;
