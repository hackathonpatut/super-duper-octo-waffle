import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

import Scanner from './Scanner';

export default class ScannerView extends Component {
  state = {
    scanning: false,
  };

  scan = () => {
    this.setState({ scanning: !this.state.scanning });
  }

  onDetected = (result) => {
    this.props.onChange(result.codeResult.code);
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
        {this.state.scanning ? <Scanner onDetected={this.onDetected} /> : null}
      </div>
    );
  }
}
