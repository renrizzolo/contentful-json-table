import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// had to use cdn for codemirror becuase the
// bundle was too big for Contentful hosting
  // import 'codemirror/lib/codemirror.css';
  // import 'codemirror/theme/material.css';
  // import 'codemirror/addon/lint/lint.css';
  // import 'codemirror/mode/javascript/javascript';
  // import 'codemirror/addon/edit/matchbrackets';
  // import 'codemirror/addon/lint/lint';
  // import 'codemirror/addon/lint/json-lint';
import Paragraph from '@contentful/forma-36-react-components/dist/components/Typography/Paragraph';
import NotificationItem from '@contentful/forma-36-react-components/dist/components/Notification/NotificationItem';
import { Controlled as CodeMirror } from 'react-codemirror2';

const jsonlint = require('jsonlint-mod');
window.jsonlint = jsonlint;

// Incomplete React version of https://github.com/trival/contentful-extensions/blob/master/samples/json-editor/src/js/json-editor.js

const JsonCodemirror = ({ value, options, onBeforeChange, onChange }) => {

  const [message, setMessage] = useState('');
  const [editorValue, setEditorValue] = useState(value);

  // subscribe to value prop changes
  useEffect(() => {
    console.log('received new value prop');

    setEditorValue(value);
  }, [value]);

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
    // why so buggy? :(
    if (value === '') {
      setMessage(''); // don't show invalid message
    } else if (isValidJson(value)) {
      var val = JSON.parse(value);
      // onChange > useEffect will propagate this
      // setEditorValue(JSON.stringify(val));
      setMessage('');
      console.log('setting value');
      console.log('not broken', val);
      onChange(editor, data, val);
    } else {
      var val2 = JSON.stringify(value);
      console.log('broken!', value);
      setEditorValue(val2);
      setMessage('JSON is invalid');
    }
  };

  return (
    <div>
      <Paragraph>Edit the raw JSON at your own risk {`>.<`} <br/> (this feature can be a little buggy when invalid JSON is entered!)</Paragraph>
      {message.length > 0 && (
        <NotificationItem intent="error" hasCloseButton={false}>
          {message}
        </NotificationItem>
      )}
      <CodeMirror
        value={beautify(editorValue)}
        options={options}
        onBeforeChange={(editor, data, value) => {
          changeHandler(editor, data, value);
        }}
        // onChange={(editor, data, value) => {
        //   changeHandler(editor, data, value);
        // }}
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
    mode: 'application/json',
    lineWrapping: true,
    lineNumbers: true,
    viewportMargin: Infinity,
    indentUnit: 4,
    theme: 'material',
    gutters: ['CodeMirror-lint-markers'],
    lint: jsonlint
  }
};

JsonCodemirror.propTypes = {
  onBeforeChange: PropTypes.func,
  onChange: PropTypes.func,
  options: PropTypes.object,
}
export default JsonCodemirror;
