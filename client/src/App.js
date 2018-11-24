import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react'
import { Route, Switch, withRouter, Link } from 'react-router-dom';

import Scanner from './components/Scanner';
import Product from './components/Product';
import CartOverview from './components/CartOverview';
import Cart from './components/Cart';
import Review from './components/Review';

const Header = () => <Menu fixed='top' inverted>
  <Menu.Item header>
    K-SCANNER
  </Menu.Item>
  <Menu.Item style={{ position: 'absolute', right: -5, top: -5 }}>
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

    if (!ean || ean.startsWith('0')) {
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
          <Route path='/review' render={() => <Review />}/>
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
      </div>
    );
  }
}
export default withRouter(App);
