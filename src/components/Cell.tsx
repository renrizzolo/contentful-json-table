import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TableCell from '@contentful/forma-36-react-components/dist/components/Table/TableCell';
import TextInput from '@contentful/forma-36-react-components/dist/components/TextInput';
import { InputButton } from './InputButton';
import { SettingsMenu } from './SettingsMenu';
export const Cell = ({
  id,
  isHeading,
  headingKey,
  text,
  rowIndex,
  cellIndex,
  setCellValue,
  updateSettings,
  setChanging,
  handleFocus,
  changing,
  empty,
  readOnly,
  ...rest
}) => {
  const [settingsIcon, showSettingsIcon ] = useState(false);
  const [settingsMenu, showSettingsMenu] = useState(false);

  const toggleSettingsIcon = () => showSettingsIcon(!settingsIcon)
  const toggleSettingsMenu = () => showSettingsMenu(!settingsMenu);
  const updateAndClose = (...args) => {
    updateSettings(...args); 
    showSettingsMenu(false);
    showSettingsIcon(false);
  }
  const { id: currentId } = changing;
if (!empty && text.startsWith('__')) return null;
  return readOnly ? (
    <TableCell {...rest} dangerouslySetInnerHTML={{ __html: text ? text : '&nbsp' }} />
  ) : (
    <TableCell
      {...rest}
      key={id}
      style={{ position: 'relative', backgroundColor: settingsMenu ? '#d3dce0' : undefined }}
      onMouseEnter={() => showSettingsIcon(true)}
      onMouseLeave={() => showSettingsIcon(false)}
      >
      <TextInput
        style={{
          border: 'none',
          background: 'none',
          padding: '.25rem',
          color: empty ? (currentId === id ? 'black' : 'silver') : 'black'
        }}
        onFocus={empty ? handleFocus : () => null}
        width="medium"
        value={empty ? 'empty' : text}
        id={id}
        onChange={() => {
          setChanging({ headingKey, rowIndex, id, isHeading }), toggleSettingsIcon();
        }}
      />
      {currentId === id && (
        <InputButton icon="CheckCircle" onClick={() => setCellValue(headingKey, rowIndex, id)} />
      )}
      {settingsIcon && currentId !== id && (
        <InputButton
          icon={settingsMenu ? 'Close' : 'Settings'}
          onClick={toggleSettingsMenu}
          style={{ right: 5 }}
        />
      )}
      {settingsMenu && (
        <SettingsMenu
          updateAndClose={updateAndClose}
          isHeading={isHeading}
          headingKey={headingKey}
          row={rowIndex}
          id={id}
          {...rest}
        />
      )}
    </TableCell>
  );
};

Cell.propTypes = {
  id: PropTypes.string,
  isHeading: PropTypes.bool,
  headingKey: PropTypes.string,
  text: PropTypes.string,
  rowIndex: PropTypes.number,
  cellIndex: PropTypes.number,
  setCellValue: PropTypes.func,
  updateSettings: PropTypes.func,
  setChanging: PropTypes.func,
  handleFocus: PropTypes.func,
  changing: PropTypes.object,
  empty: PropTypes.bool,
};