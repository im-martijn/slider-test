// @flow
import React from 'react';

type Props = {
  children: ReactElement,
};

class Col extends React.Component {
  props: Props;

  // static defaultProps = {};

  render() {
    // const {} = this.props;
    return (
      <div>
        <span>Col</span>
        {this.props.children}
      </div>
    );
  }
}

export default Col;
