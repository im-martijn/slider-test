// @flow
import React from 'react';

type Props = {
  children: (colSpans: Array<Number>) => ReactElement,
  cols: Array<Number>,
  getColSizes: () => Array<Number>,
  updateColSizes: (colSizes: Array<Number>) => void,
};

class ColSlider extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      colSpans: [],
    };
  }

  static defaultProps = {};

  setSliderPosition = (position: Number, index: Number) => {
    const newPositions = this.state.sliderPositions;
    newPositions[index] = position;
    this.setState({ sliderPositions: newPositions });
  };

  render() {
    const { children } = this.props;

    return (
      <div className="row">
        {children}
      </div>
    );
  }
}

export default ColSlider;
