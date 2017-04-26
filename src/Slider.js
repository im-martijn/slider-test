// @flow
import React, { Component } from 'react';

type Props = {
  threshold: Number,
  value: Number,
  onStop: () => void,
  index: Number,
  offset: Number,
};

type Position = Number;

type StateProps = {
  x: Position,
  isDragging: Boolean,
};

/**
 * This component will give you sliding values once dragging.
 */
class Slider extends Component {
  props: Props;
  state: StateProps;

  /**
   * Data to define starting point
   */
  dragData: {
    startX: Number,
  };

  constructor(props) {
    super(props);

    this.state = {
      x: props.value,
      isDragging: false,
    };

    this.dragData = {
      startX: 0,
    };
  }

  /**
   * MouseEvent. Mouse is moving over the screen.
   */
  mouseMove = (event: MouseEvent) => {
    const x = event.clientX;
    //if we are ready to start moving the comment we will be changing the State
    if (this.canMove(x)) {
      this.moveTo(x);
    }
  };

  /**
   * Set the new positions and triggers a onChange event.
   * @param {Position} position
   */
  moveTo(position: Position) {
    this.setState({ x: this.getDistance(position) });
    this.props.onChange(this.state.x, this.props.index);
  }

  /**
   * Gives you the distance between start and end.
   * @param {x} x-position
   */
  getDistance(x) {
    return x - this.dragData.startX;
  }

  /**
   * Can we start changing the values? Depended on the threshold.
   * @param {x} x-position
   */
  canMove(x) {
    return Math.abs(this.getDistance(x)) > this.props.threshold;
  }

  /**
   * First attempt to start dragging. EventListeners will be set.
   */
  startMove = (event: MouseEvent) => {
    this.dragData.startX = event.clientX + -this.state.x;
    this.setState({ isDragging: true });
    document.addEventListener('mousemove', this.mouseMove, false);
    document.addEventListener('mouseup', this.stopDrag, false);
  };

  /**
   * On unmount we don't want to keep any eventlisteners left.
   */
  componentWillUnmount = () => {
    if (this.state.isDragging) {
      document.removeEventListener('mousemove', this.mouseMove);
      document.removeEventListener('mouseup', this.stopDrag);
      this.props.onStop(this.getDistance(event.clientX), this.props.index);
      this.setState({ isDragging: false });
    }
  };

  /**
   * User has stopped dragging. Time to trigger a onStop event with the distance as value and identifier.
   */
  stopDrag = (event: MouseEvent) => {
    document.removeEventListener('mousemove', this.mouseMove);
    document.removeEventListener('mouseup', this.stopDrag);
    this.setState({ isDragging: false });
    this.props.onStop(this.getDistance(event.clientX), this.props.index);
  };

  render() {
    const { isDragging, x } = this.state;
    return <div className="slider" onMouseDown={this.startMove} style={{ left: `${this.props.offset}%` }} />;
  }
}

Slider.defaultProps = {
  threshold: 2,
  value: 0,
};

export default Slider;
