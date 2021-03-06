import React from 'react';
import Quagga from 'quagga';

export default class Scanner extends React.Component {
  render() {
    return <div id="scanner-bg"><div id="interactive" className="viewport" /></div>;
  }

  componentDidMount() {
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          constraints: {
            width: Math.min(400, window.innerWidth), //(window.visualViewport ? window.visualViewport.width : window.innerWidth),
            height: Math.min(400, window.innerHeight - 200),
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
        locate: true,
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
