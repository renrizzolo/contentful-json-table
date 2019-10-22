import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@contentful/forma-36-react-components';

export const InputButton = ({ onClick, icon, style }) => (
         <IconButton
         iconProps={{className: '', icon, }}
           buttonType="naked"
           size="small"
           icon={icon}
           style={{
            //  width: 32,
             position: 'absolute',
             zIndex: 2,
             right: -10,
             top: 16,
             cursor: 'pointer',
             ...style
           }}
           onClick={onClick}
         />
       );

InputButton.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.string,
  style: PropTypes.object
}