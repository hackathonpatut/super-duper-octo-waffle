import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

export default class Cart extends Component {
  render() {
    const { items } = this.props;

    if (items.length < 1) return <p>Empty list</p>;

    return (
      <div>
        <ul>
          {items.map((item, i) => <li key={i}>{item.name}, {item.price} €</li>)}
        </ul>
        <Button onClick={this.props.closeList}>Close list</Button>
      </div>
    );
  }
}
