import React, { Component } from 'react';
import CircularProgressbar from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';

export default class Progress extends Component {
  render() {
    const { value, type } = this.props;

    const color = (type === 'health' ? '#2185d0' : '#21ba45');
    const text = (type === 'health' ? 'Healthy' : 'Ecological');

    const hideText = this.props.hideText || false;

    return (
      <CircularProgressbar
        percentage={value}
        text={(hideText ? null : text)}
        initialAnimation={true}
        styles={{
          path: { stroke: color },
          text: { fill: color, fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' },
        }}
      />
    );
  }
}
