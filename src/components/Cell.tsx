import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, TableCell, Table } from '@contentful/forma-36-react-components';
import { InputButton } from './InputButton';
import { SettingsMenu } from './SettingsMenu';
export const Cell = ({
  id,
  isHeading,
  headingKey,
  text,
  rowIndex,
  cellIndex,
  showSettings,
  hideSettings,
  setCellValue,
  showSettingsMenu,
  updateSettings,
  setChanging,
  handleFocus,
  changing,
  settings,
  settingsMenu,
  empty,
  readOnly,
  ...rest
}) => {
  const { id: currentId } = changing;
  return readOnly ? (
    <TableCell {...rest} dangerouslySetInnerHTML={{ __html: text ? text : '&nbsp'}} />
  ) : (
    <TableCell
      {...rest}
      key={id}
      style={{ position: 'relative', backgroundColor: settingsMenu === id ? '#d3dce0' : undefined }}
      onMouseLeave={hideSettings}
      onMouseEnter={() => showSettings(id)}>
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
          setChanging({ headingKey, rowIndex, id, isHeading }), hideSettings();
        }}
      />
      {currentId === id && (
        <InputButton
          icon="CheckCircle"
          onClick={() => setCellValue(headingKey, rowIndex, id)}
        />
      )}
      {settings === id && currentId !== id && (
        <InputButton
          icon={settingsMenu === id ? 'Close' : 'Settings'}
          onClick={() => showSettingsMenu(id)}
          style={{ right: 5 }}
        />
      )}
      {settingsMenu === id && (
        <SettingsMenu
          updateSettings={updateSettings}
          showSettingsMenu={showSettingsMenu}
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
  showSettings: PropTypes.func,
  hideSettings: PropTypes.func,
  setCellValue: PropTypes.func,
  showSettingsMenu: PropTypes.func,
  updateSettings: PropTypes.func,
  setChanging: PropTypes.func,
  handleFocus: PropTypes.func,
  changing: PropTypes.object,
  settings: PropTypes.string,
  settingsMenu: PropTypes.string,
  empty: PropTypes.bool,
};