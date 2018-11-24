import React, { Component } from 'react';
import { Progress, Button } from 'semantic-ui-react';

export default class Cart extends Component {
  render() {
    const { items } = this.props;

    if (items.length < 1) return <p>Empty list</p>;

    return (
      <div>
        <h3>Your cart</h3>
        <p><strong>Nicely done, Patu!</strong> Your overall score was 56 % better than your mates. Keep going!</p>
        <h4>Overall score</h4>
        <Progress percent={13} color='teal' />
        <h4>Sustainability score</h4>
        <Progress percent={23} color='purple' />
        <p>Produced far away.</p>
        <h4>Health score</h4>
        <Progress percent={37} color='olive' />
        <p>Quite much sugar.</p>
        <ul>
          {items.map((item, i) => <li key={i}>{item.name}, {item.price} €</li>)}
        </ul>
        <Button onClick={this.props.closeList}>Close list</Button>
      </div>
    );
  }
}
