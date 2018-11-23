import React from 'react';
import axios from 'axios';
import { Button } from 'semantic-ui-react';

import Scanner from './Scanner';

import '../styles/scanner.css';

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
        <Button
          id="scan-button"
          onClick={() => this.scan()}
          primary={!this.state.scanning}
          color={this.state.scanning ? 'red' : ''}
        >
          {this.state.scanning ? 'Cancel' : 'Scan code'}
        </Button>
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
