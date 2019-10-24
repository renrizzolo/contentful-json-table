import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@contentful/forma-36-react-components/dist/components/TextField';
import Button from '@contentful/forma-36-react-components/dist/components/Button';

export const SettingsMenu = ({
         updateAndClose,
         className,
         colSpan,
         rowSpan,
         el,
         headingKey,
         row,
         id,
         isHeading
       }) => {
         const [state, setState] = useState({ className, colSpan, rowSpan, el });
         console.log(state);
         return (
           <div
             style={{
               width: '100%',
               boxSizing: 'border-box',
               position: 'absolute',
               right: 0,
               top: 56,
               zIndex: 10,
               background: 'white',
               boxShadow: '1px 1px 12px rgba(0,0,0,0.12)',
               padding: '.9375rem 1.25rem'
             }}>
             <TextField
               textInputProps={{ style: styles.input, width: 'small' }}
               formLabelProps={{ style: styles.label }}
               onChange={e => setState({ ...state, className: e.target.value })}
               value={state.className}
               id="className"
               name="className"
               labelText="className"
             />
             <TextField
               textInputProps={{ style: styles.input, width: 'small' }}
               formLabelProps={{ style: styles.label }}
               onChange={e => setState({ ...state, colSpan: e.target.value })}
               value={state.colSpan}
               id="colSpan"
               name="colSpan"
               labelText="colSpan"
             />
             <TextField
               textInputProps={{ style: styles.input, width: 'small', }}
               formLabelProps={{ style: styles.label }}
               onChange={e => setState({ ...state, rowSpan: e.target.value })}
               value={state.rowSpan}
               id="rowSpan"
               name="rowSpan"
               labelText="rowSpan"
             />
             <TextField
               textInputProps={{ style: styles.input, width: 'small' }}
               formLabelProps={{ style: styles.label }}
               onChange={e => setState({ ...state, el: e.target.value })}
               value={state.el}
               id="el"
               name="el"
               labelText="el"
             />
             <Button onClick={() => updateAndClose(state, headingKey, row, isHeading)}>Save</Button>
           </div>
         );
       };

const styles = {
  input: {
    padding: 5,
    marginBottom: 4
  },
  label: { margin: 0, fontSize: 12 }
};

SettingsMenu.propTypes = {
  updateSettings: PropTypes.func,
  showSettingsMenu: PropTypes.func,
  id: PropTypes.string,
  className: PropTypes.string,
  colSpan: PropTypes.string,
  rowSpan: PropTypes.string,
  el: PropTypes.string,
  headingKey: PropTypes.string,
  row: PropTypes.number,
  isHeading: PropTypes.bool
};