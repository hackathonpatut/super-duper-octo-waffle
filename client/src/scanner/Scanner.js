import React from 'react';
import Quagga from 'quagga';

export default class Scanner extends React.Component {
  render() {
    return <div id="interactive" className="viewport" />;
  }

  componentDidMount() {
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          constraints: {
            width: 640,
            height: 480,
            facing: 'environment' // or user
          }
        },
        locator: {
          patchSize: 'medium',
          halfSample: true
        },
        numOfWorkers: 2,
        decoder: {
          readers: ['ean_reader'],
          debug: {
            drawBoundingBox: true,
            showFrequency: true,
            drawScanline: true,
            showPattern: true
          }
        },
        locate: true
      },
      function(err) {
        if (err) {
          return console.log(err);
        }
        Quagga.start();
      }
    );
    Quagga.onDetected(this.props.onDetected);
  }

  componentWillUnmount() {
    Quagga.offDetected(this.props.onDetected);
  }
}
