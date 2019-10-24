import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@contentful/forma-36-react-components/dist/components/Button';
import TableRow from '@contentful/forma-36-react-components/dist/components/Table/TableRow';
import { Cell } from './Cell';

const RowItem = ({ data, readOnly, moveRow, index, tableHeadings, dataLength, cellDefaults }) => {
  const [arrows, showArrows] = useState(false);
  const moveUp = () => moveRow(index, 'up');
  const moveDown = () => moveRow(index, 'down');

  return (
    <>
      {arrows && !readOnly && (
        <div
          onMouseLeave={() => showArrows(false)}
          onMouseEnter={() => showArrows(true)}
          style={{
            display: 'flex',
            position: 'absolute',
            flexDirection: 'column',
            width: 42,
            height: 56,
            marginLeft: -42
          }}>
          <Button disabled={index === 0} icon="ArrowUp" buttonType="naked" onClick={moveUp} />
          <Button
            disabled={index === dataLength - 1}
            icon="ArrowDown"
            buttonType="naked"
            onClick={moveDown}
          />
        </div>
      )}
      <TableRow
        key={index}
        onMouseEnter={() => showArrows(true)}
        onMouseLeave={() => showArrows(false)}>
        {tableHeadings &&
          tableHeadings.map((heading, i) => {
            const row = data[heading.key];
            const { text, ...rest } = row || {};
            const id = `row-${index}-cell-${i}`;
            return (
              <Cell
                readOnly={readOnly}
                isHeading={false}
                id={id}
                key={id}
                text={text}
                headingKey={heading.key}
                rowIndex={index}
                cellIndex={i}
                empty={!text}
                {...cellDefaults}
                {...rest}
              />
            );
          })}
      </TableRow>
    </>
  );
};
RowItem.propTypes = {
  data: PropTypes.object,
  readOnly: PropTypes.bool,
  moveRow: PropTypes.func,
  index: PropTypes.number,
  tableHeadings: PropTypes.array,
  dataLength: PropTypes.number,
  cellDefaults: PropTypes.object
};
export default RowItem;
