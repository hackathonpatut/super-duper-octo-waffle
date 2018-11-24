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
            width: 400,
            height: 400,
            facingMode: 'environment'
          }
        },
        locator: {
          patchSize: 'large',
          halfSample: true
        },
        numOfWorkers: 2,
        decoder: {
          readers: ['ean_reader']
        },
        locate: false
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
    window.navigator.vibrate(200);
    Quagga.offDetected(this.props.onDetected);
  }
}
