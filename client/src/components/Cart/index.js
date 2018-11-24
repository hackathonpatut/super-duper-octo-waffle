import React, { Component } from 'react';
import { Button, Image, List } from 'semantic-ui-react'

export default class Cart extends Component {
  render() {
    const { items, removeUnitFromCart } = this.props;

    if (items.length < 1) return <p>Empty list</p>;

    return (
      <div className="cart-info">
        <List divided verticalAlign='middle'>
          {items.map(item => (
            <List.Item key={item.name} className="suggestion-list-item" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
               <div className="suggestion-image" style={{ alignSelf: 'center' }}>
                <img style={{ width: 'auto', height: '100%' }} src={`${item.image || "http://placehold.it/200x200"}`} />
              </div>
              <div style={{ fontSize: '16px', alignSelf: 'center', marginRight: '20px' }}>
                X{item.amount}
              </div>
              <List.Content style={{ flexGrow: 1, alignSelf: 'center' }}>
                <List.Header as='a' style={{ display: 'flex', justifyContent: 'space-between'}}>
                  <span>{item.name}</span>
                </List.Header>
                <List.Description>
                  {`Price / unit: ${item.price}€, total: ${(item.price * item.amount).toFixed(2)}€`}
                </List.Description>
              </List.Content>
              <List.Content floated='right' style={{ alignSelf: 'center' }}>
                <Button onClick={() => removeUnitFromCart(item.name)}>Remove 1</Button>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </div>
    );
  }
}
