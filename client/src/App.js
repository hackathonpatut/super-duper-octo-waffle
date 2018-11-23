import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react'

import Scanner from './components/Scanner';
import Product from './components/Product';
import './App.css';

const Header = ({ resetEan }) => <header className="header">
  Otsikko
  <Icon className="barcode" name='barcode' size='large' color='orange' bordered inverted onClick={resetEan} />
</header>;

class App extends Component {
  state = { ean: null };

  changeEan = (result) => {
    this.setState({ ean: result.codeResult.code });
  }

  resetEan = () => {
    this.setState({ ean: null });
  }

  render() {
    const { ean } = this.state;

    return (
      <div>
        <Header resetEan={this.resetEan} />
        { ean
          ? <Product ean={ean} />
          : <Scanner onDetected={this.changeEan} />
        }
      </div>
    );
  }
}
export default App;
