import Immutable from 'immutable';
import PropTypes from 'prop-types';
import * as React from 'react';
import CellMeasurer from './CellMeasurer';
import CellMeasurerCache from './CellMeasurerCache';
import List from '../List';
import styles from './CellMeasurer.example.css';

export default class DynamicHeightList extends React.PureComponent {
  static propTypes = {
    getClassName: PropTypes.func.isRequired,
    list: PropTypes.instanceOf(Immutable.List).isRequired,
    width: PropTypes.number.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      list: [...Array(100).keys()],
    };

    this._cache = new CellMeasurerCache({
      fixedWidth: true,
      minHeight: 50,
      keyMapper: index => this.state.list[index],
    });

    this._rowRenderer = this._rowRenderer.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const newRows = this.state.list.filter(
      value => prevState.list.indexOf(value) < 0,
    );
    const newRowsIndex = newRows.map(value => this.state.list.indexOf(value));

    // console.log(newRowsIndex, Math.min([...newRowsIndex]) - 1);

    newRowsIndex.forEach(index => this._cache.clear(index));
    !!newRowsIndex.length &&
      this._list.recomputeRowHeights(Math.min([...newRowsIndex]) - 1);
  }

  removeAndAddRows(index) {
    const list = [...this.state.list];
    const newValue = Math.max(...list) + 1;
    list.splice(index, 1);
    list.splice(index, 1);
    list.splice(index, 0, newValue);

    console.log(this.state.list, list);
    this.setState({
      list,
    });

    // debugger;
    //
  }

  addRow(index) {
    const list = [...this.state.list];
    list.splice(index + 1, 0, Math.max(...list) + 1);

    this.setState({
      list,
    });

    // debugger;
  }

  removeRow(index) {
    const list = [...this.state.list];
    list.splice(index, 1);
    this.setState({
      list,
    });

    this._list.recomputeRowHeights(index);
  }

  render() {
    const {width} = this.props;

    return (
      <List
        ref={element => {
          this._list = element;
        }}
        className={styles.BodyGrid}
        deferredMeasurementCache={this._cache}
        height={700}
        overscanRowCount={0}
        rowCount={this.state.list.length}
        rowHeight={this._cache.rowHeight}
        rowRenderer={this._rowRenderer}
        width={width}
      />
    );
  }

  _rowRenderer({index, key, parent, style}) {
    const {getClassName, list} = this.props;

    // const datum = list.get(index % list.size);
    // const classNames = getClassName({columnIndex: 0, rowIndex: index});

    // const imageWidth = 300;
    // const imageHeight = datum.size * (1 + index % 3);

    return (
      <CellMeasurer
        cache={this._cache}
        columnIndex={0}
        key={key}
        rowIndex={index}
        parent={parent}>
        {({measure}) => (
          <div style={{...style, border: '1px solid black'}}>
            <div
              className="item"
              style={{
                background: index % 2 ? 'yellow' : ' blue',
                opacity: 0.8,
                minHeight: 50 + this.state.list[index] * 2,
              }}>
              <span>
                {this.state.list[index] + 1} - {52 + this.state.list[index] * 2}
              </span>
              <button onClick={this.removeAndAddRows.bind(this, index)}>
                Remove 2 rows and add 1 row
              </button>
              <button onClick={this.addRow.bind(this, index)}>Add 1 row</button>
              <button onClick={this.removeRow.bind(this, index)}>
                remove 1 row
              </button>
            </div>
          </div>
        )}
      </CellMeasurer>
    );
  }
}
