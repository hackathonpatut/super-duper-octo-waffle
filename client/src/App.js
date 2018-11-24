import React, { Component } from 'react';
import { Menu, Icon, Button } from 'semantic-ui-react'
import { Route, Switch, withRouter, Link } from 'react-router-dom';

import Scanner from './components/Scanner';
import Product from './components/Product';
import CartOverview from './components/CartOverview';
import Cart from './components/Cart';

const Header = () => <Menu fixed='top' inverted>
  <Menu.Item header>
    Super scanner
  </Menu.Item>
  <Menu.Item>
    <Link to='/cart'>
      List
    </Link>
  </Menu.Item>
  <Menu.Item>
    <Link to='/'>
      <Icon className="barcode" name='barcode' size='large' />
    </Link>
  </Menu.Item>
</Menu>;

class App extends Component {
  state = {
    cart: [
      {
        name: 'jepa jee',
        price: 12.34,
      }
    ],
  };

  changeEan = (result) => {
    const ean = result.codeResult.code;
    if (!ean) {
      console.log('Invalid EAN!')
    } else {
      this.props.history.push(`/product/${ean}`)
    }
  }


  addToCart = (newProd) => {
    const cart = this.state.cart.concat([newProd]);
    this.setState({ cart });
  }

  handleSuggestionClick = (ean) => {
    this.changeEan({ codeResult: { code: ean }});
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path='/' render={() => <Scanner onDetected={this.changeEan} />}/>
          <Route path='/cart' render={
            () => <Cart
              items={this.state.cart}
              closeList={this.closeList}
              />
            }
          />
          <Route path='/product/:ean' render={
            () => <div>
                <Product
                addToCart={this.addToCart}
                handleSuggestionClick={this.handleSuggestionClick}
                />
                <CartOverview />
              </div>
            }
          />
        </Switch>
        <div style={{ marginTop: 400 }}>
          <Button onClick={() => this.changeEan({ codeResult: { code: '8717775818090' }})}>ES</Button>
          <Button onClick={() => this.changeEan({ codeResult: { code: '6410405060457' }})}>Tomaatti</Button>
          <Button onClick={() => this.changeEan({ codeResult: { code: '6420256014004' }})}>Purkka</Button>
        </div>
      </div>
    );
  }
}
export default withRouter(App);
