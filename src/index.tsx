import * as React from 'react';
import { render } from 'react-dom';
import {
  Table,
  TableRow,
  TableBody,
  TableHead,
  Note,
  Button,
  Paragraph,
  CheckboxField,
  FieldGroup
} from '@contentful/forma-36-react-components';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import JsonCodemirror from './components/JsonCodemirror';
import { Cell } from './components/Cell';

interface AppProps {
  sdk: FieldExtensionSDK;
}

interface AppState {
  value?: { data: any[]; tableHeadings: any[] };
  changing?: object;
  readOnly: boolean;
  settings?: string;
  settingsMenu?: string;
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    console.log(props.sdk.field.getValue());

    super(props);
    this.state = {
      changing: {},
      readOnly: false,
      settings: null,
      settingsMenu: null,
      value: props.sdk.field.getValue() || {
        data: [{ 'Heading 1': { text: 'col 1' } }],
        tableHeadings: [{ key: 'Heading 1' }]
      }
    };
  }

  detachExternalChangeHandler: Function | null = null;

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
    window.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
    window.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = e => {
    //  @todo: revert input value on esc
    // if (e.key === 'Escape' && this.state.changing.id) {
    //   const { value } = this.state;
    //   this.setState({
    //     changing: {},
    //     value
    //   });
    // }

    if (e.key === 'Enter' && this.state.changing.id) {
      this.state.changing.isHeading
        ? this.setHeadingValue(
            this.state.changing.headingKey,
            this.state.changing.rowIndex,
            this.state.changing.id
          )
        : this.setCellValue(
            this.state.changing.headingKey,
            this.state.changing.rowIndex,
            this.state.changing.id
          );
      this.setState({
        changing: {}
      });
    }
  };

  onExternalChange = value => {
    console.log('external change', value);
    if (value) this.setState({ value });
  };

  update = async () => {
    console.log('running update');

    const { value } = this.state;
    if (value) {
      await this.props.sdk.field.setValue(value);
    } else {
      await this.props.sdk.field.removeValue();
    }
  };

  addRow = async () => {
    const { data, tableHeadings } = this.getData();
    let newRow = {};
    console.log(newRow);
    data.push(newRow);
    const val = data;

    this.setState(
      {
        value: {
          data: val,
          tableHeadings
        }
      },
      await this.update()
    );
  };

  removeRow = async () => {
    const { data, tableHeadings } = this.getData();

    data.pop();

    this.setState(
      {
        value: {
          data,
          tableHeadings
        }
      },
      await this.update()
    );
  };

  addColumn = async () => {
    const { data, tableHeadings } = this.getData();
    const headingName = `new column ${tableHeadings.length + 1}`;
    let newHeading = { key: headingName };
    tableHeadings.push(newHeading);
    data.map(d => (d[headingName] = { text: '' }));
    this.setState(
      {
        value: {
          data,
          tableHeadings
        }
      },
      await this.update()
    );
  };

  removeColumn = async () => {
    const { data, tableHeadings } = this.getData();
    const toDelete = tableHeadings[tableHeadings.length - 1];
    console.log(toDelete);

    toDelete && data.map(d => delete d[toDelete.key]);

    tableHeadings.pop();

    this.setState(
      {
        value: {
          data,
          tableHeadings
        }
      },
      await this.update()
    );
  };

  setHeadingValue = async (key: string, i: number) => {
    const val = document.getElementById(`heading-${i}`).value;
    const { data, tableHeadings } = this.getData();
    const originalHeading = tableHeadings[i].key;
    tableHeadings[i].key = val;

    const test = data.map(d => {
      console.log(d);

      this.renameObjectKey(d, originalHeading, val);
    });
    console.log(test);
    this.setState(
      {
        value: {
          data,
          tableHeadings
        },
        changing: {}
      },
      await this.update()
    );
  };

  // update/replace cell data with an @obj
  setCell = async (key: string, row: number, obj: object, isHeading: boolean) => {
    const { data, tableHeadings } = this.getData();

    if (isHeading) {
      console.log(tableHeadings[row]);
      tableHeadings[row] = {
        ...tableHeadings[row],
        ...obj
      };
    } else {
      console.log(data[row], data[row][key]);
      if (!data[row][key]) {
        return;
      }
      data[row][key] = {
        ...data[row][key],
        ...obj
      };
    }

    this.setState(
      {
        value: {
          data,
          tableHeadings
        },
        changing: {}
      },
      await this.update()
    );
  };

  // update single @property of cell data
  setCellValue = async (
    key: string,
    row: number,
    id: string,
    property: string = 'text',
    isHeading: boolean
  ) => {
    const val = document.getElementById(id).value;
    console.log(key, val);

    const { data, tableHeadings } = this.getData();

    if (isHeading) {
      console.log(tableHeadings[row]);
      tableHeadings[row][property] = val;
    } else {
      console.log(data[row], data[row][key]);
      if (!data[row][key]) {
        return;
      }
      data[row][key][property] = val;
    }

    this.setState(
      {
        value: {
          data,
          tableHeadings
        },
        changing: {}
      },
      await this.update()
    );
  };

  showSettings = (id: string) => {
    this.setState({
      settings: id
    });
  };

  hideSettings = () => this.setState({ settings: null });

  showSettingsMenu = (id: string) => {
    if (this.state.settingsMenu === id) {
      this.hideSettingsMenu();
      return;
    }
    this.setState({
      settingsMenu: id
    });
  };
  hideSettingsMenu = () => this.setState({ settingsMenu: null });

  updateSettings = (data: object, key: string, row: number, isHeading: boolean) => {
    console.log(data, key, row);
    this.setCell(key, row, data, isHeading);
    // this.setCellValue(key, row, data, data, isHeading);
  };

  showArrows = index => {
    this.setState({
      arrows: index
    });
  };

  hideArrows = () => {
    this.setState({
      arrows: null
    });
  };

  moveRow = async (index: number, direction: string) => {
    const { data, tableHeadings } = this.getData();
    const row = data[index];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    data.splice(index, 1);
    data.splice(newIndex, 0, row);

    this.setState(
      {
        value: {
          data,
          tableHeadings
        }
      },
      await this.update()
    );
  };

  getData = () => {
    const { value } = this.state;
    if (value) {
      return value;
    }
    return { data: [], tableHeadings: [] };
  };

  setChanging = changing => this.setState({ changing });

  setReadOnly = () => this.setState({ readOnly: !this.state.readOnly });

  // https://stackoverflow.com/a/14592469
  renameObjectKey = (obj: object, oldKey: string, newKey: string) => {
    if (oldKey !== newKey) {
      Object.defineProperty(obj, newKey, Object.getOwnPropertyDescriptor(obj, oldKey));
      delete obj[oldKey];
    }
    return obj;
  };

  handleFocus = event => event.target.select();

  render = () => {
    console.log('va', this.state.value);

    const { data, tableHeadings } = this.state.value;
    const cellDefaults = {
      handleFocus: this.handleFocus,
      showSettings: this.showSettings,
      showSettingsMenu: this.showSettingsMenu,
      hideSettings: this.hideSettings,
      updateSettings: this.updateSettings,
      setCellValue: this.setCellValue,
      setChanging: this.setChanging,
      changing: this.state.changing,
      settings: this.state.settings,
      settingsMenu: this.state.settingsMenu
    };
    return (
      <div>
        <div style={{ marginLeft: 42 }}>
          <FieldGroup>
            <CheckboxField
              labelText={'Read-only view'}
              name="readonly"
              checked={this.state.readOnly}
              value="yes"
              onChange={this.setReadOnly}
              labelIsLight={!this.state.readOnly}
              //  inputProps={{
              //    onBlur: action('onBlur'),
              //    onFocus: action('onFoucs')
              //  }}
              id="readonly-checkbox"
            />
          </FieldGroup>
          {!data && <Note>Data object missing</Note>}
          {!tableHeadings && <Note>Table headings object missing</Note>}
          <Table>
            <TableHead>
              <TableRow>
                {tableHeadings &&
                  tableHeadings.map(
                    ({ key, ...rest }, i) =>
                      !key.startsWith('__') && (
                        <Cell
                          readOnly={this.state.readOnly}
                          isHeading
                          text={key}
                          headingKey={key}
                          id={`heading-${i}`}
                          rowIndex={i}
                          // cellIndex={i}
                          {...cellDefaults}
                          setCellValue={this.setHeadingValue}
                          {...rest}
                        />
                      )
                  )}
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map((key, index) => (
                  <>
                    {this.state.arrows === index && !this.state.readOnly && (
                      <div
                        style={{
                          display: 'flex',
                          position: 'absolute',
                          flexDirection: 'column',
                          width: 42,
                          height: 56,
                          marginLeft: -42
                        }}>
                        <Button
                          disabled={index === 0}
                          icon="ArrowUp"
                          buttonType="naked"
                          onClick={() => this.moveRow(index, 'up')}
                        />
                        {/*  <Button icon="Close" size="small" buttonType="naked"/> */}
                        <Button
                          disabled={index === data.length - 1}
                          icon="ArrowDown"
                          buttonType="naked"
                          onClick={() => this.moveRow(index, 'down')}
                        />
                      </div>
                    )}
                    <TableRow key={index} onMouseEnter={() => this.showArrows(index)}>
                      {tableHeadings &&
                        tableHeadings.map((heading, i) => {
                          const row = key[heading.key];
                          const { text, ...rest } = row || {};

                          return text && !text.startsWith('__') ? (
                            <Cell
                              readOnly={this.state.readOnly}
                              isHeading={false}
                              id={`row-${index}-cell-${i}`}
                              text={text}
                              headingKey={heading.key}
                              rowIndex={index}
                              cellIndex={i}
                              {...cellDefaults}
                              {...rest}
                            />
                          ) : (
                            !text && (
                              <Cell
                                readOnly={this.state.readOnly}
                                isHeading={false}
                                id={`row-${index}-cell-${i}`}
                                headingKey={heading.key}
                                rowIndex={index}
                                cellIndex={i}
                                empty
                                {...cellDefaults}
                                {...rest}
                              />
                            )
                          );
                        })}
                    </TableRow>
                  </>
                ))}
            </TableBody>
          </Table>
          <br />
          <Paragraph>Hint: press Enter to update cell data</Paragraph>
          <br />
          <Button icon="Plus" onClick={this.addRow}>
            Row
          </Button>{' '}
          <Button onClick={this.removeRow} buttonType="muted">
            - row
          </Button>{' '}
          <Button icon="Plus" onClick={this.addColumn}>
            column
          </Button>{' '}
          <Button onClick={this.removeColumn} buttonType="muted">
            - column
          </Button>
        </div>
        <br />
        <JsonCodemirror
          value={this.state.value}
          onChange={(editor, data, value) => {
            console.log(value);
            this.setState({ value });
          }}
        />
      </div>
    );
  };
}

init(sdk => {
  render(<App sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
if (module.hot) {
  module.hot.accept();
}
