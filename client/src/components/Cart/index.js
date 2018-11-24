import React, { Component } from 'react';
import _ from 'lodash';
import { Button, List } from 'semantic-ui-react'

export default class Cart extends Component {
  render() {
    const { items, removeUnitFromCart, handleItemClick } = this.props;

    if (items.length < 1) return <p>Empty list</p>;

    const sortedList = _.sortBy(items, 'name');

    return (
      <div className="cart-info page">
        <List divided verticalAlign='middle'>
          {sortedList.map(item => (
            <List.Item key={item.name} className="suggestion-list-item" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
               <div className="suggestion-image" style={{ alignSelf: 'center' }}>
                <img style={{ width: 'auto', height: '100%' }} src={`${item.image || "http://placehold.it/200x200"}`} />
              </div>
              <div style={{ fontSize: '16px', alignSelf: 'center', marginRight: '20px' }}>
                X{item.amount}
              </div>
              <List.Content onClick={() => handleItemClick(item.ean)} style={{ flexGrow: 1, alignSelf: 'center' }}>
                <List.Header as='a' style={{ display: 'flex', justifyContent: 'space-between'}}>
                  <span>{item.name}</span>
                </List.Header>
                <List.Description>
                  {`Price / unit: ${item.price}€, total: ${(item.price * item.amount).toFixed(2)}€`}
                </List.Description>
              </List.Content>
              <List.Content floated='right' style={{ alignSelf: 'center' }}>
                <Button onClick={() => removeUnitFromCart(item.name)}>Remove</Button>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </div>
    );
  }
}
