import React from 'react';
import axios from 'axios';
import Scanner from './Scanner';

export default class ScannerView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scanning: false,
      code: ''
    };

    this.onDetected = this.onDetected.bind(this);
  }

  render() {
    return (
      <div id="scanner-view">
        <button id="scan-button" onClick={() => this.scan()}>
          {this.state.scanning ? 'Stop' : 'Start'}
        </button>
        <p>
          {this.state.code && this.state.code !== ''
            ? `Code: ${this.state.code}`
            : 'No code detected'}
        </p>
        {this.state.scanning ? <Scanner onDetected={this.onDetected} /> : null}
      </div>
    );
  }

  scan() {
    this.setState({ scanning: !this.state.scanning });
  }

  onDetected(result) {
    axios
      .get(`/product/${result.codeResult.code}`)
      .then(() =>
        this.setState({ code: result.codeResult.code, scanning: false })
      )
      .catch(err => {
        console.log(err);
        this.setState({ scanning: false });
      });
  }
}
