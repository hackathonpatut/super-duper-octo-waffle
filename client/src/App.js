import React, { Component } from 'react';
import { Menu, Icon, Button } from 'semantic-ui-react'

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
  // state = { ean: 6420256014004 }

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
        <div style={{ marginTop: 500 }}>
          <Button onClick={() => this.changeEan({ codeResult: { code: '8717775818090' }})}>ES</Button>
          <Button onClick={() => this.changeEan({ codeResult: { code: '6410405060457' }})}>Tomaatti</Button>
          <Button onClick={() => this.changeEan({ codeResult: { code: '6420256014004' }})}>Purkka</Button>
        </div>
      </div>
    );
  }
}
export default App;
