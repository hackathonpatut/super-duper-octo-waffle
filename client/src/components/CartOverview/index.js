import React, { Component } from 'react';
import { Card, Button, Icon } from 'semantic-ui-react';
import Progress from '../Progress';

export default class CartOverview extends Component {
  render() {

    const { items } = this.props;
    const totalPrice = items.reduce((p, v) => p + v.amount * v.price, 0).toFixed(2);

    return (
      <Card.Group className="cart-overview">
        <Card>
          <Card.Content>
            <div className="progress">
              <Progress value={80} type='health' />
            </div>
            <div className="progress">
              <Progress value={40} type='sustainable' />
            </div>
            <Card.Header>Cart total: <span>{totalPrice}€</span></Card.Header>
          </Card.Content>
          <Card.Content extra>
              <Button icon labelPosition='right'>
                View contents <Icon name='list ol' />
              </Button>
              <Button color='orange' icon labelPosition='right'>
                Payment <Icon name='right arrow' />
              </Button>
          </Card.Content>
        </Card>
      </Card.Group>
    );
  }
}
