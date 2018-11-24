import React, { Component } from 'react';
import { Item } from 'semantic-ui-react';
import axios from 'axios';

export default class Product extends Component {
  state = {
    code: null,
    name: null,
    price: null,
    segment: null
  };

  componentWillReceiveProps() {
    const { ean } = this.props;

    axios
      .get(`/product/${ean}`)
      .then(response => {
        if (response.data.code === -1) {
          // 404
          this.setState({ code: -1 });
        } else {
          console.log(response);
          const { name, price, segment } = response.data;
          this.setState({ code: ean, name, price: price.value });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ code: null });
      });
  }

  render() {
    if (this.state.code === -1) return <p>Tuotetta ei löytynyt</p>;
    if (this.state.code === null) return <p>Ladataan...</p>;

    return (
      <div>
        <Item.Group>
          <Item>
            <Item.Image size="tiny" src="http://placehold.it/200x200" />
            <Item.Content>
              <Item.Header>{this.state.name}</Item.Header>
              <Item.Meta>{this.state.price} €</Item.Meta>
            </Item.Content>
          </Item>
        </Item.Group>
        <p>EAN: {this.props.ean}</p>
      </div>
    );
  }
}
