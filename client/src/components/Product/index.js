import React, { Component } from 'react';
import { Item, Card, Image, Dimmer, Loader } from 'semantic-ui-react';
import axios from 'axios';

export default class Product extends Component {
  state = {
    code: null,
    name: null,
    price: null,
    segment: null
  };

  componentDidMount() {
    const { ean } = this.props;
    

    axios
      .get(`/product/${ean}`)
      .then(response => {
        if (response.data.code === -1) {
          // 404
          this.setState({ code: -1 });
        } else {
          console.log(response);
          const { name, price, segment, image } = response.data;
          this.setState({ code: ean, name, price: price.value, image });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ code: null });
      });
  }

  render() {
    if (this.state.code === -1) return <p>Tuotetta ei löytynyt</p>;
    if (this.state.code === null) return (
      <div className="product-card">
        <Card>
          <div style={{minHeight: '300px'}}>
            <Dimmer active inverted>
              <Loader>Ladataan...</Loader>
            </Dimmer>
          </div>
          <Card.Content>
            <Card.Header>Ladataan...</Card.Header>
          </Card.Content>
        </Card>
      </div>
    );

    return (
      <div className="product-card">
        <Card>
          <Image src={`${this.state.image || "http://placehold.it/200x200"}`} />
          <Card.Content>
            <Card.Header>{this.state.name}</Card.Header>
            <Card.Meta>
              <span>{`EAN: ${this.props.ean}` || 'EAN: XXX'}</span>
            </Card.Meta>
            <Card.Description>
              <div>
                Sustainability
              </div>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            {this.state.price} €
          </Card.Content>
        </Card>
      </div>
    );
  }
}
