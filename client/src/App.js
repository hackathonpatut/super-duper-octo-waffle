import React, { Component } from 'react';
import ScannerView from './components/Scanner/ScannerView';
import Product from './components/Product';
import './App.css';

class App extends Component {
  state = { ean: null };

  changeEan = (ean) => {
    this.setState({ ean });
  }

  render() {
    const { ean } = this.state;

    return (
      <div>
        { ean ? <Product ean={ean} />  : <ScannerView onChange={this.changeEan} /> }
      </div>
    );
  }
}
export default App;
