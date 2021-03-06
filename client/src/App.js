import React, { Component } from 'react';
import _ from 'lodash';
import { ToastContainer } from 'react-toastify';
import { Menu, Icon } from 'semantic-ui-react'
import { Route, Switch, withRouter, Link } from 'react-router-dom';

import Scanner from './components/Scanner';
import Product from './components/Product';
import CartOverview from './components/CartOverview';
import Cart from './components/Cart';
import Review from './components/Review';

const Header = () => <Menu fixed='top' inverted>
  <Menu.Item header>
    EASIER
  </Menu.Item>
  <Menu.Item style={{ position: 'absolute', right: -5, top: -5 }}>
    <Link to='/'>
      <Icon className="barcode" name='barcode' size='large' />
    </Link>
  </Menu.Item>
</Menu>;

class App extends Component {
  state = {
    // {amount: number, name: string, price: number}
    cart: [],
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
    const existingProduct = _.find(this.state.cart, o => o.name === newProd.name);

    const productToAdd = existingProduct ? {
      ...newProd,
      amount: existingProduct.amount + newProd.amount,
    } : newProd;

    const without = this.state.cart.filter(o => o.name !== newProd.name);
    this.setState({ cart: without.concat(productToAdd) });
  }

  removeUnitFromCart = (name) => {
    const existingProduct = _.find(this.state.cart, o => o.name === name);
    if (existingProduct) {
      if (existingProduct.amount === 1) {
        const without = this.state.cart.filter(o => o.name !== name);
        this.setState({ cart: without});
      } else {
        const newProduct = {
          ...existingProduct,
          amount: existingProduct.amount -1,
        }
        const without = this.state.cart.filter(o => o.name !== name);
        this.setState({ cart: without.concat(newProduct) });
      }
    }
  }

  handleSuggestionClick = (ean) => {
    this.changeEan({ codeResult: { code: ean }});
  }

  render() {
    return (
      <div className="App">
        <ToastContainer/>
        <Header />
        <Switch>
          <Route exact path='/' render={() =>
            <Scanner onDetected={this.changeEan} />
          }/>
          <Route path='/cart' render={
            () =>
              <Cart
                items={this.state.cart}
                closeList={this.closeList}
                removeUnitFromCart={this.removeUnitFromCart}
                handleItemClick={this.handleSuggestionClick}
              />
            }
          />
          <Route path='/review' render={() => <Review items={this.state.cart} />}/>
          <Route path='/product/:ean' render={
            () =>
              <Product
                addToCart={this.addToCart}
                items={this.state.cart}
                handleSuggestionClick={this.handleSuggestionClick}
              />
            }
          />
        </Switch>
        <CartOverview
          items={this.state.cart}
        />
      </div>
    );
  }
}
export default withRouter(App);
