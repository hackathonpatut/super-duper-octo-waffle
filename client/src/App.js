import React, { Component } from 'react';
import { Menu, Icon, Button } from 'semantic-ui-react'

import Scanner from './components/Scanner';
import Product from './components/Product';
import Cart from './components/Cart';

const Header = ({ resetEan, showList }) => <Menu fixed='top' inverted>
  <Menu.Item as='a' header>
    Super scanner
  </Menu.Item>
  <Menu.Item as='a' onClick={showList}>
    List
  </Menu.Item>
  <Menu.Item as='a' onClick={resetEan}>
    <Icon className="barcode" name='barcode' size='large' />
  </Menu.Item>
</Menu>;

class App extends Component {
  state = {
    // ean: null,
    ean: 6420256014004,
    showList: false,
    cart: [
      {
        name: 'jepa jee',
        price: 12.34,
      }
    ],
  };

  changeEan = (result) => {
    this.setState({ ean: result.codeResult.code });
  }

  resetEan = () => {
    this.setState({ ean: null });
  }

  showList = () => {
    this.setState({ showList: true });
  }

  closeList = () => {
    this.setState({ showList: false });
  }

  addToCart = (newProd) => {
    const cart = this.state.cart.concat([newProd]);
    this.setState({ cart });
  }

  render() {
    const { showList, ean } = this.state;

    return (
      <div className="App">
        <Header resetEan={this.resetEan} showList={this.showList} />
        { showList
          ? <Cart items={this.state.cart} closeList={this.closeList} />
          : ( ean
              ? <Product ean={ean} addToCart={this.addToCart} />
              : <Scanner onDetected={this.changeEan} />
            )
        }
        <div style={{ marginTop: 400 }}>
          <Button onClick={() => this.changeEan({ codeResult: { code: '8717775818090' }})}>ES</Button>
          <Button onClick={() => this.changeEan({ codeResult: { code: '6410405060457' }})}>Tomaatti</Button>
          <Button onClick={() => this.changeEan({ codeResult: { code: '6420256014004' }})}>Purkka</Button>
        </div>
      </div>
    );
  }
}
export default App;
