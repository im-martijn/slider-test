// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import Col from './Col';
import Slider from './Slider';

type Props = {
  cols: Number,
  gutterSize: Number,
};

const grid = {
  gutter: 30,
  colCount: 24,
};

class Section extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      rowSize: 1200,
      colSizes: this.getInitialColSizes(1200, props.cols, props.gutterSize),
      initialColSizes: this.getInitialColSizes(1200, props.cols, props.gutterSize),
      sliderOffsets: this.getInitalSliderOffsets(1200, props.cols, props.gutterSize),
    };
    this.colRefs = [];
  }

  static defaultProps = {};

  calculateNewColSize = (currentColSize, deltaSize, rowSize) => {
    return currentColSize + 100 * deltaSize / rowSize;
  };

  onStop = (x, index) => {
    this.setState(state => {
      const newState = Object.assign({}, state);
      const colSizes = newState.colSizes;
      const initialColSizes = newState.initialColSizes;
      colSizes[index] = this.calculateNewColSize(initialColSizes[index], x, this.getRowSize());
      colSizes[index + 1] = this.calculateNewColSize(initialColSizes[index + 1], -x, this.getRowSize());
      return newState;
    });
  };

  onChange = (x, index) => {
    const maxX =
      (this.state.colSizes[index] + this.state.colSizes[index + 1]) * this.state.rowSize / 100 +
      grid.gutter -
      (this.state.rowSize - (grid.colCount - 1) * grid.gutter) / grid.colCount -
      this.state.colSizes[x >= 0 ? index : index + 1] * this.state.rowSize / 100;
    const xMin = Math.min(Math.max(x, -maxX), maxX);
    console.debug(
      '%c colSizes',
      'font-weight: bold; font-size: 1em; background: white; color: red; padding: 0.5em 0;',
      this.state.colSizes[index] + this.state.colSizes[index + 1]
    );
    console.debug(
      '%c xMin',
      'font-weight: bold; font-size: 1em; background: white; color: red; padding: 0.5em 0;',
      xMin
    );
    console.debug(
      '%c maxX',
      'font-weight: bold; font-size: 1em; background: white; color: red; padding: 0.5em 0;',
      maxX
    );
    this.setState(state => {
      const newState = Object.assign({}, state);
      const colSizes = newState.colSizes;
      const initialColSizes = newState.initialColSizes;
      colSizes[index] = this.calculateNewColSize(initialColSizes[index], xMin, this.getRowSize());
      colSizes[index + 1] = this.calculateNewColSize(initialColSizes[index + 1], -xMin, this.getRowSize());
      this.updateSliderOffsets(this.state.rowSize);
      return newState;
    });
  };

  getRowSize = () => {
    const node = ReactDOM.findDOMNode(this.rowRef);
    if (node) {
      return node.clientWidth;
    }
    return 0;
  };

  setRowSize = rowSize => {
    this.setState({ rowSize });
  };

  componentDidMount = () => {
    const rowSize = this.getRowSize();
    this.setRowSize(rowSize);
    this.setState({ colSizes: this.getInitialColSizes(rowSize, this.props.cols, this.props.gutterSize) });
    this.setState({ initialColSizes: this.getInitialColSizes(rowSize, this.props.cols, this.props.gutterSize) });
    this.setState({ sliderOffsets: this.getInitalSliderOffsets(rowSize, this.props.cols, this.props.gutterSize) });
  };

  getInitialColSizes = (rowSize, colCount, gutterSize) => {
    const initialColSizes = [];
    for (let i = 0; i < colCount; i++) {
      initialColSizes.push(100 * ((rowSize - (colCount - 1) * gutterSize) / colCount) / rowSize);
    }
    return initialColSizes;
  };

  getInitalSliderOffsets = (rowSize, colCount, gutterSize) => {
    const colSizes = this.getInitialColSizes(rowSize, this.props.cols, gutterSize);
    const offsets = colSizes.reduce((offsets, colSize, index, colSizes) => {
      let newOffsets = offsets;
      const lastOffset = index > 0 ? offsets[index - 1] : 0;
      if (index !== colSizes.length - 1) {
        newOffsets.push(100 * (gutterSize * (index === 0 ? 0 : 1) + rowSize * (colSize + lastOffset) / 100) / rowSize);
      }
      return newOffsets;
    }, []);
    return offsets;
  };

  updateSliderOffsets = rowSize => {
    this.setState({
      sliderOffsets: this.state.sliderOffsets.map((sliderOffset, index) => {
        return this.calculateSliderOffset(index, rowSize);
      }),
    });
  };

  calculateSliderOffset = (index, rowSize) => {
    const node = ReactDOM.findDOMNode(this.colRefs[index]);
    if (node) {
      return 100 * (node.clientLeft + node.clientWidth) / rowSize;
    }
    return 0;
  };

  render() {
    const renderSlider = (index, colSizes) => {
      if (index < colSizes.length - 1) {
        return (
          <Slider
            key={`slider-${index}`}
            onChange={this.onChange}
            onStop={this.onStop}
            initalValue={0}
            index={index}
            offset={this.state.sliderOffsets[index]}
          />
        );
      }
      return null;
    };

    console.debug(
      '%c state',
      'font-weight: bold; font-size: 1em; background: white; color: red; padding: 0.5em 0;',
      this.state
    );

    return (
      <div className="row" ref={ref => (this.rowRef = ref)}>
        {this.state.colSizes.map((colSize, index, arr) => {
          return (
            <div
              key={`colSize-${index}`}
              className="col"
              style={{ flexBasis: `${this.state.colSizes[index]}%`, maxWidth: `${this.state.colSizes[index]}%` }}
            >
              <Col ref={ref => (this.colRefs[index] = ref)} />
              {renderSlider(index, this.state.colSizes)}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Section;
