import React, { Component } from 'react';
import { Item, Card, Image, Dimmer, Loader, Statistic, Divider } from 'semantic-ui-react';
import axios from 'axios';

export default class Product extends Component {
  state = {
    code: null,
    name: null,
    price: null,
    segment: null,
    sustainability: 10,
    health: 60,
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

  scoreToColor = (score) => {
    if (score < 30) return 'red';
    if (score < 80) return 'orange';
    return 'green';
  }

  render() {
    if (this.state.code === -1) return <p>Product not found</p>;
    if (this.state.code === null) return (
      <div className="product-card">
        <Card>
          <div style={{minHeight: '300px'}}>
            <Dimmer active inverted>
              <Loader>Loading...</Loader>
            </Dimmer>
          </div>
          <Card.Content>
            <Card.Header>Loading...</Card.Header>
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
            <Card.Meta className="infotext">
              <span>{`EAN: ${this.props.ean}` || 'EAN: XXX'}</span>
              <span>{this.state.price} €</span>
            </Card.Meta>
            <Card.Description>
              <Statistic.Group size="medium">
                <Statistic color={this.scoreToColor(this.state.sustainability)}>
                  <Statistic.Value>{this.state.sustainability}</Statistic.Value>
                  <Statistic.Label>Sustainability</Statistic.Label>
                </Statistic>
                <Statistic color={this.scoreToColor(this.state.health)}>
                  <Statistic.Value>{this.state.health}</Statistic.Value>
                  <Statistic.Label>Health</Statistic.Label>
                </Statistic>
              </Statistic.Group>
              <Divider />
              <p>How about</p>
            </Card.Description>
          </Card.Content>
        </Card>
      </div>
    );
  }
}
