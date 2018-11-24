import React, { Component } from 'react';
import { List, Card, Image, Dimmer, Loader, Statistic, Divider } from 'semantic-ui-react';
import axios from 'axios';

export default class Product extends Component {
  state = {
    code: null,
    name: null,
    price: null,
    segment: null,
    sustainability: 10,
    health: 60,
    sustainabilityChoices: [],
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
          const { name, price, segment, image, matching, origin } = response.data;

          const sustainabilityChoices = matching.sustainability.map(product => ({
            name: product.name,
            image: product.image,
            country: product.origin.country,
            price: product.price.value,
          })).slice(0, Math.min(matching.sustainability.length, 3));

          this.setState({ code: ean, name, price: price.value, image, sustainabilityChoices, country: origin.country });
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
          <Image size="small" centered src={`${this.state.image || "http://placehold.it/200x200"}`} />
          <Card.Content>
            <Card.Header>{this.state.name}</Card.Header>
            <Card.Meta className="infotext">
              <span>{`EAN: ${this.props.ean}` || 'EAN: XXX'}</span>
              <span>{this.state.price} €</span>
            </Card.Meta>
            <Card.Meta>
              <span>{`Origin: ${this.state.country}`}</span>
            </Card.Meta>
            <Card.Description>
              <Statistic.Group size="small">
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
              <h5>Be more sustainable!</h5>
              <List>
                {this.state.sustainabilityChoices.map((choice, ind) => (
                  <React.Fragment key={choice.name}>
                    <List.Item>
                      <Image className="avatar-image" avatar src={`${choice.image || "http://placehold.it/200x200"}`} />
                      <List.Content style={{ flexGrow: 1 }}>
                        <List.Header as='a' style={{ display: 'flex', justifyContent: 'space-between'}}>
                          <span>{choice.name}</span>
                          <span style={{color: this.scoreToColor(24), paddingLeft: '10px'}}>24</span>
                        </List.Header>
                        <List.Description>
                          <span className="choiceInfo">{`Origin: ${choice.country}, price: ${choice.price} €`}</span>
                        </List.Description>
                      </List.Content>
                    </List.Item>
                  </React.Fragment>
                ))}
              </List>
            </Card.Description>
          </Card.Content>
        </Card>
      </div>
    );
  }
}
