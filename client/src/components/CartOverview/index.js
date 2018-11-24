import React, { Component } from 'react';
import { Card, Button, Icon } from 'semantic-ui-react';

export default class CartOverview extends Component {
  render() {
    return (
      <Card.Group className="cart-overview">
        <Card>
          <Card.Content>
            <Card.Header>Cart total: 12,34 €</Card.Header>
          </Card.Content>
          <Card.Content extra>
              <Button color='standard' icon labelPosition='right'>
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
