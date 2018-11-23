import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react'

import Scanner from './components/Scanner';
import Product from './components/Product';

const Header = ({ resetEan }) => <Menu fixed='top' inverted>
  <Menu.Item as='a' header>
    Super scanner
  </Menu.Item>

  <Icon className="barcode" name='barcode' size='large' color='orange' bordered inverted onClick={resetEan} />
</Menu>;

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
      <div className="App">
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
