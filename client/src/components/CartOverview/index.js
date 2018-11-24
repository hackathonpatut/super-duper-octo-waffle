import React, { Component } from 'react';
import { Card, Button, Icon } from 'semantic-ui-react';
import Progress from '../Progress';

export default class CartOverview extends Component {
  render() {

    const { items, goToCart } = this.props;
    const totalPrice = items.reduce((p, v) => p + v.amount * v.price, 0).toFixed(2);

    return (
      <Card.Group className={`cart-overview ${(totalPrice < 0.01 ? 'hidden' : '')}`}>
        <Card>
          <Card.Content>
            <Card.Header>TOTAL: <span>{totalPrice}€</span></Card.Header>
            <div className="progress">
              <Progress value={40} hideText={true} type='sustainable' />
              Average
            </div>
            <div className="progress">
              <Progress value={80} hideText={true} type='health' />
              Average
            </div>
          </Card.Content>
          <Card.Content extra>
              <Button icon labelPosition='right' onClick={goToCart}>
                View contents <Icon name='list ol' />
              </Button>
              <Button color='orange' icon labelPosition='right' onClick={goToCart}>
                Payment <Icon name='right arrow' />
              </Button>
          </Card.Content>
        </Card>
      </Card.Group>
    );
  }
}
