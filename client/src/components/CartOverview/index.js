import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Button, Icon } from 'semantic-ui-react';
import MobilePay from 'react-mobilepay'
import Progress from '../Progress';

export default withRouter(class CartOverview extends Component {

  goToCart = () => {
    this.props.history.push(`/cart`);
  }

  goBack = () => {
    this.props.history.goBack();
  }

  render() {

    const { items, location } = this.props;
    const totalPrice = items.reduce((p, v) => p + v.amount * v.price, 0).toFixed(2);

    const isCart = location.pathname === '/cart';

    const totalInCart = items.reduce((p, v) => p + v.amount, 0);
    const totalHealth = totalInCart !== 0 ? (items.reduce((p, v) => p + v.amount * v.health, 0)) / totalInCart : 0;
    const totalSustainability = totalInCart !== 0 ? (items.reduce((p, v) => p + v.amount * v.sustainability, 0)) / totalInCart : 0;

    return (
      <Card.Group className={`cart-overview ${(totalPrice < 0.01 && !isCart ? 'hidden' : '')}`}>
        <Card>
          <Card.Content>
            <Card.Header>TOTAL: <span>{totalPrice}€</span></Card.Header>
            <div className="progress">
              <Progress value={Math.round(totalSustainability * 100)} hideText={true} type='sustainable' />
              Average
            </div>
            <div className="progress">
              <Progress value={Math.round(totalHealth * 100)} hideText={true} type='health' />
              Average
            </div>
          </Card.Content>
          <Card.Content extra>
            {isCart ? 
              <Button icon labelPosition='left' onClick={this.goBack}>
                Go back <Icon name='arrow left' />
              </Button> :
              <Button icon labelPosition='right' onClick={this.goToCart}>
                View contents <Icon name='list ol' />
              </Button>
            }
            {!isCart ?
              <Button color='orange' icon labelPosition='right' onClick={this.goToCart} disabled={items.length === 0}>
                Payment <Icon name='right arrow' />
              </Button>
            : 
              <MobilePay className="mobilepay" amount={totalPrice} currency={978} lang="en" size="large" color="blue" />
            }
          </Card.Content>
        </Card>
      </Card.Group>
    );
  }
});
